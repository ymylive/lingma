export type VibeTrack = 'frontend' | 'backend' | 'debugging' | 'refactoring' | 'review';
export type VibeDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type VibeDimensionKey =
  | 'goal_clarity'
  | 'boundary_constraints'
  | 'verification_design'
  | 'output_format';

export interface VibeChallenge {
  id: string;
  userId: string;
  track: VibeTrack;
  difficulty: VibeDifficulty;
  title: string;
  scenario: string;
  requirements: string[];
  constraints: string[];
  successCriteria: string[];
  expectedFocus: VibeDimensionKey[];
  createdAt: string;
}

export interface VibeEvaluation {
  id: string;
  challengeId: string;
  promptText: string;
  total_score: number;
  dimension_scores: Record<VibeDimensionKey, number>;
  strengths: string[];
  weaknesses: string[];
  rewrite_example: string;
  next_difficulty_recommendation: VibeDifficulty;
  createdAt: string;
}

export interface VibeHistoryItem {
  id: string;
  track: VibeTrack;
  difficulty: VibeDifficulty;
  createdAt: string;
  challenge: VibeChallenge;
  evaluation: Omit<VibeEvaluation, 'id' | 'challengeId' | 'promptText' | 'createdAt'>;
  promptText: string;
}

export interface VibeProfile {
  recommendedTrack: VibeTrack;
  recommendedDifficulty: VibeDifficulty;
  weakestDimension: VibeDimensionKey | null;
  recentAverageScore: number | null;
  trackScores: Record<VibeTrack, number | null>;
}
