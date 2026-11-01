import { Position, Team } from '../types/models';

export interface VisualPlayerState {
  id: string;
  name: string;
  pos: Position;
  teamId: number;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  targetX: number;
  targetY: number;
  playStyle?: string;
  number: number;
}

export interface VisualBallState {
  x: number;
  y: number;
  z: number; // height
  targetX: number;
  targetY: number;
}

export class MatchVisualCoordinator {
  public static getInitialPositions(home: Team, away: Team): VisualPlayerState[] {
    const list: VisualPlayerState[] = [];

    // Home Team on Left Side (x from 5 to 45)
    let hGkCount = 0, hDefCount = 0, hMidCount = 0, hAttCount = 0;
    home.roster.forEach((p, idx) => {
      let x = 25, y = 50;
      if (p.pos === 'GK') {
        x = 8; y = 50; hGkCount++;
      } else if (p.pos === 'DEF') {
        x = 20; y = 25 + hDefCount * 25; hDefCount++;
      } else if (p.pos === 'MID') {
        x = 34; y = 30 + hMidCount * 20; hMidCount++;
      } else {
        x = 44; y = 35 + hAttCount * 30; hAttCount++;
      }

      list.push({
        id: `h_${p.id}_${idx}`,
        name: p.name,
        pos: p.pos,
        teamId: home.id,
        x,
        y,
        targetX: x,
        targetY: y,
        playStyle: p.playStyle,
        number: idx + 1,
      });
    });

    // Away Team on Right Side (x from 55 to 95)
    let aGkCount = 0, aDefCount = 0, aMidCount = 0, aAttCount = 0;
    away.roster.forEach((p, idx) => {
      let x = 75, y = 50;
      if (p.pos === 'GK') {
        x = 92; y = 50; aGkCount++;
      } else if (p.pos === 'DEF') {
        x = 80; y = 25 + aDefCount * 25; aDefCount++;
      } else if (p.pos === 'MID') {
        x = 66; y = 30 + aMidCount * 20; aMidCount++;
      } else {
        x = 56; y = 35 + aAttCount * 30; aAttCount++;
      }

      list.push({
        id: `a_${p.id}_${idx}`,
        name: p.name,
        pos: p.pos,
        teamId: away.id,
        x,
        y,
        targetX: x,
        targetY: y,
        playStyle: p.playStyle,
        number: idx + 1,
      });
    });

    return list;
  }
}
