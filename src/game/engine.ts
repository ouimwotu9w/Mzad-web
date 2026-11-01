import { CardsRepository } from '../data/cardsRepo';
import { FORMATION_SLOTS, Formation, GameMode, GameSettings, PlayerCard, Position, Team } from '../types/models';
import { BotBrain } from './botBrain';
import { rollPlayStyle } from './playstyles';

export type AuctionPhase =
  | 'intro'
  | 'bidding'
  | 'handoff'
  | 'secretBid'
  | 'reveal'
  | 'sold'
  | 'noSale'
  | 'pickTurn'
  | 'finished';

export interface AuctionState {
  settings: GameSettings;
  teams: Team[];
  deck: PlayerCard[];
  currentCardIndex: number;
  currentCard: PlayerCard | null;
  phase: AuctionPhase;
  currentBid: number;
  highestBidderId: number | null;
  passedTeamIds: number[];
  secondsRemaining: number;
  draftOptions: PlayerCard[];
  draftTurnTeamId: number | null;
  draftRound: number;
  draftPickIndex: number;
  secretBids: Record<number, number>;
  activeSecretTurnTeamId: number | null;
  revealedPlayStyleId: string | null;
  soldToTeamId: number | null;
  historyLog: string[];
}

const STORAGE_KEY = 'kora_save_v1';

export class AuctionGame {
  public state: AuctionState;
  private timerInterval: any = null;
  private botInterval: any = null;
  private onStateChange: (state: AuctionState) => void;

  constructor(settings: GameSettings, onStateChange: (state: AuctionState) => void) {
    this.onStateChange = onStateChange;
    this.state = this.initGame(settings);
    this.persist();
  }

  private initGame(settings: GameSettings): AuctionState {
    const teams: Team[] = [];
    const defaultNames = ['فريقك الملكي', 'صقور الأطلس', 'أسود الرافدين', 'فرسان النيل'];
    for (let i = 0; i < settings.teamCount; i++) {
      const isBot = i >= settings.humanCount;
      teams.push({
        id: i,
        name: isBot ? (defaultNames[i] ? `بوت ${defaultNames[i]}` : `بوت ${i + 1}`) : (defaultNames[i] || `المدرب ${i + 1}`),
        isBot,
        budget: settings.budget,
        roster: [],
      });
    }

    const deck = CardsRepository.getShuffledDeck(settings.poolType);
    const firstCard = deck[0] || null;
    const openingPrice = firstCard ? CardsRepository.getOpeningPrice(firstCard.rating) : 10;

    return {
      settings,
      teams,
      deck,
      currentCardIndex: 0,
      currentCard: firstCard,
      phase: settings.gameMode === 'manager' ? 'pickTurn' : 'intro',
      currentBid: openingPrice,
      highestBidderId: null,
      passedTeamIds: [],
      secondsRemaining: settings.timerSec,
      draftOptions: [],
      draftTurnTeamId: 0,
      draftRound: 1,
      draftPickIndex: 0,
      secretBids: {},
      activeSecretTurnTeamId: null,
      revealedPlayStyleId: null,
      soldToTeamId: null,
      historyLog: ['انطلق المزاد رسمياً! بالتوفيق لجميع المدربين.'],
    };
  }

  public static loadSavedGame(onStateChange: (state: AuctionState) => void): AuctionGame | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuctionState;
      if (!parsed.teams || !parsed.settings) return null;
      const game = new AuctionGame(parsed.settings, onStateChange);
      game.state = parsed;
      return game;
    } catch {
      return null;
    }
  }

  public persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore quota errors
    }
  }

  public static clearSavedGame(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  public startAuction(): void {
    if (this.state.settings.gameMode === 'manager') {
      this.initDraftRound();
      return;
    }

    if (this.state.settings.gameMode === 'fiveSecret' || this.state.settings.gameMode === 'proSecret') {
      this.startSecretBidRound();
    } else {
      this.startOpenBidRound();
    }
  }

  private startOpenBidRound(): void {
    if (!this.state.currentCard) {
      this.checkEndCondition();
      return;
    }

    const openPrice = CardsRepository.getOpeningPrice(this.state.currentCard.rating);
    this.state.phase = 'bidding';
    this.state.currentBid = openPrice;
    this.state.highestBidderId = null;
    this.state.passedTeamIds = [];
    this.state.secondsRemaining = this.state.settings.timerSec;
    this.emit();

    this.startTimer();
    this.startBotLoop();
  }

  private startSecretBidRound(): void {
    if (!this.state.currentCard) {
      this.checkEndCondition();
      return;
    }

    const openPrice = CardsRepository.getOpeningPrice(this.state.currentCard.rating);
    this.state.currentBid = openPrice;
    this.state.secretBids = {};

    // Auto-decide bot secret bids
    this.state.teams.forEach(t => {
      if (t.isBot && this.state.currentCard) {
        const bid = BotBrain.decideSecretBid(t, this.state.currentCard, openPrice, this.state.settings.formation);
        this.state.secretBids[t.id] = bid;
      }
    });

    // Check human secret bids
    const humanTeams = this.state.teams.filter(t => !t.isBot);
    if (humanTeams.length > 0) {
      this.state.phase = 'secretBid';
      this.state.activeSecretTurnTeamId = humanTeams[0].id;
      this.state.secondsRemaining = this.state.settings.timerSec;
      this.startTimer();
    } else {
      this.resolveSecretBids();
    }
    this.emit();
  }

  public submitSecretBid(teamId: number, amount: number): void {
    this.state.secretBids[teamId] = amount;
    const humanTeams = this.state.teams.filter(t => !t.isBot);
    const nextHuman = humanTeams.find(t => this.state.secretBids[t.id] === undefined);

    if (nextHuman) {
      this.state.phase = 'handoff';
      this.state.activeSecretTurnTeamId = nextHuman.id;
      this.state.secondsRemaining = this.state.settings.timerSec;
    } else {
      this.resolveSecretBids();
    }
    this.emit();
    this.persist();
  }

  public proceedFromHandoff(): void {
    this.state.phase = 'secretBid';
    this.emit();
  }

  private resolveSecretBids(): void {
    this.stopTimer();
    let highestAmount = 0;
    let highestTeamId: number | null = null;

    Object.entries(this.state.secretBids).forEach(([teamStr, amt]) => {
      const tid = Number(teamStr);
      if (amt > highestAmount) {
        highestAmount = amt;
        highestTeamId = tid;
      }
    });

    if (highestTeamId !== null && highestAmount >= this.state.currentBid) {
      this.state.currentBid = highestAmount;
      this.state.highestBidderId = highestTeamId;
      this.completeSale(highestTeamId, highestAmount);
    } else {
      this.state.phase = 'noSale';
      this.state.historyLog.unshift(`لم يقدم أحد عرضاً كافياً لضم ${this.state.currentCard?.name}!`);
      this.emit();
      setTimeout(() => this.nextCard(), 2500);
    }
  }

  public placeBid(teamId: number, amount: number): boolean {
    const team = this.state.teams.find(t => t.id === teamId);
    if (!team || team.budget < amount || amount <= this.state.currentBid) {
      return false;
    }

    this.state.currentBid = amount;
    this.state.highestBidderId = teamId;
    this.state.passedTeamIds = this.state.passedTeamIds.filter(id => id !== teamId);
    // Reset timer on fresh competitive bid
    this.state.secondsRemaining = Math.max(5, Math.min(this.state.settings.timerSec, 10));
    this.state.historyLog.unshift(`${team.name} رفع المزاد إلى ${amount}M!`);
    this.emit();
    this.persist();
    return true;
  }

  public passBid(teamId: number): void {
    if (!this.state.passedTeamIds.includes(teamId)) {
      this.state.passedTeamIds.push(teamId);
      const team = this.state.teams.find(t => t.id === teamId);
      if (team) {
        this.state.historyLog.unshift(`${team.name} انسحب من المزايدة.`);
      }
    }

    // If all other active teams passed and someone holds highest bid
    const eligibleTeams = this.state.teams.filter(t => t.budget > this.state.currentBid);
    if (this.state.highestBidderId !== null && this.state.passedTeamIds.length >= eligibleTeams.length - 1) {
      this.sellImmediately();
    }
    this.emit();
  }

  public sellImmediately(): void {
    if (this.state.highestBidderId !== null) {
      this.completeSale(this.state.highestBidderId, this.state.currentBid);
    } else {
      this.state.phase = 'noSale';
      this.state.historyLog.unshift(`لم يشترِ أحد ${this.state.currentCard?.name}. سقطت البطاقة!`);
      this.emit();
      setTimeout(() => this.nextCard(), 2500);
    }
  }

  private completeSale(teamId: number, amount: number): void {
    this.stopTimer();
    this.stopBotLoop();

    const team = this.state.teams.find(t => t.id === teamId);
    if (!team || !this.state.currentCard) return;

    // Roll PlayStyle
    const isHorusNight = this.state.settings.gameMode === 'horusNight';
    const rolledStyle = rollPlayStyle(this.state.currentCard.pos, isHorusNight);
    const cardWithStyle: PlayerCard = {
      ...this.state.currentCard,
      playStyle: rolledStyle,
    };

    team.budget -= amount;
    team.roster.push(cardWithStyle);

    this.state.soldToTeamId = teamId;
    this.state.revealedPlayStyleId = rolledStyle;
    this.state.phase = 'reveal';
    this.state.historyLog.unshift(`تم البيع لـ ${team.name} مقابل ${amount}M!`);
    this.emit();
    this.persist();
  }

  public onStyleRevealDone(): void {
    this.state.phase = 'sold';
    this.emit();
    setTimeout(() => {
      this.nextCard();
    }, 1800);
  }

  private nextCard(): void {
    this.state.currentCardIndex++;
    if (this.state.currentCardIndex >= this.state.deck.length) {
      this.finishGame();
      return;
    }

    this.state.currentCard = this.state.deck[this.state.currentCardIndex];
    this.state.revealedPlayStyleId = null;
    this.state.soldToTeamId = null;

    if (this.checkEndCondition()) {
      return;
    }

    if (this.state.settings.gameMode === 'fiveSecret' || this.state.settings.gameMode === 'proSecret') {
      this.startSecretBidRound();
    } else {
      this.startOpenBidRound();
    }
  }

  // --- Manager Draft Logic ---
  public initDraftRound(): void {
    const startIndex = (this.state.draftRound - 1) * 4;
    this.state.draftOptions = this.state.deck.slice(startIndex, startIndex + 4);
    this.state.phase = 'pickTurn';
    this.state.draftTurnTeamId = 0;
    this.state.draftPickIndex = 0;
    this.emit();
    this.persist();
  }

  public pickDraftCard(teamId: number, card: PlayerCard): void {
    const team = this.state.teams.find(t => t.id === teamId);
    if (!team) return;

    const rolled = rollPlayStyle(card.pos, this.state.settings.gameMode === 'horusNight');
    team.roster.push({ ...card, playStyle: rolled });

    this.state.draftOptions = this.state.draftOptions.filter(c => c.id !== card.id);
    this.state.historyLog.unshift(`${team.name} اختار ${card.name} بالدرافت!`);

    this.state.draftPickIndex++;
    if (this.state.draftPickIndex < this.state.teams.length) {
      const nextTeamId = this.state.draftPickIndex;
      this.state.draftTurnTeamId = nextTeamId;
      const nextTeam = this.state.teams.find(t => t.id === nextTeamId);
      if (nextTeam?.isBot && this.state.draftOptions.length > 0) {
        setTimeout(() => {
          const botCard = BotBrain.pickDraftCard(nextTeam, this.state.draftOptions, this.state.settings.formation);
          this.pickDraftCard(nextTeamId, botCard);
        }, 1200);
      }
    } else {
      // Round completed
      this.state.draftRound++;
      const maxSlots = this.getTargetSlots();
      if (this.state.draftRound > maxSlots) {
        this.finishGame();
      } else {
        setTimeout(() => this.initDraftRound(), 1500);
      }
    }
    this.emit();
    this.persist();
  }

  public getTargetSlots(): number {
    const slots = FORMATION_SLOTS[this.state.settings.formation];
    return slots.gk + slots.def + slots.mid + slots.att;
  }

  private checkEndCondition(): boolean {
    const targetSlots = this.getTargetSlots();
    const allFilled = this.state.teams.every(t => t.roster.length >= targetSlots);
    if (allFilled) {
      this.finishGame();
      return true;
    }
    return false;
  }

  public finishGame(): void {
    this.stopTimer();
    this.stopBotLoop();

    // Fill missing positions with consolation starter cards
    this.fillConsolationCards();

    this.state.phase = 'finished';
    this.state.historyLog.unshift('اكتمل المزاد! جاهزون لمباريات الحسم والتحكيم.');
    this.emit();
    this.persist();
  }

  private fillConsolationCards(): void {
    const target = FORMATION_SLOTS[this.state.settings.formation];
    const usedIds = new Set<string>();
    this.state.teams.forEach(t => t.roster.forEach(c => usedIds.add(c.id)));

    this.state.teams.forEach(team => {
      let neededGk = target.gk - team.roster.filter(p => p.pos === 'GK').length;
      let neededDef = target.def - team.roster.filter(p => p.pos === 'DEF').length;
      let neededMid = target.mid - team.roster.filter(p => p.pos === 'MID').length;
      let neededAtt = target.att - team.roster.filter(p => p.pos === 'ATT').length;

      const fill = (pos: Position, count: number) => {
        for (let i = 0; i < count; i++) {
          const consolation = CardsRepository.drawConsolationPlayer(pos, this.state.settings.poolType, usedIds);
          const style = rollPlayStyle(pos, false);
          usedIds.add(consolation.id);
          team.roster.push({ ...consolation, playStyle: style });
          team.consolationDrawn = true;
        }
      };

      if (neededGk > 0) fill('GK', neededGk);
      if (neededDef > 0) fill('DEF', neededDef);
      if (neededMid > 0) fill('MID', neededMid);
      if (neededAtt > 0) fill('ATT', neededAtt);
    });
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.state.secondsRemaining > 0) {
        this.state.secondsRemaining--;
        this.emit();
      } else {
        this.stopTimer();
        if (this.state.phase === 'bidding') {
          this.sellImmediately();
        } else if (this.state.phase === 'secretBid') {
          // Auto submit 0 if time runs out
          if (this.state.activeSecretTurnTeamId !== null) {
            this.submitSecretBid(this.state.activeSecretTurnTeamId, 0);
          }
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private startBotLoop(): void {
    this.stopBotLoop();
    this.botInterval = setInterval(() => {
      if (this.state.phase !== 'bidding' || !this.state.currentCard) return;

      const botTeams = this.state.teams.filter(t => t.isBot && !this.state.passedTeamIds.includes(t.id));
      if (botTeams.length === 0) return;

      // Pick one random active bot to evaluate
      const bot = botTeams[Math.floor(Math.random() * botTeams.length)];
      const nextBid = BotBrain.decideOpenBid(
        bot,
        this.state.currentCard,
        this.state.currentBid,
        this.state.highestBidderId,
        this.state.settings.formation
      );

      if (nextBid !== null) {
        this.placeBid(bot.id, nextBid);
      } else {
        // If high bid is above bot budget, pass
        if (bot.budget <= this.state.currentBid) {
          this.passBid(bot.id);
        }
      }
    }, 1600 + Math.random() * 800);
  }

  private stopBotLoop(): void {
    if (this.botInterval) {
      clearInterval(this.botInterval);
      this.botInterval = null;
    }
  }

  public dispose(): void {
    this.stopTimer();
    this.stopBotLoop();
  }

  private emit(): void {
    this.onStateChange({ ...this.state });
  }
}
