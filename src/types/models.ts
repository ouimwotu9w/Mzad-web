export type Era = 'legend' | 'current';

export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';

export type PlayStyleId =
  | 'horusEye'
  | 'octopus'
  | 'sniper'
  | 'finisher'
  | 'hawk'
  | 'rocket'
  | 'artist'
  | 'maestro'
  | 'engine'
  | 'deadBall'
  | 'wall'
  | 'gladiator'
  | 'shadow'
  | 'goldenGlove'
  | 'sweeper';

export interface PlayerCard {
  id: string;
  name: string;
  club: string;
  era: Era;
  pos: Position;
  rating: number;
  playStyle?: PlayStyleId;
}

export type Formation = 'Five' | 'F433' | 'F442' | 'F343';

export const FORMATION_SLOTS: Record<Formation, { label: string; gk: number; def: number; mid: number; att: number }> = {
  Five: { label: 'خماسي (1-1-2-1)', gk: 1, def: 1, mid: 2, att: 1 },
  F433: { label: '4-3-3 (كلاسيك)', gk: 1, def: 4, mid: 3, att: 3 },
  F442: { label: '4-4-2 (توازن)', gk: 1, def: 4, mid: 4, att: 2 },
  F343: { label: '3-4-3 (هجومي)', gk: 1, def: 3, mid: 4, att: 3 },
};

export type GameMode =
  | 'fiveOpen'
  | 'fiveSecret'
  | 'proOpen'
  | 'proSecret'
  | 'lightning'
  | 'manager'
  | 'dream'
  | 'blind'
  | 'horusNight';

export interface GameModeInfo {
  id: GameMode;
  name: string;
  desc: string;
  formation: Formation;
  defaultBudget: number;
  timerSec: number;
  isSecret: boolean;
  isBlind?: boolean;
  isDraft?: boolean;
  isHorusNight?: boolean;
}

export const GAME_MODES: Record<GameMode, GameModeInfo> = {
  fiveOpen: {
    id: 'fiveOpen',
    name: 'مزاد خماسي مفتوح',
    desc: 'مزايدة مباشرة وسريعة لبناء تشكيلة خماسية من 5 لاعبين',
    formation: 'Five',
    defaultBudget: 150,
    timerSec: 15,
    isSecret: false,
  },
  fiveSecret: {
    id: 'fiveSecret',
    name: 'مزاد خماسي سري',
    desc: 'مزايدة في الظل بعروض سرية دون معرفة عروض الخصوم',
    formation: 'Five',
    defaultBudget: 150,
    timerSec: 20,
    isSecret: true,
  },
  proOpen: {
    id: 'proOpen',
    name: 'المحترفين مفتوح (11 ضد 11)',
    desc: 'بناء فريق كامل من 11 لاعباً وفق التشكيل المختار',
    formation: 'F433',
    defaultBudget: 350,
    timerSec: 20,
    isSecret: false,
  },
  proSecret: {
    id: 'proSecret',
    name: 'المحترفين سري (11 ضد 11)',
    desc: 'حرب تكتيكية بعروض مغلقة لبناء تشكيلة 11 لاعباً',
    formation: 'F433',
    defaultBudget: 350,
    timerSec: 25,
    isSecret: true,
  },
  lightning: {
    id: 'lightning',
    name: 'المزاد الخاطف',
    desc: 'إيقاع جنوني مع 7 ثوانٍ فقط لكل لاعب وميزانية مضغوطة',
    formation: 'Five',
    defaultBudget: 120,
    timerSec: 7,
    isSecret: false,
  },
  manager: {
    id: 'manager',
    name: 'درافت المدربين (Manager Draft)',
    desc: 'اختيار استراتيجي بنظام Snake Draft بين 4 بطاقات كل جولة',
    formation: 'Five',
    defaultBudget: 150,
    timerSec: 25,
    isSecret: false,
    isDraft: true,
  },
  dream: {
    id: 'dream',
    name: 'فريق الأحلام (Dream Team)',
    desc: 'ميزانية مفتوحة (500M) وتنافس شرس على أساطير اللعبة',
    formation: 'F433',
    defaultBudget: 500,
    timerSec: 20,
    isSecret: false,
  },
  blind: {
    id: 'blind',
    name: 'المزاد الأعمى (Blind Auction)',
    desc: 'البطاقات مقلوبة! لا ترى سوى المركز وعليك المجازفة',
    formation: 'Five',
    defaultBudget: 150,
    timerSec: 15,
    isSecret: false,
    isBlind: true,
  },
  horusNight: {
    id: 'horusNight',
    name: 'ليلة عين حورس الأسطورية',
    desc: 'احتمالات مضاعفة 5x للحصول على أسلوب عين حورس والأخطبوط',
    formation: 'Five',
    defaultBudget: 180,
    timerSec: 15,
    isSecret: false,
    isHorusNight: true,
  },
};

export type PlayerPoolType = 'all' | 'legends' | 'current';

export interface GameSettings {
  teamCount: number;
  humanCount: number;
  gameMode: GameMode;
  poolType: PlayerPoolType;
  formation: Formation;
  budget: number;
  timerSec: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface Team {
  id: number;
  name: string;
  isBot: boolean;
  budget: number;
  roster: PlayerCard[];
  consolationDrawn?: boolean;
}

export interface MatchStatEvent {
  minute: number;
  type: 'goal' | 'save' | 'foul' | 'yellow' | 'red' | 'horus' | 'octopus' | 'penaltyGoal' | 'penaltyMiss';
  actorName: string;
  teamId: number;
  textAr: string;
}

export interface MatchResult {
  homeId: number;
  awayId: number;
  homeScore: number;
  awayScore: number;
  homePenalties?: number;
  awayPenalties?: number;
  events: MatchStatEvent[];
  mvp?: PlayerCard;
}
