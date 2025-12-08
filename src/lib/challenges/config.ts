/**
 * Coach's Challenge Configuration
 * 
 * Defines challenge configs for each level's graduation test.
 * These are scripted mini-games to apply what students learned.
 */

export type CoachChallengeId = "level0_challenge" | "level1_challenge";

export type WinConditionType = "captures" | "materialLead";

export type BotProfileId = "chip_l0" | "chip_l1";

export interface WinCondition {
  type: WinConditionType;
  targetCaptures?: number;    // for L0
  targetMaterialLead?: number; // for L1 (points)
  maxMoves: number;
}

export interface CoachChallengeConfig {
  id: CoachChallengeId;
  level: 0 | 1;
  title: string;
  subtitle: string;
  startingFEN: string;
  playerColor: "white" | "black";
  botProfileId: BotProfileId;
  winCondition: WinCondition;
  introHeading: string;
  introBody: string;
  introBullets: string[];
  successHeading: string;
  successBody: string;
  failureHeadings: {
    queenBlunder?: string;
    blunder?: string;
    timeout?: string;
  };
  failureBodies: {
    queenBlunder?: string;
    blunder?: string;
    timeout?: string;
  };
}

/**
 * Level 0 Challenge: Simple position with 3 pawns to capture
 * Focus: Don't hang the queen, capture pieces safely
 * 
 * Starting position: K+Q+3P vs K+Q+3P
 * Simple enough for beginners but requires careful queen management
 */
const LEVEL_0_CHALLENGE: CoachChallengeConfig = {
  id: "level0_challenge",
  level: 0,
  title: "Level 0 Challenge",
  subtitle: "Prove you're ready!",
  
  // Simple position: White Q on d1, K on e1, pawns on a2, b2, c2
  // Black Q on d8, K on e8, pawns on a7, b7, c7
  // This gives opportunities for safe captures but queen can be hung easily
  startingFEN: "3qk3/ppp5/8/8/8/8/PPP5/3QK3 w - - 0 1",
  
  playerColor: "white",
  botProfileId: "chip_l0",
  
  winCondition: {
    type: "captures",
    targetCaptures: 3,
    maxMoves: 15,
  },
  
  // Intro screen copy
  introHeading: "Show me what you've learned!",
  introBody: "I've set up a special board. Can you find the captures?",
  introBullets: [
    "Capture 3 pieces",
    "Don't lose your Queen",
    "Time limit: 15 moves",
  ],
  
  // Success screen copy
  successHeading: "You did it! 🎓",
  successBody: "Your Queen is safe, and you dominated the board. That's excellent piece awareness!",
  
  // Failure screen copy
  failureHeadings: {
    queenBlunder: "Oops!",
    blunder: "So close!",
    timeout: "So close!",
  },
  failureBodies: {
    queenBlunder: "You left your Queen undefended. She's too valuable to lose!",
    blunder: "You lost a valuable piece for nothing. Remember to keep your pieces safe!",
    timeout: "You played safe, but we need to be faster! Look for captures.",
  },
};

/**
 * Level 1 Challenge: Richer position with multiple piece types
 * Focus: Get a material lead without blundering
 * 
 * Position with K, Q, 2 minors, few pawns each side
 */
const LEVEL_1_CHALLENGE: CoachChallengeConfig = {
  id: "level1_challenge",
  level: 1,
  title: "Level 1 Challenge",
  subtitle: "Prove you're ready!",
  
  // White: K e1, Q d1, N b1, B c1, pawns a2, b2, c2
  // Black: K e8, Q d8, N b8, B c8, pawns a7, b7, c7
  // Chip will make small mistakes, player needs to capitalize
  startingFEN: "1nbqk3/ppp5/8/8/8/8/PPP5/1NBQK3 w - - 0 1",
  
  playerColor: "white",
  botProfileId: "chip_l1",
  
  winCondition: {
    type: "materialLead",
    targetMaterialLead: 3,
    maxMoves: 20,
  },
  
  // Intro screen copy
  introHeading: "Time for a real match!",
  introBody: "You vs. me. I'll play fair, but I won't go easy!",
  introBullets: [
    "Get a 3-point lead",
    "Don't lose pieces for free",
    "Time limit: 20 moves",
  ],
  
  // Success screen copy
  successHeading: "Fantastic! 🎓",
  successBody: "You outplayed the Coach! That's a solid tactical win.",
  
  // Failure screen copy
  failureHeadings: {
    blunder: "Let's try again",
    timeout: "Let's try again",
  },
  failureBodies: {
    blunder: "I got the better of you this time. Watch out for my tricky moves!",
    timeout: "Time ran out! Try to find winning moves faster.",
  },
};

/**
 * Get challenge config by ID
 */
export function getChallengeConfig(id: CoachChallengeId): CoachChallengeConfig {
  const configs = {
    level0_challenge: LEVEL_0_CHALLENGE,
    level1_challenge: LEVEL_1_CHALLENGE,
  };
  
  return configs[id];
}

/**
 * Get challenge config by level number
 */
export function getChallengeByLevel(level: 0 | 1): CoachChallengeConfig {
  if (level === 0) return LEVEL_0_CHALLENGE;
  if (level === 1) return LEVEL_1_CHALLENGE;
  throw new Error(`No challenge for level ${level}`);
}
