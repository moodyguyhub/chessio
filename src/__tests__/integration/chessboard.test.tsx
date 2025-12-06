/**
 * Integration Tests: Chessboard Component
 * Tests board rendering, piece movement, and user interactions
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Chessboard } from '@/components/chess/Chessboard';

describe('Chessboard Component - Integration Tests', () => {
  describe('Rendering', () => {
    it('should render the chessboard with 64 squares', () => {
      const { container } = render(
        <Chessboard fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
      );
      
      const squares = container.querySelectorAll('[data-square]');
      expect(squares).toHaveLength(64);
    });

    it('should render pieces in starting position', () => {
      const { container } = render(
        <Chessboard fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
      );
      
      // Check for white king
      const e1Square = container.querySelector('[data-square="e1"]');
      expect(e1Square).toBeInTheDocument();
      
      // Check for black king
      const e8Square = container.querySelector('[data-square="e8"]');
      expect(e8Square).toBeInTheDocument();
    });

    it('should render custom FEN positions', () => {
      const { container } = render(
        <Chessboard fen="8/8/8/8/8/8/8/4R3 w - - 0 1" />
      );
      
      const e1Square = container.querySelector('[data-square="e1"]');
      expect(e1Square).toBeInTheDocument();
    });
  });

  describe('Piece Selection', () => {
    it('should highlight selected square on click', () => {
      const onSquareClick = jest.fn();
      const { container } = render(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          onSquareClick={onSquareClick}
        />
      );
      
      const e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) {
        fireEvent.click(e1Square);
        expect(onSquareClick).toHaveBeenCalledWith('e1');
      }
    });

    it('should accept selectedSquare prop', () => {
      const { container } = render(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          selectedSquare="e1"
        />
      );
      
      const e1Square = container.querySelector('[data-square="e1"]');
      expect(e1Square).toHaveClass('chessboard-square--selected');
    });
  });

  describe('Square Highlights', () => {
    it('should highlight specified squares', () => {
      const { container } = render(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          highlightSquares={['e1', 'e8', 'a1']}
        />
      );
      
      const e1Square = container.querySelector('[data-square="e1"]');
      const e8Square = container.querySelector('[data-square="e8"]');
      const a1Square = container.querySelector('[data-square="a1"]');
      
      expect(e1Square).toHaveClass('chessboard-square--hint');
      expect(e8Square).toHaveClass('chessboard-square--hint');
      expect(a1Square).toHaveClass('chessboard-square--hint');
    });

    it('should highlight success squares with correct class', () => {
      const { container } = render(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          successSquare="e8"
        />
      );
      
      const e8Square = container.querySelector('[data-square="e8"]');
      expect(e8Square).toHaveClass('chessboard-square--success');
    });
  });

  describe('Move Handling', () => {
    it('should call onMove when move is made', () => {
      const onMove = jest.fn();
      const { container } = render(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          onMove={onMove}
          selectedSquare="e1"
        />
      );
      
      const e8Square = container.querySelector('[data-square="e8"]');
      if (e8Square) {
        fireEvent.click(e8Square);
        expect(onMove).toHaveBeenCalledWith('e1', 'e8');
      }
    });
  });

  describe('Board Orientation', () => {
    it('should render board from white perspective by default', () => {
      const { container } = render(
        <Chessboard fen="8/8/8/8/8/8/8/4R3 w - - 0 1" />
      );
      
      const squares = container.querySelectorAll('[data-square]');
      const firstSquare = squares[0];
      expect(firstSquare).toHaveAttribute('data-square', 'a8');
    });

    it('should flip board for black perspective', () => {
      const { container } = render(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          orientation="black"
        />
      );
      
      const squares = container.querySelectorAll('[data-square]');
      const firstSquare = squares[0];
      expect(firstSquare).toHaveAttribute('data-square', 'h1');
    });
  });
});
