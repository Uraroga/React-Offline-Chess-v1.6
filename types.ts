import { Square, PieceSymbol, Color } from 'chess.js';

export interface Piece {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export interface GameState {
  fen: string;
  turn: Color;
  inCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  history: string[]; // SAN history
  uciHistory: string[]; // UCI history
}

export type PendingPromotion = {
  from: Square;
  to: Square;
  color: Color;
} | null;
