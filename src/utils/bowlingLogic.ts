import { Frame, PlayerState } from '../types';

export function createNewPlayer(name: string = 'Player'): PlayerState {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rolls: [],
    frames: Array.from({ length: 10 }, () => ({
      rolls: [],
      score: null,
      isStrike: false,
      isSpare: false,
      isTurnComplete: false,
      cumulativeScore: null,
    })),
    totalScore: 0,
    maxPossibleScore: 300,
    isGameOver: false,
  };
}

export function calculateScores(rolls: number[]): { totalScore: number; frames: Frame[]; isGameOver: boolean } {
  const frames: Frame[] = Array.from({ length: 10 }, () => ({
    rolls: [],
    score: null,
    isStrike: false,
    isSpare: false,
    isTurnComplete: false,
    cumulativeScore: null,
  }));

  let rollIdx = 0;
  let totalScore = 0;
  let isGameOver = false;

  for (let frameIdx = 0; frameIdx < 10; frameIdx++) {
    const frame = frames[frameIdx];

    // Strike (Frames 1-9)
    if (rolls[rollIdx] === 10 && frameIdx < 9) {
      frame.isStrike = true;
      frame.rolls = [10];
      frame.isTurnComplete = true;
      if (rolls[rollIdx + 1] !== undefined && rolls[rollIdx + 2] !== undefined) {
        frame.score = 10 + rolls[rollIdx + 1] + rolls[rollIdx + 2];
        totalScore += frame.score;
        frame.cumulativeScore = totalScore;
      }
      rollIdx++;
    } 
    // Spare or Open (Frames 1-9)
    else if (frameIdx < 9) {
      const firstRoll = rolls[rollIdx];
      const secondRoll = rolls[rollIdx + 1];

      if (firstRoll !== undefined) {
        frame.rolls.push(firstRoll);
        if (secondRoll !== undefined) {
          frame.rolls.push(secondRoll);
          frame.isTurnComplete = true;
          if (firstRoll + secondRoll === 10) {
            frame.isSpare = true;
            if (rolls[rollIdx + 2] !== undefined) {
              frame.score = 10 + rolls[rollIdx + 2];
              totalScore += frame.score;
              frame.cumulativeScore = totalScore;
            }
          } else {
            frame.score = firstRoll + secondRoll;
            totalScore += frame.score;
            frame.cumulativeScore = totalScore;
          }
          rollIdx += 2;
        } else {
          rollIdx++;
        }
      } else {
        // No more rolls
      }
    }
    // 10th Frame
    else {
      const r1 = rolls[rollIdx];
      const r2 = rolls[rollIdx + 1];
      const r3 = rolls[rollIdx + 2];

      if (r1 !== undefined) {
        frame.rolls.push(r1);
        if (r2 !== undefined) {
          frame.rolls.push(r2);
          
          const isStrikeOrSpare = r1 === 10 || r1 + r2 === 10;
          
          if (isStrikeOrSpare) {
            if (r3 !== undefined) {
              frame.rolls.push(r3);
              frame.isTurnComplete = true;
              frame.score = r1 + r2 + r3;
              totalScore += frame.score;
              frame.cumulativeScore = totalScore;
              isGameOver = true;
            }
          } else {
            frame.isTurnComplete = true;
            frame.score = r1 + r2;
            totalScore += frame.score;
            frame.cumulativeScore = totalScore;
            isGameOver = true;
          }
        }
      }
    }
  }

  return { totalScore, frames, isGameOver };
}

export function calculateMaxPossibleScore(currentRolls: number[]): number {
  let hypotheticalRolls = [...currentRolls];
  
  while (true) {
    const { isGameOver, frames } = calculateScores(hypotheticalRolls);
    if (isGameOver) break;
    if (hypotheticalRolls.length > 21) break; 

    // Find the current frame we are in
    let currentFrameIdx = 0;
    for (let i = 0; i < 10; i++) {
        if (!frames[i].isTurnComplete) {
            currentFrameIdx = i;
            break;
        }
    }

    const frame = frames[currentFrameIdx];
    const frameRolls = frame.rolls;

    if (currentFrameIdx < 9) {
      if (frameRolls.length === 0) {
        hypotheticalRolls.push(10);
      } else {
        const remaining = 10 - (frameRolls[0] || 0);
        hypotheticalRolls.push(remaining);
      }
    } else {
      // 10th frame
      if (frameRolls.length === 0) {
        hypotheticalRolls.push(10);
      } else if (frameRolls.length === 1) {
        if (frameRolls[0] === 10) {
          hypotheticalRolls.push(10);
        } else {
          const remaining = 10 - (frameRolls[0] || 0);
          hypotheticalRolls.push(remaining);
        }
      } else if (frameRolls.length === 2) {
        if (frameRolls[1] === 10 || (frameRolls[0] + frameRolls[1] === 10)) {
          hypotheticalRolls.push(10);
        } else {
          const remaining = 10 - (frameRolls[1] || 0);
          hypotheticalRolls.push(remaining);
        }
      }
    }
  }
  
  return calculateScores(hypotheticalRolls).totalScore;
}

export function formatFrameRolls(frame: Frame, frameIdx: number): string[] {
  const rolls = frame.rolls;
  if (rolls.length === 0) return [];

  if (frameIdx < 9) {
    if (rolls[0] === 10) return ['X'];
    if (rolls.length === 2 && rolls[0]! + rolls[1]! === 10) {
      return [rolls[0] === 0 ? '-' : rolls[0]!.toString(), '/'];
    }
    return rolls.map(r => r === 0 ? '-' : r!.toString());
  } else {
    // 10th frame
    const formatted: string[] = [];
    for (let i = 0; i < rolls.length; i++) {
      const r = rolls[i];
      if (r === 10) {
        formatted.push('X');
      } else if (i === 1 && rolls[0]! + rolls[1]! === 10 && rolls[0] !== 10) {
        formatted.push('/');
      } else if (i === 2) {
        if (rolls[1] !== 10 && rolls[1]! + rolls[2]! === 10) {
          formatted.push('/');
        } else {
          formatted.push(r === 0 ? '-' : r!.toString());
        }
      } else {
        formatted.push(r === 0 ? '-' : r!.toString());
      }
    }
    return formatted;
  }
}
