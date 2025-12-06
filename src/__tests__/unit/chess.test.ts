/**
 * Unit Tests: Chess Logic
 * Tests core chess move validation and FEN parsing
 */

import { validateMove, isCheckmate } from '@/lib/chess';
import { Chess } from 'chess.js';

// Helper to parse FEN for testing
function parseFen(fen: string) {
  const game = new Chess(fen);
  const board = game.board();
  const position: Record<string, { type: string; color: string }> = {};
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  board.forEach((row, rankIdx) => {
    row.forEach((square, fileIdx) => {
      if (square) {
        const squareNotation = `${files[fileIdx]}${8 - rankIdx}`;
        position[squareNotation] = { type: square.type, color: square.color };
      }
    });
  });
  
  return { position, turn: game.turn() };
}

describe('Chess Logic - Unit Tests', () => {
  describe('parseFen', () => {
    it('should parse standard starting position', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const result = parseFen(fen);
      
      expect(result).toHaveProperty('position');
      expect(result.position['e1']).toEqual({ type: 'k', color: 'w' });
      expect(result.position['e8']).toEqual({ type: 'k', color: 'b' });
    });

    it('should parse empty squares correctly', () => {
      const fen = 'rnbqk2r/pppppppp/8/8/8/8/8/4R2K w KQkq - 0 1';
      const result = parseFen(fen);
      
      expect(result.position['e1']).toEqual({ type: 'r', color: 'w' });
      expect(result.position['a1']).toBeUndefined();
      expect(result.position['h1']).toEqual({ type: 'k', color: 'w' });
    });

    it('should handle piece positions accurately', () => {
      const fen = 'rnbqkbnr/pppppppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1';
      const result = parseFen(fen);
      
      expect(result.position['d5']).toEqual({ type: 'p', color: 'b' });
      expect(result.position['d4']).toEqual({ type: 'p', color: 'w' });
    });
  });

  describe('validateMove', () => {
    it('should validate legal rook moves', () => {
      const fen = '4k3/8/8/8/8/8/8/4K2R w - - 0 1';
      const move = validateMove(fen, 'h1', 'h8');
      
      expect(move).not.toBeNull();
      expect(move?.from).toBe('h1');
      expect(move?.to).toBe('h8');
    });

    it('should reject illegal diagonal moves for rooks', () => {
      const fen = '4k3/8/8/8/8/8/8/4K2R w - - 0 1';
      const move = validateMove(fen, 'h1', 'e4');
      
      expect(move).toBeNull();
    });

    it('should validate pawn moves', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
      const move = validateMove(fen, 'e4', 'e5');
      expect(move).not.toBeNull();
    });

    it('should reject invalid pawn moves', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
      const move = validateMove(fen, 'e4', 'e6');
      expect(move).toBeNull();
    });
  });

  describe('isCheckmate', () => {
    it('should detect checkmate', () => {
      // Scholar's mate position
      const fen = 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4';
      
      expect(isCheckmate(fen)).toBe(true);
    });

    it('should not detect checkmate in normal position', () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      
      expect(isCheckmate(fen)).toBe(false);
    });
  });
});
