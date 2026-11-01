import { PlayStyleId, Position } from '../types/models';

export interface PlayStyleDefinition {
  id: PlayStyleId;
  nameAr: string;
  nameEn: string;
  tier: 'mythic' | 'legendary' | 'epic' | 'rare';
  badgeColor: string;
  textColor: string;
  descriptionAr: string;
  applicablePositions: Position[];
  weight: number;
}

export const PLAYSTYLES: Record<PlayStyleId, PlayStyleDefinition> = {
  horusEye: {
    id: 'horusEye',
    nameAr: 'عين حورس الأسطورية',
    nameEn: 'Horus Eye',
    tier: 'mythic',
    badgeColor: '#FFC94A',
    textColor: '#050B12',
    descriptionAr: 'رؤية خارقة للملعب تكشف كل ثغرة؛ تسديدات حاسمة لا تُصد من مسافات بعيدة مع تأثير شعاع ذهبي',
    applicablePositions: ['MID', 'ATT'],
    weight: 2,
  },
  octopus: {
    id: 'octopus',
    nameAr: 'الأخطبوط الأسود',
    nameEn: 'Black Octopus',
    tier: 'mythic',
    badgeColor: '#9B72FF',
    textColor: '#FFFFFF',
    descriptionAr: 'أذرع خفية تمتد في أرجاء المرمى؛ تصد أصعب الكرات المستحيلة مع إيقاف أي هجمة انفرادية',
    applicablePositions: ['GK', 'DEF'],
    weight: 2,
  },
  sniper: {
    id: 'sniper',
    nameAr: 'القناص',
    nameEn: 'Sniper',
    tier: 'legendary',
    badgeColor: '#FF5267',
    textColor: '#FFFFFF',
    descriptionAr: 'دقة تصويب متناهية في زوايا المرمى الميتة من داخل وخارج منطقة الجزاء',
    applicablePositions: ['ATT', 'MID'],
    weight: 7,
  },
  finisher: {
    id: 'finisher',
    nameAr: 'الهدّاف الفتاك',
    nameEn: 'Finisher',
    tier: 'legendary',
    badgeColor: '#FF6B4A',
    textColor: '#FFFFFF',
    descriptionAr: 'حاسة تهديفية قاتلة تحول أنصاف الفرص إلى أهداف محققة بالرأس والقدمين',
    applicablePositions: ['ATT'],
    weight: 8,
  },
  hawk: {
    id: 'hawk',
    nameAr: 'الصقر الهوائي',
    nameEn: 'Aerial Hawk',
    tier: 'epic',
    badgeColor: '#35B8FF',
    textColor: '#050B12',
    descriptionAr: 'ارتقاء هائل وقوة رأسية ساحقة في الكرات العرضية والركنيات هجوماً ودفاعاً',
    applicablePositions: ['ATT', 'DEF'],
    weight: 9,
  },
  rocket: {
    id: 'rocket',
    nameAr: 'الصاروخ النفاث',
    nameEn: 'Rocket Pace',
    tier: 'epic',
    badgeColor: '#27D17F',
    textColor: '#050B12',
    descriptionAr: 'سرعة انطلاقة جنونية تكسر مصيدة التسلل وتتفوق على أي ملاحق في المرتدات',
    applicablePositions: ['ATT', 'MID'],
    weight: 9,
  },
  artist: {
    id: 'artist',
    nameAr: 'الرسام المراوغ',
    nameEn: 'Dribble Artist',
    tier: 'legendary',
    badgeColor: '#F59E0B',
    textColor: '#050B12',
    descriptionAr: 'مهارة فائقة في المرور الفردي وتفكيك التكتلات الدفاعية في أضيق المساحات',
    applicablePositions: ['MID', 'ATT'],
    weight: 8,
  },
  maestro: {
    id: 'maestro',
    nameAr: 'المايسترو الممرر',
    nameEn: 'Maestro',
    tier: 'legendary',
    badgeColor: '#06B6D4',
    textColor: '#FFFFFF',
    descriptionAr: 'تمريرات حريرية بينية تقطع الخطوط وتضع المهاجمين وجهاً لوجه مع الشباك',
    applicablePositions: ['MID'],
    weight: 8,
  },
  engine: {
    id: 'engine',
    nameAr: 'المحرك الذي لا يهدأ',
    nameEn: 'Relentless Engine',
    tier: 'rare',
    badgeColor: '#10B981',
    textColor: '#FFFFFF',
    descriptionAr: 'طاقة بدنية غير محدودة تغطي كل شبر في الملعب من الصندوق إلى الصندوق (Box to Box)',
    applicablePositions: ['MID', 'DEF'],
    weight: 10,
  },
  deadBall: {
    id: 'deadBall',
    nameAr: 'ساحر الكرات الثابتة',
    nameEn: 'Dead Ball Master',
    tier: 'epic',
    badgeColor: '#EAB308',
    textColor: '#050B12',
    descriptionAr: 'خطورة استثنائية في تنفيذ الركلات الحرة المباشرة وركلات الجزاء المقوسة',
    applicablePositions: ['MID', 'ATT'],
    weight: 7,
  },
  wall: {
    id: 'wall',
    nameAr: 'الجدار الفولاذي',
    nameEn: 'The Wall',
    tier: 'legendary',
    badgeColor: '#64748B',
    textColor: '#FFFFFF',
    descriptionAr: 'حضور دفاعي منيع يغلق كل المنافذ ويفتك الكرة بنظافة دون ارتكاب أخطاء',
    applicablePositions: ['DEF'],
    weight: 8,
  },
  gladiator: {
    id: 'gladiator',
    nameAr: 'المحارب القتالي',
    nameEn: 'Gladiator',
    tier: 'epic',
    badgeColor: '#EF4444',
    textColor: '#FFFFFF',
    descriptionAr: 'التحامات بدنية شرسة واستخلاص رجولي في معارك وسط الملعب والمنطقة',
    applicablePositions: ['DEF', 'MID'],
    weight: 9,
  },
  shadow: {
    id: 'shadow',
    nameAr: 'ظل المهاجمين',
    nameEn: 'Shadow Interceptor',
    tier: 'rare',
    badgeColor: '#8B5CF6',
    textColor: '#FFFFFF',
    descriptionAr: 'توقع ذكي لمسار التمريرات واعتراض مبكر يبطل هجمات الخصم قبل أن تبدأ',
    applicablePositions: ['DEF', 'MID'],
    weight: 9,
  },
  goldenGlove: {
    id: 'goldenGlove',
    nameAr: 'القفاز الذهبي',
    nameEn: 'Golden Glove',
    tier: 'legendary',
    badgeColor: '#FFC94A',
    textColor: '#050B12',
    descriptionAr: 'ردود فعل إعجازية وتصديات بهلوانية تطير لحرمان الخصم من كرات التسعين',
    applicablePositions: ['GK'],
    weight: 8,
  },
  sweeper: {
    id: 'sweeper',
    nameAr: 'الحارس القشاش',
    nameEn: 'Sweeper Keeper',
    tier: 'rare',
    badgeColor: '#38BDF8',
    textColor: '#050B12',
    descriptionAr: 'خروج شجاع خارج منطقة الجزاء لتغطية ظهر المدافعين وبناء اللعب من الخلف',
    applicablePositions: ['GK'],
    weight: 10,
  },
};

export function rollPlayStyle(pos: Position, isHorusNight = false): PlayStyleId {
  const eligible = Object.values(PLAYSTYLES).filter(p => p.applicablePositions.includes(pos));
  
  // Calculate total weight with optional Horus Night boost
  let totalWeight = 0;
  const weights = eligible.map(p => {
    let w = p.weight;
    if (isHorusNight && (p.id === 'horusEye' || p.id === 'octopus')) {
      w *= 5; // 5x mythic boost in Horus Night mode
    }
    totalWeight += w;
    return { id: p.id, cumulative: totalWeight };
  });

  const rand = Math.random() * totalWeight;
  const match = weights.find(w => rand <= w.cumulative);
  return match ? match.id : eligible[0].id;
}

export function buildReelSequence(pos: Position, finalId: PlayStyleId, count = 24): PlayStyleId[] {
  const allPosStyles = Object.values(PLAYSTYLES)
    .filter(p => p.applicablePositions.includes(pos))
    .map(p => p.id);

  const reel: PlayStyleId[] = [];
  for (let i = 0; i < count - 1; i++) {
    const randomPick = allPosStyles[Math.floor(Math.random() * allPosStyles.length)];
    reel.push(randomPick);
  }
  // The final landed style
  reel.push(finalId);
  return reel;
}
