/**
 * Chessio Copy Patterns (v1.1 Final)
 * 
 * Brand Voice: Calm, Premium, No Grinding
 * - Use exclamation marks sparingly (only for genuine celebration)
 * - Avoid words like "grind", "streak", "daily"
 * - Focus on learning and progress, not pressure
 */

// ============================================
// DASHBOARD GREETINGS
// ============================================

export function getDashboardGreeting(userName: string | null, isReturningUser: boolean): {
  heading: string;
  subheading: string;
} {
  if (!isReturningUser) {
    return {
      heading: userName ? `Welcome, ${userName}` : "Welcome to Chessio",
      subheading: "Start your chess journey with bite-sized lessons",
    };
  }

  return {
    heading: userName ? `Welcome back, ${userName}` : "Welcome back",
    subheading: "Ready to continue your chess journey?",
  };
}

// ============================================
// TODAY'S GOAL PATTERNS
// ============================================

export const todaysGoalPatterns = {
  level0: {
    noProgress: {
      title: "Begin with the basics",
      description: "Learn how the pieces move on the board.",
    },
    inProgress: (completed: number, total: number) => ({
      title: "Master the fundamentals",
      description: `${completed} of ${total} foundation lessons complete.`,
    }),
  },
  level1: {
    title: "Build your skills",
    description: "Practice essential patterns and tactics.",
  },
  puzzles: {
    title: "Sharpen your tactics",
    description: "Apply what you've learned with puzzles.",
  },
  complete: {
    title: "You've completed this season",
    description: "Review your favorite lessons or take a break.",
  },
};

// ============================================
// LESSON FEEDBACK
// ============================================

export const lessonFeedback = {
  success: {
    simple: "Well done",
    withHint: "Nice work",
    perfect: "Perfect",
  },
  error: {
    gentle: "Not quite. Try again",
    withHint: "That's not it. Need a hint?",
  },
  hint: {
    prefix: "Hint:",
    encouragement: "You're close",
  },
};

// ============================================
// LEVEL UP MESSAGES
// ============================================

export function getLevelUpMessage(newLevel: number, levelLabel: string): {
  title: string;
  subtitle: string;
} {
  const messages: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: "Pawn rank achieved",
      subtitle: "You've mastered the basics",
    },
    2: {
      title: "Knight rank achieved",
      subtitle: "Your tactics are improving",
    },
    3: {
      title: "Bishop rank achieved",
      subtitle: "You've completed the learning arc",
    },
  };

  return messages[newLevel] || {
    title: `${levelLabel} rank achieved`,
    subtitle: "Keep learning",
  };
}

// ============================================
// COMPLETION MESSAGES
// ============================================

export const completionMessages = {
  firstLesson: {
    title: "First lesson complete",
    subtitle: "A strong start to your chess journey",
  },
  lessonComplete: {
    title: "Lesson complete",
    subtitle: "You're making progress",
  },
  puzzleComplete: {
    title: "Puzzle solved",
    subtitle: "Your tactical skills are improving",
  },
};

// ============================================
// BISHOP END-OF-ARC
// ============================================

export const bishopArcComplete = {
  title: "Bishop rank achieved",
  subtitle: "You've completed the current learning arc",
  body: "You've mastered the fundamentals and built a solid foundation. Feel free to review lessons or explore puzzles at your own pace.",
  cta: "Return to Dashboard",
};

// ============================================
// ALPHA MESSAGING
// ============================================

export const alphaBanner = {
  title: "Chessio is in early alpha",
  subtitle: "Expect rough edges. Your feedback helps us improve.",
  cta: "Share Feedback",
};

export const feedbackModal = {
  title: "Share your thoughts",
  subtitle: "Your feedback matters",
  placeholder: "What's working? What could be better? Any bugs or suggestions?",
  success: "Thank you for your feedback",
  cta: "Send Feedback",
};

// ============================================
// ERROR STATES
// ============================================

export const errorMessages = {
  generic: "Something went wrong. Please try again",
  network: "Connection issue. Check your internet",
  notFound: "We couldn't find that",
  unauthorized: "Please sign in to continue",
};

// ============================================
// EMPTY STATES
// ============================================

export const emptyStates = {
  noLessons: {
    title: "No lessons yet",
    subtitle: "Check back soon for new content",
  },
  noProgress: {
    title: "Start your first lesson",
    subtitle: "Begin learning how the pieces move",
  },
  completedAll: {
    title: "All caught up",
    subtitle: "Review past lessons or take a well-deserved break",
  },
};
