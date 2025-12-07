/**
 * ActiveDutyCard Component Tests
 * 
 * Tests all 5 states with Russian School voice validation
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActiveDutyCard, ActiveDutyCardSkeleton } from '@/components/dashboard/ActiveDutyCard';
import type { ActiveDutyCardProps } from '@/components/dashboard/ActiveDutyCard';

describe('ActiveDutyCard', () => {
  const mockActions = {
    onPrimary: jest.fn(),
    onSecondary: jest.fn(),
    primaryLabel: 'Primary Action',
    secondaryLabel: 'Secondary Action',
  };

  const baseProfile = {
    name: 'Test User',
    tier: 'foundation' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('State: new_user', () => {
    it('renders First Step state with evaluation messaging', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-eyebrow')).toHaveTextContent('CURRENT MISSION');
      expect(screen.getByTestId('duty-headline')).toHaveTextContent(
        "Let's find your starting point."
      );
      expect(screen.getByTestId('duty-body')).toHaveTextContent(
        'To build your curriculum, we need to know what you see on the board'
      );
      expect(screen.getByTestId('active-duty-card')).toHaveAttribute(
        'data-status',
        'new_user'
      );
    });

    it('shows blue color scheme for new user', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      const card = screen.getByTestId('active-duty-card');
      expect(card).toHaveClass('border-blue-500/20');
    });

    it('calls onPrimary when CTA clicked', async () => {
      const user = userEvent.setup();
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      await user.click(screen.getByTestId('duty-primary-cta'));
      expect(mockActions.onPrimary).toHaveBeenCalledTimes(1);
    });
  });

  describe('State: placement_failed', () => {
    it('renders Foundation Required state with harsh reality check', () => {
      render(
        <ActiveDutyCard
          status="placement_failed"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-eyebrow')).toHaveTextContent(
        'FOUNDATION REQUIRED'
      );
      expect(screen.getByTestId('duty-headline')).toHaveTextContent(
        'The Academy is Locked.'
      );
      expect(screen.getByTestId('duty-body')).toHaveTextContent(
        'your foundation is cracked'
      );
    });

    it('shows red color scheme for failed placement', () => {
      render(
        <ActiveDutyCard
          status="placement_failed"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      const card = screen.getByTestId('active-duty-card');
      expect(card).toHaveClass('border-red-500/20');
    });

    it('renders secondary action for retake', async () => {
      const user = userEvent.setup();
      render(
        <ActiveDutyCard
          status="placement_failed"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      const secondaryBtn = screen.getByTestId('duty-secondary-action');
      expect(secondaryBtn).toBeInTheDocument();

      await user.click(secondaryBtn);
      expect(mockActions.onSecondary).toHaveBeenCalledTimes(1);
    });
  });

  describe('State: placement_passed', () => {
    it('renders Access Granted state with initiation messaging', () => {
      render(
        <ActiveDutyCard
          status="placement_passed"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-eyebrow')).toHaveTextContent('CURRENT MISSION');
      expect(screen.getByTestId('duty-headline')).toHaveTextContent(
        'Welcome to the Academy.'
      );
      expect(screen.getByTestId('duty-body')).toHaveTextContent(
        'You have proven your basics'
      );
    });

    it('shows blue color scheme for passed placement', () => {
      render(
        <ActiveDutyCard
          status="placement_passed"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      const card = screen.getByTestId('active-duty-card');
      expect(card).toHaveClass('border-blue-500/20');
    });
  });

  describe('State: student_active', () => {
    const activeMission = {
      level: 1,
      title: 'The Pin: Absolute Bind',
      description: 'Do not just find the move. Understand why the piece cannot move.',
      progressPercent: 65,
      lessonSlug: 'pin-absolute-bind',
    };

    it('renders Current Mission state with level and title', () => {
      render(
        <ActiveDutyCard
          status="student_active"
          userProfile={baseProfile}
          currentMission={activeMission}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-eyebrow')).toHaveTextContent(
        'CURRENT MISSION'
      );
      expect(screen.getByTestId('duty-headline')).toHaveTextContent(
        'The Pin: Absolute Bind'
      );
      expect(screen.getByTestId('duty-body')).toHaveTextContent(
        'Do not just find the move'
      );
    });

    it('displays progress bar with correct percentage', () => {
      render(
        <ActiveDutyCard
          status="student_active"
          userProfile={baseProfile}
          currentMission={activeMission}
          actions={mockActions}
        />
      );

      const progress = screen.getByTestId('duty-progress');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveTextContent('65%');
    });

    it('does not show progress bar for non-active states', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.queryByTestId('duty-progress')).not.toBeInTheDocument();
    });

    it('handles missing currentMission gracefully', () => {
      render(
        <ActiveDutyCard
          status="student_active"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-eyebrow')).toHaveTextContent(
        'CURRENT MISSION'
      );
      expect(screen.getByTestId('duty-headline')).toHaveTextContent(
        'Continue Your Training'
      );
    });
  });

  describe('State: level_complete', () => {
    const completedMission = {
      level: 1,
      title: 'Level 1 Complete',
      progressPercent: 100,
    };

    it('renders Level Complete state with ascent messaging', () => {
      render(
        <ActiveDutyCard
          status="level_complete"
          userProfile={baseProfile}
          currentMission={completedMission}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-eyebrow')).toHaveTextContent('CURRENT MISSION');
      expect(screen.getByTestId('duty-headline')).toHaveTextContent(
        'Level 1 Mastered. You are ready to climb.'
      );
      expect(screen.getByTestId('duty-body')).toHaveTextContent(
        'The next step of the ladder awaits'
      );
    });
  });

  describe('Tier Badges', () => {
    it('renders Sandbox badge for preschool tier', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={{ ...baseProfile, tier: 'preschool' }}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-tier-badge')).toHaveTextContent('Sandbox');
    });

    it('renders Foundation Tier badge', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={{ ...baseProfile, tier: 'foundation' }}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-tier-badge')).toHaveTextContent(
        'Foundation Tier'
      );
    });

    it('renders Candidate Master badge', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={{ ...baseProfile, tier: 'candidate' }}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-tier-badge')).toHaveTextContent(
        'Candidate Master'
      );
    });
  });

  describe('Secondary Actions', () => {
    it('renders secondary action when provided', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('duty-secondary-action')).toHaveTextContent(
        'Secondary Action'
      );
    });

    it('does not render secondary action when omitted', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={{
            onPrimary: mockActions.onPrimary,
            primaryLabel: 'Primary Only',
          }}
        />
      );

      expect(screen.queryByTestId('duty-secondary-action')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      expect(screen.getByTestId('active-duty-card')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: mockActions.primaryLabel }))
        .toBeInTheDocument();
    });

    it('primary CTA is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      const cta = screen.getByTestId('duty-primary-cta');
      cta.focus();
      expect(cta).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockActions.onPrimary).toHaveBeenCalledTimes(1);
    });

    it('has aria-hidden on decorative elements', () => {
      const { container } = render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
        />
      );

      const decorative = container.querySelector('[aria-hidden="true"]');
      expect(decorative).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('merges custom className with base styles', () => {
      render(
        <ActiveDutyCard
          status="new_user"
          userProfile={baseProfile}
          actions={mockActions}
          className="custom-class"
        />
      );

      const card = screen.getByTestId('active-duty-card');
      expect(card).toHaveClass('custom-class', 'rounded-2xl', 'border-2');
    });
  });

  describe('ActiveDutyCardSkeleton', () => {
    it('renders skeleton with matching layout structure', () => {
      const { container } = render(<ActiveDutyCardSkeleton />);

      // Verify skeleton matches actual component structure
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
      
      // Should have multiple skeleton elements (eyebrow, headline, body, badge, CTA)
      const skeletonElements = container.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(3);
    });

    it('has same responsive layout classes as real component', () => {
      const { container } = render(<ActiveDutyCardSkeleton />);

      // Check for mobile-first flex column + desktop flex row
      const layout = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(layout).toBeInTheDocument();
    });
  });
});
