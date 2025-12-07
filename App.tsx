import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { InfoPanel } from './components/InfoPanel';
import { PromotionModal } from './components/PromotionModal';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal } from './components/HelpModal';
import { GameState, PendingPromotion } from './types';
import { RotateCcw, Play, CircleHelp, ArrowUpDown } from 'lucide-react';

const App: React.FC = () => {
  // We use a ref for the Chess instance to persist it across renders without triggering them directly
  const gameRef = useRef(new Chess());
  
  // State to force re-render and hold UI-relevant data
  const [gameState, setGameState] = useState<GameState>({
    fen: gameRef.current.fen(),
    turn: 'w',
    inCheck: false,
    isCheckmate: false,
    isDraw: false,
    isGameOver: false,
    history: [],
    uciHistory: [],
  });

  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  // Helper to update state from chess instance
  const updateGameState = useCallback(() => {
    const game = gameRef.current;
    
    // Get UCI history manually as chess.js history({ verbose: true }) doesn't give UCI string directly easily
    const historyVerbose = game.history({ verbose: true });
    const uciHistory = historyVerbose.map(m => m.from + m.to + (m.promotion || ''));

    setGameState({
      fen: game.fen(),
      turn: game.turn(),
      inCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isDraw: game.isDraw(),
      isGameOver: game.isGameOver(),
      history: game.history(),
      uciHistory: uciHistory,
    });
  }, []);

  const handleMove = (from: Square, to: Square) => {
    const game = gameRef.current;
    
    // 0. Prevent moves if game is over
    if (game.isGameOver()) return;

    // 1. Check if this is a promotion move
    const moves = game.moves({ verbose: true });
    const isPromotion = moves.some(m => m.from === from && m.to === to && m.promotion);

    if (isPromotion) {
      setPendingPromotion({ from, to, color: game.turn() });
      return;
    }

    // 2. Regular move
    try {
      const result = game.move({ from, to });
      if (result) {
        setLastMove({ from, to });
        updateGameState();
      }
    } catch (e) {
      console.error("Invalid move", e);
    }
  };

  const finalizePromotion = (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return;
    
    const game = gameRef.current;
    try {
      const result = game.move({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promotionPiece,
      });

      if (result) {
        setLastMove({ from: pendingPromotion.from, to: pendingPromotion.to });
        updateGameState();
      }
    } catch (e) {
      console.error("Invalid promotion move", e);
    } finally {
      setPendingPromotion(null);
    }
  };

  const resetGame = () => {
    gameRef.current.reset();
    setLastMove(null);
    setPendingPromotion(null);
    updateGameState();
  };

  const handleLoadFen = (fen: string): boolean => {
    const game = gameRef.current;
    try {
      // chess.js .load() throws an exception if FEN is invalid
      game.load(fen);
      setLastMove(null); // Clear last move highlight as history is wiped
      setPendingPromotion(null);
      updateGameState();
      return true;
    } catch (e) {
      console.error("Invalid FEN:", e);
      return false;
    }
  };

  const undoMove = () => {
    const game = gameRef.current;
    // Don't allow undo if game is over (optional choice, but standard behavior usually allows review)
    // But if we want strict 'Game Over' we could block it. 
    // For now, let's allow undoing a checkmate to continue playing.
    const undid = game.undo();
    if (undid) {
       // Update last move highlight to the move BEFORE the one we just undid
       const history = game.history({ verbose: true });
       if (history.length > 0) {
         const prev = history[history.length - 1];
         setLastMove({ from: prev.from, to: prev.to });
       } else {
         setLastMove(null);
       }
       updateGameState();
    }
  };

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'white' ? 'black' : 'white');
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center pt-8">
        
        {/* Left Column: Board & Controls */}
        <div className="w-full lg:flex-1 flex flex-col gap-6">
          
          <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                 <Play size={24} fill="white" />
               </div>
               <div>
                 <h1 className="text-xl font-bold leading-tight">React Chess</h1>
                 <p className="text-xs text-slate-500">Local Offline Play</p>
               </div>
             </div>
             
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsHelpOpen(true)}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-slate-200"
                  title="Come funziona"
                >
                  <CircleHelp size={18} />
                  <span className="hidden sm:inline">Help / Guida</span>
                </button>
                <div className="w-px h-8 bg-slate-200 mx-1"></div>
                <button 
                  onClick={toggleOrientation}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title="Flip Board / Ruota Scacchiera"
                >
                  <ArrowUpDown size={20} />
                </button>
                <button 
                  onClick={undoMove}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title="Undo Move"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm active:transform active:scale-95"
                >
                  New Game
                </button>
             </div>
          </div>

          <div className="w-full relative">
            <ChessBoard 
              game={gameRef.current} 
              fen={gameState.fen} 
              onMove={handleMove}
              lastMove={lastMove}
              orientation={orientation}
              isGameOver={gameState.isGameOver}
            />
          </div>

          <div className="text-center text-xs text-slate-400">
            Drag pieces to move • Tap to select • Logic via chess.js
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="w-full lg:w-auto">
          <InfoPanel 
            gameState={gameState} 
            onCopy={handleCopy} 
            copiedType={copiedType}
            onLoadFen={handleLoadFen}
          />
        </div>

      </div>

      {/* Modals */}
      {pendingPromotion && (
        <PromotionModal 
          color={pendingPromotion.color} 
          onSelect={finalizePromotion} 
          onCancel={() => setPendingPromotion(null)} 
        />
      )}

      {/* Game Over Modal */}
      {(gameState.isCheckmate || gameState.isDraw) && (
        <GameOverModal 
          gameState={gameState} 
          onRestart={resetGame} 
        />
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <HelpModal onClose={() => setIsHelpOpen(false)} />
      )}
    </div>
  );
};

export default App;