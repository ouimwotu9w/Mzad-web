import rawPlayers from './players.json';
import { PlayerCard, PlayerPoolType, Position } from '../types/models';

interface RawPlayer {
  name: string;
  club: string;
  era: 'legend' | 'current';
  pos: string;
  rating: number;
}

function normalizePosition(raw: string): Position {
  const p = (raw || '').toUpperCase();
  if (p === 'GK') return 'GK';
  if (p === 'DEF' || p === 'CB' || p === 'LB' || p === 'RB' || p === 'RWB' || p === 'LWB') return 'DEF';
  if (p === 'MID' || p === 'CM' || p === 'CDM' || p === 'CAM' || p === 'LM' || p === 'RM') return 'MID';
  return 'ATT'; // ST, CF, RW, LW
}

export class CardsRepository {
  private static allPlayers: PlayerCard[] = (rawPlayers as RawPlayer[]).map((p, idx) => ({
    id: `card_${idx + 1}`,
    name: p.name,
    club: p.club,
    era: p.era,
    pos: normalizePosition(p.pos),
    rating: p.rating,
  }));

  public static getAll(): PlayerCard[] {
    return [...this.allPlayers];
  }

  public static getFiltered(pool: PlayerPoolType): PlayerCard[] {
    if (pool === 'legends') {
      return this.allPlayers.filter(p => p.era === 'legend');
    }
    if (pool === 'current') {
      return this.allPlayers.filter(p => p.era === 'current');
    }
    return [...this.allPlayers];
  }

  public static getShuffledDeck(pool: PlayerPoolType): PlayerCard[] {
    const list = this.getFiltered(pool);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  public static getOpeningPrice(rating: number): number {
    if (rating >= 94) return 25;
    if (rating >= 91) return 20;
    if (rating >= 88) return 15;
    if (rating >= 85) return 10;
    return 5;
  }

  public static drawConsolationPlayer(pos: Position, pool: PlayerPoolType, excludedIds: Set<string>): PlayerCard {
    const candidates = this.getFiltered(pool).filter(
      p => p.pos === pos && !excludedIds.has(p.id) && p.rating >= 75 && p.rating <= 84
    );
    if (candidates.length > 0) {
      const idx = Math.floor(Math.random() * candidates.length);
      return candidates[idx];
    }
    // Fallback if none found
    return {
      id: `consolation_${Date.now()}_${Math.random()}`,
      name: `لاعب بديل (${pos})`,
      club: 'نادي محلي',
      era: 'current',
      pos,
      rating: 78,
    };
  }
}
