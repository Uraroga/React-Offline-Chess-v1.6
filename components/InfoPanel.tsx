import React, { useState } from 'react';
import { GameState } from '../types';
import { Copy, ClipboardCheck, ArrowDownToLine, AlertCircle, Coffee } from 'lucide-react';

interface InfoPanelProps {
  gameState: GameState;
  onCopy: (text: string, type: string) => void;
  copiedType: string | null;
  onLoadFen: (fen: string) => boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ gameState, onCopy, copiedType, onLoadFen }) => {
  const { turn, inCheck, isCheckmate, isDraw, isGameOver, fen, history, uciHistory } = gameState;
  const [importFen, setImportFen] = useState('');
  const [fenError, setFenError] = useState<string | null>(null);

  const handleFenSubmit = () => {
    if (!importFen.trim()) return;
    
    const success = onLoadFen(importFen.trim());
    if (success) {
      setImportFen('');
      setFenError(null);
    } else {
      setFenError('FEN non valido. Controlla la stringa incollata.');
    }
  };

  let statusText = `${turn === 'w' ? "White" : "Black"}'s Turn`;
  let statusColor = "bg-blue-100 text-blue-800 border-blue-200";

  if (isCheckmate) {
    statusText = `Checkmate! ${turn === 'w' ? "Black" : "White"} Wins`;
    statusColor = "bg-red-100 text-red-800 border-red-200";
  } else if (inCheck) {
    statusText = `${turn === 'w' ? "White" : "Black"} is in Check!`;
    statusColor = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (isDraw) {
    statusText = "Draw / Stalemate";
    statusColor = "bg-gray-100 text-gray-800 border-gray-200";
  }

  const CopyButton = ({ text, type, label }: { text: string, type: string, label: string }) => (
    <button
      onClick={() => onCopy(text, type)}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
      title={`Copy ${label}`}
    >
      {copiedType === type ? <ClipboardCheck size={14} className="text-green-600" /> : <Copy size={14} />}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4 w-full lg:w-80 h-full">
      {/* Game Status */}
      <div className={`p-4 rounded-xl border-l-4 shadow-sm ${statusColor}`}>
        <h2 className="text-lg font-bold">{statusText}</h2>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[250px] overflow-hidden">
        <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Move History</h3>
          <div className="flex gap-2">
            <CopyButton text={history.join(" ")} type="SAN" label="SAN" />
            <CopyButton text={uciHistory.join(" ")} type="UCI" label="UCI" />
          </div>
        </div>
        <div className="p-0 flex-1 overflow-y-auto max-h-[300px]">
           {history.length === 0 ? (
             <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">
               No moves yet
             </div>
           ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 w-16">#</th>
                  <th className="px-4 py-2">White</th>
                  <th className="px-4 py-2">Black</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-400 font-mono text-xs">{i + 1}.</td>
                    <td className="px-4 py-2 font-medium text-slate-700">{history[i * 2]}</td>
                    <td className="px-4 py-2 font-medium text-slate-700">{history[i * 2 + 1] || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
           )}
        </div>
      </div>

      {/* FEN Display */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase">Current FEN</h3>
          <CopyButton text={fen} type="FEN" label="Copy" />
        </div>
        <div className="bg-slate-100 p-2 rounded text-xs font-mono text-slate-600 break-all border border-slate-200 select-all">
          {fen}
        </div>
      </div>

      {/* FEN Import */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Import FEN</h3>
        <textarea 
          className="w-full p-2 text-xs font-mono border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none mb-2"
          rows={2}
          placeholder="Paste FEN string here..."
          value={importFen}
          onChange={(e) => {
            setImportFen(e.target.value);
            if(fenError) setFenError(null);
          }}
        />
        {fenError && (
          <div className="mb-2 flex items-center gap-1 text-xs text-red-600 font-medium animate-fadeIn">
            <AlertCircle size={14} />
            {fenError}
          </div>
        )}
        <button 
          onClick={handleFenSubmit}
          disabled={!importFen.trim()}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2"
        >
          <ArrowDownToLine size={16} />
          Applica FEN
        </button>
      </div>

      {/* Donation Button */}
      <a 
        href="https://paypal.me/uraroga"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm group"
      >
        <Coffee size={18} className="text-amber-600 group-hover:scale-110 transition-transform" />
        Offri un caffè a uraroga
      </a>
    </div>
  );
};