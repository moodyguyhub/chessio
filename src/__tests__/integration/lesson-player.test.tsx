/**
 * Integration Tests: Lesson Engine
 * Tests lesson flow, task validation, and progress tracking
 * 
 * NOTE: Skipped due to Next.js server actions not being available in JSDOM
 * TODO: Migrate to Playwright component tests for full testing
 */

// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { LessonPlayer } from '@/components/chess/LessonPlayer';

// TODO(vega): Re-enable when we move these to Playwright component tests
// JSDOM doesn't support Next.js server actions (Request/Response objects)
describe.skip('Lesson Engine - Integration Tests', () => {
  describe('Task Flow', () => {
    it('should render first task instruction', () => {
      // render(<LessonPlayer lesson={mockLesson} />);
      // expect(screen.getByText('Move the rook to e8')).toBeInTheDocument();
    });

    it('should advance to next task on correct move', async () => {
      const { container } = render(<LessonPlayer lesson={mockLesson} />);
      
      // Select rook
      const e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) fireEvent.click(e1Square);
      
      // Move to e8
      const e8Square = container.querySelector('[data-square="e8"]');
      if (e8Square) fireEvent.click(e8Square);
      
      await waitFor(() => {
        expect(screen.getByText('Move the rook to a1')).toBeInTheDocument();
      });
    });

    it('should show success message on correct move', async () => {
      const { container } = render(<LessonPlayer lesson={mockLesson} />);
      
      const e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) fireEvent.click(e1Square);
      
      const e8Square = container.querySelector('[data-square="e8"]');
      if (e8Square) fireEvent.click(e8Square);
      
      await waitFor(() => {
        expect(screen.getByText(/Perfect!/)).toBeInTheDocument();
      });
    });

    it('should show error message on incorrect move', async () => {
      const { container } = render(<LessonPlayer lesson={mockLesson} />);
      
      const e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) fireEvent.click(e1Square);
      
      // Try invalid diagonal move
      const h4Square = container.querySelector('[data-square="h4"]');
      if (h4Square) fireEvent.click(h4Square);
      
      await waitFor(() => {
        expect(screen.getByText(/Rooks can only move in straight lines/)).toBeInTheDocument();
      });
    });
  });

  describe('Hint System', () => {
    it('should show hint button', () => {
      render(<LessonPlayer lesson={mockLesson} />);
      
      const hintButton = screen.getByRole('button', { name: /hint/i });
      expect(hintButton).toBeInTheDocument();
    });

    it('should display hint when button is clicked', async () => {
      render(<LessonPlayer lesson={mockLesson} />);
      
      const hintButton = screen.getByRole('button', { name: /hint/i });
      fireEvent.click(hintButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Rooks move vertically or horizontally/)).toBeInTheDocument();
      });
    });

    it('should track hints used count', async () => {
      render(<LessonPlayer lesson={mockLesson} />);
      
      const hintButton = screen.getByRole('button', { name: /hint/i });
      fireEvent.click(hintButton);
      fireEvent.click(hintButton);
      
      // Should show hints used in some form
      await waitFor(() => {
        expect(screen.getByText(/hint/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Completion', () => {
    it('should show completion modal after all tasks', async () => {
      const { container } = render(<LessonPlayer lesson={mockLesson} />);
      
      // Complete first task
      let e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) fireEvent.click(e1Square);
      let e8Square = container.querySelector('[data-square="e8"]');
      if (e8Square) fireEvent.click(e8Square);
      
      await waitFor(() => {
        expect(screen.getByText('Move the rook to a1')).toBeInTheDocument();
      });
      
      // Complete second task
      e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) fireEvent.click(e1Square);
      const a1Square = container.querySelector('[data-square="a1"]');
      if (a1Square) fireEvent.click(a1Square);
      
      await waitFor(() => {
        expect(screen.getByText(/completed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking', () => {
    it('should show task progress indicator', () => {
      render(<LessonPlayer lesson={mockLesson} />);
      
      // Should show "1 of 2" or similar
      expect(screen.getByText(/1.*2/)).toBeInTheDocument();
    });

    it('should update progress as tasks complete', async () => {
      const { container } = render(<LessonPlayer lesson={mockLesson} />);
      
      // Complete first task
      const e1Square = container.querySelector('[data-square="e1"]');
      if (e1Square) fireEvent.click(e1Square);
      const e8Square = container.querySelector('[data-square="e8"]');
      if (e8Square) fireEvent.click(e8Square);
      
      await waitFor(() => {
        expect(screen.getByText(/2.*2/)).toBeInTheDocument();
      });
    });
  });
});
