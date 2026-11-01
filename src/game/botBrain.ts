import { FORMATION_SLOTS, PlayerCard, Position, Team } from '../types/models';

export class BotBrain {
  public static calculateNeed(team: Team, pos: Position, formation: keyof typeof FORMATION_SLOTS): number {
    const targetSlots = FORMATION_SLOTS[formation];
    let currentInPos = 0;
    if (pos === 'GK') currentInPos = team.roster.filter(p => p.pos === 'GK').length;
    else if (pos === 'DEF') currentInPos = team.roster.filter(p => p.pos === 'DEF').length;
    else if (pos === 'MID') currentInPos = team.roster.filter(p => p.pos === 'MID').length;
    else if (pos === 'ATT') currentInPos = team.roster.filter(p => p.pos === 'ATT').length;

    const needed = (pos === 'GK' ? targetSlots.gk : pos === 'DEF' ? targetSlots.def : pos === 'MID' ? targetSlots.mid : targetSlots.att) - currentInPos;
    return Math.max(0, needed);
  }

  public static decideOpenBid(
    bot: Team,
    currentCard: PlayerCard,
    currentBid: number,
    highestBidderId: number | null,
    formation: keyof typeof FORMATION_SLOTS
  ): number | null {
    if (highestBidderId === bot.id) return null; // already highest

    const need = this.calculateNeed(bot, currentCard.pos, formation);
    const slotsRemaining = 5 - bot.roster.length; // baseline minimum reserve
    const reserveNeeded = Math.max(0, (slotsRemaining - 1) * 3);
    const maxAffordable = bot.budget - reserveNeeded;

    if (maxAffordable <= currentBid) return null;

    // Valuation formula: rating value + position need weight
    const baseValue = (currentCard.rating - 75) * 1.6;
    const needMultiplier = need > 0 ? (need === 1 ? 1.2 : 1.5) : 0.4;
    const botValuation = Math.floor(baseValue * needMultiplier) + 5;

    // Random slight variation per bot
    const personalityFactor = 0.85 + Math.random() * 0.35;
    const targetPrice = Math.min(maxAffordable, Math.floor(botValuation * personalityFactor));

    if (currentBid < targetPrice) {
      const step = currentBid >= 40 ? 5 : (currentBid >= 20 ? 3 : 2);
      const nextBid = currentBid + step;
      if (nextBid <= maxAffordable && nextBid <= targetPrice) {
        return nextBid;
      }
    }

    return null;
  }

  public static decideSecretBid(
    bot: Team,
    currentCard: PlayerCard,
    openingPrice: number,
    formation: keyof typeof FORMATION_SLOTS
  ): number {
    const need = this.calculateNeed(bot, currentCard.pos, formation);
    const slotsRemaining = 5 - bot.roster.length;
    const reserveNeeded = Math.max(0, (slotsRemaining - 1) * 3);
    const maxAffordable = Math.max(0, bot.budget - reserveNeeded);

    if (maxAffordable < openingPrice) return 0;

    const ratingBonus = (currentCard.rating - 75) * 1.5;
    const needBonus = need > 0 ? 12 : 2;
    const estimate = Math.floor(openingPrice + ratingBonus * 0.4 + needBonus + Math.random() * 8);

    return Math.min(maxAffordable, Math.max(openingPrice, estimate));
  }

  public static pickDraftCard(
    bot: Team,
    cards: PlayerCard[],
    formation: keyof typeof FORMATION_SLOTS
  ): PlayerCard {
    // Score each card based on need and rating
    const scored = cards.map(c => {
      const need = this.calculateNeed(bot, c.pos, formation);
      const score = c.rating + need * 15;
      return { card: c, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.card || cards[0];
  }
}
