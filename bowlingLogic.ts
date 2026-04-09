export interface Frame {
  rolls: (number | null)[];
  score: number | null;
  isStrike: boolean;
  isSpare: boolean;
  isTurnComplete: boolean;
  cumulativeScore: number | null;
}

export interface PlayerState {
  id: string;
  name: string;
  rolls: number[];
  frames: Frame[];
  totalScore: number;
  maxPossibleScore: number;
  isGameOver: boolean;
}

export interface BowlingGameState {
  players: PlayerState[];
  activePlayerIndex: number;
  currentFrameIndex: number;
}
