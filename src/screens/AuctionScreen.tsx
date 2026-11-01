import React, { useState } from 'react';
import { PitchBg } from '../components/PitchBg';
import { PlayerCardWidget } from '../components/PlayerCardWidget';
import { MiniCardTile } from '../components/MiniCardTile';
import { StyleRevealModal } from '../components/StyleRevealModal';
import { AuctionGame, AuctionState } from '../game/engine';
import { PlayStyleId, PlayerCard } from '../types/models';
import { Clock, ShieldCheck, Users, Eye, ArrowRight, Gavel, CheckCircle2, X } from 'lucide-react';

interface AuctionScreenProps {
  game: AuctionGame;
  state: AuctionState;
  onFinishAuction: () => void;
  onExit: () => void;
}

export const AuctionScreen: React.FC<AuctionScreenProps> = ({
  game,
  state,
  onFinishAuction,
  onExit,
}) => {
  const [customBidAmount, setCustomBidAmount] = useState<number>(state.currentBid + 5);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [secretInputBid, setSecretInputBid] = useState<number>(state.currentBid);

  // Active Human team (for placing human bids)
  const humanTeam = state.teams.find(t => !t.isBot) || state.teams[0];
  const isHighestBidderHuman = state.highestBidderId === humanTeam.id;
  const isBlindMode = !!state.settings.gameMode && state.settings.gameMode === 'blind';

  const handlePlaceBid = (amt: number) => {
    if (amt > humanTeam.budget) return;
    game.placeBid(humanTeam.id, amt);
    setCustomBidAmount(amt + 5);
  };

  const handlePass = () => {
    game.passBid(humanTeam.id);
  };

  const handleSellNow = () => {
    game.sellImmediately();
  };

  const handleSecretBidSubmit = () => {
    if (state.activeSecretTurnTeamId !== null) {
      game.submitSecretBid(state.activeSecretTurnTeamId, secretInputBid);
    }
  };

  const handleDraftPick = (card: PlayerCard) => {
    if (state.draftTurnTeamId !== null) {
      game.pickDraftCard(state.draftTurnTeamId, card);
    }
  };

  // Find team holding highest bid
  const highestBidderTeam = state.teams.find(t => t.id === state.highestBidderId);

  // Find sold card & team for StyleRevealModal
  const soldTeam = state.soldToTeamId !== null ? state.teams.find(t => t.id === state.soldToTeamId) : null;

  return (
    <PitchBg>
      {/* Top Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="text-sm font-black text-white">
              البطاقة {state.currentCardIndex + 1} من {state.deck.length}
            </div>
            <div className="text-xs text-[#FFC94A] font-bold">
              {state.settings.gameMode === 'manager' ? 'درافت المدربين' : 'جلسة المزايدة الرسمية'}
            </div>
          </div>
        </div>

        {/* Timer Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0C1524] border border-white/15 shadow-inner">
          <Clock className={`w-4 h-4 ${state.secondsRemaining <= 5 ? 'text-[#FF5267] animate-spin' : 'text-[#35B8FF]'}`} />
          <span className={`text-base font-black ${state.secondsRemaining <= 5 ? 'text-[#FF5267]' : 'text-white'}`}>
            {state.secondsRemaining}ث
          </span>
        </div>

        {/* Squad Drawer Toggle */}
        <button
          onClick={() => setShowRosterModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer"
        >
          <Users className="w-4 h-4 text-[#FFC94A]" />
          <span>كشف التشكيلات ({humanTeam.roster.length}/{game.getTargetSlots()})</span>
        </button>
      </header>

      {/* Main Auction Stage */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-4 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left: Player Card Presentation */}
        {state.currentCard && state.phase !== 'pickTurn' && (
          <div className="flex flex-col items-center">
            <PlayerCardWidget
              card={state.currentCard}
              isBlind={isBlindMode && state.phase === 'bidding'}
              size="normal"
              showOpeningPrice={state.phase === 'intro' ? state.currentBid : undefined}
            />

            {/* Quick Status Pill */}
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#27D17F]" />
              <span>
                {highestBidderTeam
                  ? `أعلى مزايدة: ${highestBidderTeam.name}`
                  : 'لم يُقدّم أي عرض بعد'}
              </span>
            </div>
          </div>
        )}

        {/* Right: Controls & Actions */}
        <div className="flex-1 w-full max-w-md flex flex-col justify-between">
          {/* Phase 1: Intro */}
          {state.phase === 'intro' && (
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-xl animate-fade-in">
              <div className="text-xl font-black text-white">البطاقة القادمة على طاولة المزاد</div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                استعد للمزايدة على اللاعب {state.currentCard?.name}. السعر الافتتاحي هو {state.currentBid}M.
              </p>
              <button
                onClick={() => game.startAuction()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFC94A] to-[#FF9E2C] text-black font-black text-base shadow-lg shadow-[#FFC94A]/20 hover:opacity-95 cursor-pointer active:scale-95 transition-all"
              >
                فتح باب المزايدة الآن
              </button>
            </div>
          )}

          {/* Phase 2: Open Bidding */}
          {state.phase === 'bidding' && (
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl animate-fade-in">
              {/* Highest Bid Display */}
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">العرض الحالي</span>
                  <span className="text-3xl font-black text-[#FFC94A]">{state.currentBid}M</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">صاحب العرض</span>
                  <span className="text-sm font-black text-white">
                    {highestBidderTeam ? highestBidderTeam.name : 'سعر الافتتاح'}
                  </span>
                </div>
              </div>

              {/* User Budget Tracker */}
              <div className="flex justify-between items-center text-xs px-1 font-bold">
                <span className="text-slate-400">ميزانية {humanTeam.name}:</span>
                <span className="text-[#27D17F] font-black text-sm">{humanTeam.budget}M</span>
              </div>

              {/* Fast Bid Increments */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 25].map(inc => {
                  const targetAmt = state.currentBid + inc;
                  const canAfford = humanTeam.budget >= targetAmt;
                  return (
                    <button
                      key={inc}
                      disabled={!canAfford}
                      onClick={() => handlePlaceBid(targetAmt)}
                      className={`py-3 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                        canAfford
                          ? 'border-[#FFC94A]/40 bg-[#FFC94A]/10 text-[#FFC94A] hover:bg-[#FFC94A] hover:text-black active:scale-95'
                          : 'border-white/5 bg-white/5 text-slate-600 cursor-not-allowed opacity-40'
                      }`}
                    >
                      +{inc}M
                    </button>
                  );
                })}
              </div>

              {/* Custom Bid Input Row */}
              <div className="flex gap-2">
                <input
                  type="number"
                  min={state.currentBid + 1}
                  max={humanTeam.budget}
                  value={customBidAmount}
                  onChange={e => setCustomBidAmount(Number(e.target.value))}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-black text-center text-sm focus:border-[#FFC94A] outline-none"
                />
                <button
                  disabled={customBidAmount <= state.currentBid || customBidAmount > humanTeam.budget}
                  onClick={() => handlePlaceBid(customBidAmount)}
                  className="px-5 py-2.5 rounded-xl bg-[#FFC94A] disabled:opacity-40 text-black font-black text-xs hover:opacity-95 cursor-pointer"
                >
                  زايد
                </button>
              </div>

              {/* Action Buttons: Pass & Sell Now */}
              <div className="flex gap-3 pt-2 border-t border-white/5">
                <button
                  onClick={handlePass}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  انسحاب
                </button>

                <button
                  onClick={handleSellNow}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#27D17F] to-[#10B981] text-black font-black text-xs shadow-md shadow-[#27D17F]/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  <Gavel className="w-4 h-4 inline ml-1" />
                  بيع فوري
                </button>
              </div>
            </div>
          )}

          {/* Phase 3: Secret Bidding Mode */}
          {state.phase === 'secretBid' && (
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl animate-fade-in">
              <div className="text-center">
                <div className="text-lg font-black text-[#FFC94A] mb-1">تقديم العرض السري المغلق</div>
                <p className="text-xs text-slate-300 font-medium">
                  حدد عرضك في سرية تامة دون كشفه لبقية المدربين
                </p>
              </div>

              <div className="text-center py-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-xs text-slate-400 font-bold block mb-1">عرضك السري المقترح</span>
                <span className="text-4xl font-black text-[#FFC94A]">{secretInputBid}M</span>
              </div>

              <input
                type="range"
                min={state.currentBid}
                max={humanTeam.budget}
                step="1"
                value={secretInputBid}
                onChange={e => setSecretInputBid(Number(e.target.value))}
                className="w-full accent-[#FFC94A] cursor-pointer"
              />

              <button
                onClick={handleSecretBidSubmit}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFC94A] to-[#FF9E2C] text-black font-black text-base shadow-lg shadow-[#FFC94A]/25 cursor-pointer hover:opacity-95"
              >
                تثبيت العرض السري
              </button>
            </div>
          )}

          {/* Phase 4: Secret Handoff Screen */}
          {state.phase === 'handoff' && (
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#FFC94A]/10 border border-[#FFC94A]/30 flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-[#FFC94A]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">تسليم الجهاز للمدرب التالي</h3>
                <p className="text-xs text-slate-300 font-medium">
                  للحفاظ على سرية المزايدة، يرجى تسليم الشاشة إلى المدرب المسؤول قبل الضغط على متابعة.
                </p>
              </div>
              <button
                onClick={() => game.proceedFromHandoff()}
                className="w-full py-4 rounded-2xl bg-[#FFC94A] text-black font-black text-base cursor-pointer hover:opacity-95 shadow-lg shadow-[#FFC94A]/20"
              >
                أنا جاهز، اكشف لوحة العرض
              </button>
            </div>
          )}

          {/* Phase 5: Manager Draft (Pick Turn) */}
          {state.phase === 'pickTurn' && (
            <div className="w-full space-y-4 animate-fade-in">
              <div className="bg-[#0C1524] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#FFC94A] font-bold block">الجولة {state.draftRound} من {game.getTargetSlots()}</span>
                  <span className="text-sm font-black text-white">
                    دور الاختيار: {state.teams.find(t => t.id === state.draftTurnTeamId)?.name}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  اختر بطاقة واحدة لتضمها لفريقك
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {state.draftOptions.map(card => {
                  const isTurnHuman = state.draftTurnTeamId === humanTeam.id;
                  return (
                    <MiniCardTile
                      key={card.id}
                      card={card}
                      onClick={isTurnHuman ? () => handleDraftPick(card) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Phase 6: No Sale Feedback */}
          {state.phase === 'noSale' && (
            <div className="bg-[#0C1524] border border-[#FF5267]/30 rounded-3xl p-6 text-center space-y-3 shadow-xl animate-fade-in">
              <div className="text-lg font-black text-[#FF5267]">سقطت البطاقة!</div>
              <p className="text-xs text-slate-300 font-medium">
                لم يقدم أي مدرب عرضاً كافياً. جاري سحب البطاقة التالية...
              </p>
            </div>
          )}

          {/* Phase 7: Auction Finished */}
          {state.phase === 'finished' && (
            <div className="bg-[#0C1524] border border-[#27D17F]/30 rounded-3xl p-6 text-center space-y-4 shadow-xl animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-[#27D17F] mx-auto animate-bounce" />
              <div className="text-xl font-black text-white">اكتمل المزاد بنجاح!</div>
              <p className="text-xs text-slate-300 font-medium">
                جميع الفرق جاهزة الآن لخوض مباريات المحاكاة والتحكيم التكتيكي.
              </p>
              <button
                onClick={onFinishAuction}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#27D17F] to-[#10B981] text-black font-black text-base shadow-xl shadow-[#27D17F]/25 cursor-pointer hover:opacity-95"
              >
                الانتقال لغرفة التحكيم والمباريات
              </button>
            </div>
          )}

          {/* Live History Ticker */}
          <div className="mt-4 p-3 bg-black/40 border border-white/5 rounded-2xl max-h-24 overflow-y-auto">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">شريط الأحداث المباشر</span>
            <p className="text-xs text-slate-300 font-semibold truncate">
              {state.historyLog[0] || 'المزاد جارٍ...'}
            </p>
          </div>
        </div>
      </main>

      {/* Style Reveal Modal */}
      {state.phase === 'reveal' && state.currentCard && soldTeam && state.revealedPlayStyleId && (
        <StyleRevealModal
          card={state.currentCard}
          team={soldTeam}
          finalStyleId={state.revealedPlayStyleId as PlayStyleId}
          onComplete={() => game.onStyleRevealDone()}
        />
      )}

      {/* Team Roster Sheet Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0D1625] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FFC94A]" />
                <span>كشف تشكيلات وميزانيات الفرق</span>
              </h3>
              <button
                onClick={() => setShowRosterModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {state.teams.map(team => (
                <div key={team.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-base text-white">{team.name}</span>
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="text-slate-400">البطاقات: {team.roster.length}/{game.getTargetSlots()}</span>
                      <span className="text-[#FFC94A] font-black">{team.budget}M متبقي</span>
                    </div>
                  </div>

                  {team.roster.length === 0 ? (
                    <div className="text-xs text-slate-500 font-semibold text-center py-4">
                      لم يتم ضم أي لاعب حتى الآن
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {team.roster.map((player, idx) => (
                        <MiniCardTile key={`${player.id}_${idx}`} card={player} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PitchBg>
  );
};
