/**
 * Coach's Challenge Engine
 * 
 * Orchestrates game state, move validation, and win/fail conditions
 * for Coach's Challenge mini-games.
 */

import { Chess, Move, Square } from "chess.js";
import { CoachChallengeConfig, CoachChallengeId } from "./config";
import { getChipMove } from "./bot";
import {
  getMaterialScore,
  isQueenBlunder,
  isNetBlunder,
  isCapture,
  Color,
} from "./eval";

/**
 * Reason for challenge ending
 */
export type FailReason = "queenBlunder" | "blunder" | "timeout";

/**
 * Challenge state - tracks progress and game state
 */
export interface ChallengeState {
  challengeId: CoachChallengeId;
  movesPlayed: number; // Player moves only
  capturesByPlayer: number;
  materialScore: number; // player - bot
  hasBlundered: boolean;
  hasQueenBlundered: boolean; // L0 only
  isFinished: boolean;
  pass: boolean | null;
  failReason: FailReason | null;
}

/**
 * Result of attempting a player move
 */
export interface MoveResult {
  success: boolean;
  move?: Move;
  newFen?: string;
  botMove?: Move;
  botMoveFen?: string;
  state: ChallengeState;
  message?: string;
}

/**
 * Challenge Engine - manages game flow and state
 */
export class ChallengeEngine {
  private game: Chess;
  private config: CoachChallengeConfig;
  private state: ChallengeState;
  private previousFen: string;
  private previousMaterialScore: number;

  constructor(config: CoachChallengeConfig) {
    this.config = config;
    this.game = new Chess(config.startingFEN);
    this.previousFen = config.startingFEN;
    this.previousMaterialScore = 0;

    this.state = {
      challengeId: config.id,
      movesPlayed: 0,
      capturesByPlayer: 0,
      materialScore: 0,
      hasBlundered: false,
      hasQueenBlundered: false,
      isFinished: false,
      pass: null,
      failReason: null,
    };
  }

  /**
   * Get current FEN
   */
  public getFen(): string {
    return this.game.fen();
  }

  /**
   * Get current state
   */
  public getState(): ChallengeState {
    return { ...this.state };
  }

  /**
   * Get configuration
   */
  public getConfig(): CoachChallengeConfig {
    return this.config;
  }

  /**
   * Get current material score
   */
  public getMaterialScore(): number {
    return this.state.materialScore;
  }

  /**
   * Get moves remaining
   */
  public getMovesRemaining(): number {
    return this.config.winCondition.maxMoves - this.state.movesPlayed;
  }

  /**
   * Attempt a player move
   */
  public attemptMove(from: Square, to: Square): MoveResult {
    if (this.state.isFinished) {
      return {
        success: false,
        state: this.state,
        message: "Challenge already finished",
      };
    }

    // Validate it's player's turn
    const playerColor: Color = this.config.playerColor === "white" ? "w" : "b";
    if (this.game.turn() !== playerColor) {
      return {
        success: false,
        state: this.state,
        message: "Not your turn",
      };
    }

    // Store state before move for blunder detection
    const prevGame = new Chess(this.game.fen());
    const prevScore = this.state.materialScore;

    // Attempt the move
    let move: Move;
    try {
      move = this.game.move({ from, to });
    } catch {
      return {
        success: false,
        state: this.state,
        message: "Illegal move",
      };
    }

    // Update state after player move
    this.state.movesPlayed++;
    
    if (isCapture(move)) {
      this.state.capturesByPlayer++;
    }

    this.state.materialScore = getMaterialScore(this.game, playerColor);

    // Check for blunders
    const currentScore = this.state.materialScore;

    // Level 0: check for queen blunder
    if (this.config.level === 0 && !this.state.hasQueenBlundered) {
      const queenBlunder = isQueenBlunder(
        prevGame,
        this.game,
        playerColor,
        { from, to, captured: move.captured }
      );

      if (queenBlunder) {
        this.state.hasQueenBlundered = true;
        this.state.hasBlundered = true;
        this.finishChallenge(false, "queenBlunder");
        
        return {
          success: true,
          move,
          newFen: this.game.fen(),
          state: this.state,
        };
      }
    }

    // Generic blunder check (3+ point loss)
    if (!this.state.hasBlundered && isNetBlunder(prevScore, currentScore)) {
      this.state.hasBlundered = true;
      this.finishChallenge(false, "blunder");
      
      return {
        success: true,
        move,
        newFen: this.game.fen(),
        state: this.state,
      };
    }

    // Check for timeout
    if (this.state.movesPlayed >= this.config.winCondition.maxMoves) {
      this.finishChallenge(false, "timeout");
      
      return {
        success: true,
        move,
        newFen: this.game.fen(),
        state: this.state,
      };
    }

    // Check for win condition
    if (this.checkWinCondition()) {
      this.finishChallenge(true, null);
      
      return {
        success: true,
        move,
        newFen: this.game.fen(),
        state: this.state,
      };
    }

    const playerMoveFen = this.game.fen();

    // If not finished, let Chip move
    if (!this.state.isFinished) {
      const botMove = this.makeBotMove();
      
      return {
        success: true,
        move,
        newFen: playerMoveFen,
        botMove: botMove || undefined,
        botMoveFen: this.game.fen(),
        state: this.state,
      };
    }

    return {
      success: true,
      move,
      newFen: playerMoveFen,
      state: this.state,
    };
  }

  /**
   * Make a bot move
   */
  private makeBotMove(): Move | null {
    const botMove = getChipMove(this.game, this.config.botProfileId);
    
    if (botMove) {
      this.game.move(botMove);
      
      // Update material score after bot move
      const playerColor: Color = this.config.playerColor === "white" ? "w" : "b";
      this.state.materialScore = getMaterialScore(this.game, playerColor);
    }
    
    return botMove;
  }

  /**
   * Check if win condition is met
   */
  private checkWinCondition(): boolean {
    const { type, targetCaptures, targetMaterialLead, maxMoves } = this.config.winCondition;

    // Must be within move limit
    if (this.state.movesPlayed > maxMoves) {
      return false;
    }

    // Must not have blundered
    if (this.state.hasBlundered || this.state.hasQueenBlundered) {
      return false;
    }

    // Check specific condition
    if (type === "captures") {
      return this.state.capturesByPlayer >= (targetCaptures || 3);
    } else if (type === "materialLead") {
      return this.state.materialScore >= (targetMaterialLead || 3);
    }

    return false;
  }

  /**
   * Mark challenge as finished
   */
  private finishChallenge(pass: boolean, failReason: FailReason | null): void {
    this.state.isFinished = true;
    this.state.pass = pass;
    this.state.failReason = failReason;
  }

  /**
   * Get legal moves for a square
   */
  public getLegalMoves(square: Square): Move[] {
    return this.game.moves({ square, verbose: true });
  }

  /**
   * Check if it's player's turn
   */
  public isPlayerTurn(): boolean {
    const playerColor: Color = this.config.playerColor === "white" ? "w" : "b";
    return this.game.turn() === playerColor;
  }
}
