import { MatchResult, MatchStatEvent, PlayerCard, Team } from '../types/models';

export class LocalMatchSimulator {
  public static simulate(home: Team, away: Team): MatchResult {
    const events: MatchStatEvent[] = [];

    // Calculate team ratings and PlayStyle perks
    const homeAttackers = home.roster.filter(p => p.pos === 'ATT');
    const homeMidfielders = home.roster.filter(p => p.pos === 'MID');
    const homeDefenders = home.roster.filter(p => p.pos === 'DEF');
    const homeGk = home.roster.find(p => p.pos === 'GK') || home.roster[0];

    const awayAttackers = away.roster.filter(p => p.pos === 'ATT');
    const awayMidfielders = away.roster.filter(p => p.pos === 'MID');
    const awayDefenders = away.roster.filter(p => p.pos === 'DEF');
    const awayGk = away.roster.find(p => p.pos === 'GK') || away.roster[0];

    const homeRating = home.roster.reduce((sum, p) => sum + p.rating, 0) / Math.max(1, home.roster.length);
    const awayRating = away.roster.reduce((sum, p) => sum + p.rating, 0) / Math.max(1, away.roster.length);

    let homeScore = 0;
    let awayScore = 0;

    // Simulation over 6 distinct key match phases (minutes 14, 28, 43, 59, 74, 88)
    const matchMinutes = [14, 28, 43, 59, 74, 88];

    matchMinutes.forEach(minute => {
      const isHomeAttacking = Math.random() * (homeRating + 5) > Math.random() * (awayRating + 5);
      const attackingTeam = isHomeAttacking ? home : away;
      const defendingTeam = isHomeAttacking ? away : home;
      const attackers = isHomeAttacking ? homeAttackers : awayAttackers;
      const defenders = isHomeAttacking ? awayDefenders : homeDefenders;
      const gk = isHomeAttacking ? awayGk : homeGk;

      const shooter = attackers.length > 0
        ? attackers[Math.floor(Math.random() * attackers.length)]
        : attackingTeam.roster[Math.floor(Math.random() * attackingTeam.roster.length)];

      const defender = defenders.length > 0
        ? defenders[Math.floor(Math.random() * defenders.length)]
        : defendingTeam.roster[Math.floor(Math.random() * defendingTeam.roster.length)];

      // Check Horus Eye mythic trigger
      if (shooter.playStyle === 'horusEye' && Math.random() < 0.65) {
        if (isHomeAttacking) homeScore++;
        else awayScore++;
        events.push({
          minute,
          type: 'horus',
          actorName: shooter.name,
          teamId: attackingTeam.id,
          textAr: `⚡ عين حورس الأسطورية تضيء الملعب! ${shooter.name} يطلق قذيفة ليزرية مستحيلة تسكن الشباك مباشرة!`,
        });
        return;
      }

      // Check Octopus mythic trigger
      if (gk?.playStyle === 'octopus' && Math.random() < 0.70) {
        events.push({
          minute,
          type: 'octopus',
          actorName: gk.name,
          teamId: defendingTeam.id,
          textAr: `🐙 الأخطبوط الأسود ${gk.name} يمد أذرعه الخفية ويطير لإنقاذ هدف محقق بكل براعة!`,
        });
        return;
      }

      // Check Golden Glove / Wall
      if (gk?.playStyle === 'goldenGlove' && Math.random() < 0.50) {
        events.push({
          minute,
          type: 'save',
          actorName: gk.name,
          teamId: defendingTeam.id,
          textAr: `🧤 تصدٍ خارق للعادة من الحارس ${gk.name} يحرم ${shooter.name} من هدف رائع!`,
        });
        return;
      }

      if (defender?.playStyle === 'wall' && Math.random() < 0.55) {
        events.push({
          minute,
          type: 'foul',
          actorName: defender.name,
          teamId: defendingTeam.id,
          textAr: `🛡️ الجدار الفولاذي ${defender.name} يتدخل في التوقيت المثالي ويقطع الكرة بانزلاق نظيف!`,
        });
        return;
      }

      // Base goal chance
      const goalProbability = (shooter.rating - (defender?.rating || 80) + 15) / 100;
      if (Math.random() < Math.max(0.2, Math.min(0.65, goalProbability))) {
        if (isHomeAttacking) homeScore++;
        else awayScore++;

        const commentaryOptions = [
          `⚽ جوووووول! ${shooter.name} يستلم بمهارة ويسدد كرة صاروخية لا تصد ولا ترد!`,
          `⚽ هدف رائع من ${shooter.name}! لمسة ساحرة في الزاوية التسعين تشعل المدرجات!`,
          `⚽ شباك تهتز بقوة! إنهاء مثالي من ${shooter.name} بعد هجمة تكتيكية منظمة!`,
        ];
        const chosen = commentaryOptions[Math.floor(Math.random() * commentaryOptions.length)];

        events.push({
          minute,
          type: 'goal',
          actorName: shooter.name,
          teamId: attackingTeam.id,
          textAr: chosen,
        });
      } else {
        // Near miss or tactical save
        events.push({
          minute,
          type: 'save',
          actorName: shooter.name,
          teamId: attackingTeam.id,
          textAr: `💨 فرصة خطيرة تضيع من ${shooter.name}! تسديدة قوية تمر بجوار القائم بسنتيمترات!`,
        });
      }
    });

    // Check penalty shootout if tied
    let homePenalties: number | undefined;
    let awayPenalties: number | undefined;

    if (homeScore === awayScore) {
      let hPens = 0;
      let aPens = 0;
      for (let i = 1; i <= 5; i++) {
        if (Math.random() < 0.75) hPens++;
        if (Math.random() < 0.72) aPens++;
      }
      if (hPens === aPens) {
        hPens += Math.random() > 0.5 ? 1 : 0;
      }
      homePenalties = hPens;
      awayPenalties = aPens;

      events.push({
        minute: 120,
        type: 'penaltyGoal',
        actorName: 'ركلات الترجيح',
        teamId: homePenalties > awayPenalties ? home.id : away.id,
        textAr: `🎯 حسم اللقاء بركلات الترجيح (${hPens} - ${aPens}) لصالح ${
          homePenalties > awayPenalties ? home.name : away.name
        }!`,
      });
    }

    // Determine MVP
    const allPlayers = [...home.roster, ...away.roster];
    let mvp: PlayerCard | undefined = allPlayers[0];
    const topScorerEvent = events.find(e => e.type === 'goal' || e.type === 'horus');
    if (topScorerEvent) {
      mvp = allPlayers.find(p => p.name === topScorerEvent.actorName) || allPlayers[0];
    }

    return {
      homeId: home.id,
      awayId: away.id,
      homeScore,
      awayScore,
      homePenalties,
      awayPenalties,
      events,
      mvp,
    };
  }
}
