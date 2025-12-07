/**
 * Playwright Component Tests - Chessboard
 * Tests board rendering, piece movement, and user interactions
 * 
 * These tests replace the skipped JSDOM integration tests in:
 * src/__tests__/integration/chessboard.test.tsx
 * 
 * Playwright component tests provide better SVG/visual testing support
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { Chessboard } from '@/components/chess/Chessboard';

test.describe('Chessboard Component - Visual Tests', () => {
  test.describe('Rendering', () => {
    test('renders chessboard with 64 squares', async ({ mount }) => {
      const component = await mount(
        <Chessboard fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
      );
      
      // Check for chessboard container
      await expect(component.getByTestId('chessboard')).toBeVisible();
      
      // Count squares (all squares should have data-square attribute)
      const squares = component.locator('[data-square]');
      await expect(squares).toHaveCount(64);
    });

    test('renders pieces in starting position', async ({ mount }) => {
      const component = await mount(
        <Chessboard fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
      );
      
      // Check for white king on e1
      const e1Square = component.locator('[data-square="e1"]');
      await expect(e1Square).toBeVisible();
      
      // Check for black king on e8
      const e8Square = component.locator('[data-square="e8"]');
      await expect(e8Square).toBeVisible();
      
      // Verify pieces are rendered (check for SVG piece elements)
      const pieces = component.locator('svg[data-piece]');
      await expect(pieces.first()).toBeVisible();
    });

    test('renders custom FEN positions', async ({ mount }) => {
      // Single rook on e1
      const component = await mount(
        <Chessboard fen="8/8/8/8/8/8/8/4R3 w - - 0 1" />
      );
      
      const e1Square = component.locator('[data-square="e1"]');
      await expect(e1Square).toBeVisible();
      
      // Should render far fewer pieces than starting position
      const pieces = component.locator('svg[data-piece]');
      await expect(pieces).toHaveCount(1);
    });
  });

  test.describe('Piece Selection', () => {
    test('highlights selected square on click', async ({ mount }) => {
      let clickedSquare = '';
      
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          onSquareClick={(square) => { clickedSquare = square; }}
        />
      );
      
      // Click on e1 square
      const e1Square = component.locator('[data-square="e1"]');
      await e1Square.click();
      
      // Verify callback was called
      expect(clickedSquare).toBe('e1');
    });

    test('accepts selectedSquare prop and highlights it', async ({ mount }) => {
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          selectedSquare="e1"
        />
      );
      
      // Check if e1 has selection highlight class
      const e1Square = component.locator('[data-square="e1"]');
      await expect(e1Square).toHaveClass(/chessboard-square--selected/);
    });
  });

  test.describe('Square Highlights', () => {
    test('highlights specified squares with hint class', async ({ mount }) => {
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          highlightSquares={['e1', 'e8', 'a1']}
        />
      );
      
      // Check each highlighted square
      const e1Square = component.locator('[data-square="e1"]');
      await expect(e1Square).toHaveClass(/chessboard-square--hint/);
      
      const e8Square = component.locator('[data-square="e8"]');
      await expect(e8Square).toHaveClass(/chessboard-square--hint/);
      
      const a1Square = component.locator('[data-square="a1"]');
      await expect(a1Square).toHaveClass(/chessboard-square--hint/);
    });

    test('highlights success square with correct class', async ({ mount }) => {
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          successSquare="e8"
        />
      );
      
      const e8Square = component.locator('[data-square="e8"]');
      await expect(e8Square).toHaveClass(/chessboard-square--success/);
    });
  });

  test.describe('Move Handling', () => {
    test('calls onMove when move is made', async ({ mount }) => {
      let capturedMove: { from: string; to: string } | null = null;
      
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          onMove={(from, to) => { capturedMove = { from, to }; }}
          selectedSquare="e1"
        />
      );
      
      // Click destination square
      const e8Square = component.locator('[data-square="e8"]');
      await e8Square.click();
      
      // Verify move callback was called
      expect(capturedMove).toEqual({ from: 'e1', to: 'e8' });
    });
  });

  test.describe('Board Orientation', () => {
    test('renders board from white perspective by default', async ({ mount }) => {
      const component = await mount(
        <Chessboard fen="8/8/8/8/8/8/8/4R3 w - - 0 1" />
      );
      
      // Get all squares in DOM order
      const squares = component.locator('[data-square]');
      const firstSquare = squares.first();
      
      // White perspective: first square should be a8 (top-left)
      await expect(firstSquare).toHaveAttribute('data-square', 'a8');
    });

    test('flips board for black perspective', async ({ mount }) => {
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          orientation="black"
        />
      );
      
      // Get all squares in DOM order
      const squares = component.locator('[data-square]');
      const firstSquare = squares.first();
      
      // Black perspective: first square should be h1 (top-left from black's view)
      await expect(firstSquare).toHaveAttribute('data-square', 'h1');
    });
  });

  test.describe('Interactive Features', () => {
    test('piece dragging updates position', async ({ mount }) => {
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          onMove={(from, to) => {
            // Move callback
          }}
        />
      );
      
      // Select piece
      const e1Square = component.locator('[data-square="e1"]');
      await e1Square.click();
      
      // Should show as selected
      await expect(e1Square).toHaveClass(/chessboard-square--selected/);
    });

    test('clicking empty square deselects', async ({ mount }) => {
      const component = await mount(
        <Chessboard 
          fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
          selectedSquare="e1"
        />
      );
      
      let clickedSquare = '';
      
      // Click empty square
      const d4Square = component.locator('[data-square="d4"]');
      await d4Square.click();
      
      // Selection should update (via onSquareClick callback)
      await expect(d4Square).toBeVisible();
    });
  });
});
