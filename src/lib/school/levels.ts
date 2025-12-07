/**
 * School Level Metadata
 * Defines the 11-level curriculum structure
 */

export interface LevelMeta {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
}

export const SCHOOL_LEVELS: LevelMeta[] = [
  { id: 0, slug: "mechanics", title: "Level 0 – Mechanics", subtitle: "How the pieces move." },
  { id: 1, slug: "kings-fate", title: "Level 1 – The King's Fate", subtitle: "Check, mate, and safety." },
  { id: 2, slug: "tactical-eye", title: "Level 2 – The Tactical Eye", subtitle: "Forks, pins, skewers." },
  { id: 3, slug: "truth-endgames", title: "Level 3 – The Truth", subtitle: "Endgames first, always." },
  { id: 4, slug: "opening-development", title: "Level 4 – The Opening", subtitle: "Principles, not memorization." },
  { id: 5, slug: "strategic-mastermind", title: "Level 5 – The Strategic Mastermind", subtitle: "Good pieces, bad pieces." },
  { id: 6, slug: "competitive-mind", title: "Level 6 – The Competitive Mind", subtitle: "Prophylaxis, trading, psychology." },
  { id: 7, slug: "science-of-calculation", title: "Level 7 – The Science of Calculation", subtitle: "Candidates, forcing moves, zwischenzug." },
  { id: 8, slug: "positional-mastery", title: "Level 8 – The Positional Mastery", subtitle: "Color complexes, space, initiative." },
  { id: 9, slug: "endgame-virtuoso", title: "Level 9 – The Endgame Virtuoso", subtitle: "Lucena, Philidor, rook technique." },
  { id: 10, slug: "graduation", title: "Level 10 – The Graduation", subtitle: "A full game vs the Hustler." }
];
