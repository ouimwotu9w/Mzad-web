import React, { useState } from 'react';
import { PitchBg } from '../components/PitchBg';
import { VisualMatchView } from '../components/VisualMatchView';
import { PlayerCardWidget } from '../components/PlayerCardWidget';
import { LocalMatchSimulator } from '../game/localSim';
import { MatchResult, Team } from '../types/models';
import { Trophy, Play, RotateCcw, Award, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface RefereeingScreenProps {
  teams: Team[];
  onExit: () => void;
  onNewGame: () => void;
}

export const RefereeingScreen: React.FC<RefereeingScreenProps> = ({ teams, onExit, onNewGame }) => {
  const [selectedHomeId, setSelectedHomeId] = useState<number>(teams[0]?.id || 0);
  const [selectedAwayId, setSelectedAwayId] = useState<number>(teams[1]?.id || 1);
  const [activeTab, setActiveTab] = useState<'visual' | 'classic' | 'standings'>('visual');
  const [currentResult, setCurrentResult] = useState<MatchResult | null>(null);

  const homeTeam = teams.find(t => t.id === selectedHomeId) || teams[0];
  const awayTeam = teams.find(t => t.id === selectedAwayId) || teams[1];

  const handleRunMatch = () => {
    if (!homeTeam || !awayTeam || homeTeam.id === awayTeam.id) return;
    const res = LocalMatchSimulator.simulate(homeTeam, awayTeam);
    setCurrentResult(res);
  };

  return (
    <PitchBg>
      {/* Top Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-white">غرفة التحكيم والمحاكاة التكتيكية</h2>
            <p className="text-xs text-[#FFC94A] font-bold">حسم النتائج بين الفرق ومواجهات الملعب</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#FFC94A]" />
            <span>مزاد جديد</span>
          </button>
        </div>
      </header>

      {/* Fixture Selector Bar */}
      <div className="w-full max-w-4xl mx-auto px-6 py-4">
        <div className="bg-[#0C1524] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Home Team Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">المستضيف:</span>
            <select
              value={selectedHomeId}
              onChange={e => setSelectedHomeId(Number(e.target.value))}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-black text-[#35B8FF] outline-none cursor-pointer"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id} disabled={t.id === selectedAwayId}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-black text-slate-500">ضد</div>

          {/* Away Team Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">الضيف:</span>
            <select
              value={selectedAwayId}
              onChange={e => setSelectedAwayId(Number(e.target.value))}
              className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-black text-[#FFC94A] outline-none cursor-pointer"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id} disabled={t.id === selectedHomeId}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trigger Match Button */}
          <button
            onClick={handleRunMatch}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#27D17F] to-[#10B981] text-black font-black text-xs shadow-md shadow-[#27D17F]/20 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>إطلاق صافرة المباراة</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-[#FFC94A] text-black shadow-md shadow-[#FFC94A]/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            المحاكاة البصرية 2D
          </button>
          <button
            onClick={() => setActiveTab('classic')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'classic'
                ? 'bg-[#FFC94A] text-black shadow-md shadow-[#FFC94A]/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            التقرير التكتيكي المباشر
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-4 flex flex-col items-center">
        {!currentResult ? (
          <div className="my-auto text-center space-y-4 max-w-md p-8 bg-[#0C1524] border border-white/10 rounded-3xl shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#FFC94A]/10 border border-[#FFC94A]/30 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-[#FFC94A]" />
            </div>
            <h3 className="text-xl font-black text-white">اختر المواجهة وابدأ المحاكاة</h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              ستخوض الفرق مواجهة حاسمة تتأثر بتقييمات اللاعبين وأساليب اللعب والقدرات الأسطورية مثل عين حورس والأخطبوط!
            </p>
            <button
              onClick={handleRunMatch}
              className="w-full py-3.5 rounded-2xl bg-[#FFC94A] text-black font-black text-sm cursor-pointer hover:opacity-95 shadow-lg shadow-[#FFC94A]/20"
            >
              بدء المباراة الآن
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* Visual 2D Pitch View */}
            {activeTab === 'visual' && (
              <VisualMatchView
                home={homeTeam}
                away={awayTeam}
                result={currentResult}
              />
            )}

            {/* Classic Timeline & Match Stats */}
            {activeTab === 'classic' && (
              <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
                {/* Result Banner */}
                <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 text-center shadow-xl">
                  <div className="flex items-center justify-around mb-4">
                    <div className="text-center">
                      <span className="font-black text-lg text-white block">{homeTeam.name}</span>
                      <span className="text-4xl font-black text-[#35B8FF]">{currentResult.homeScore}</span>
                    </div>

                    <div className="text-xs font-black text-slate-400">
                      {currentResult.homePenalties !== undefined ? (
                        <div className="text-[#FFC94A]">
                          (ركلات ترجيح: {currentResult.homePenalties} - {currentResult.awayPenalties})
                        </div>
                      ) : (
                        'نهاية اللقاء'
                      )}
                    </div>

                    <div className="text-center">
                      <span className="font-black text-lg text-white block">{awayTeam.name}</span>
                      <span className="text-4xl font-black text-[#FFC94A]">{currentResult.awayScore}</span>
                    </div>
                  </div>

                  {/* MVP Badge */}
                  {currentResult.mvp && (
                    <div className="mt-4 pt-4 border-t border-white/10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC94A]/10 border border-[#FFC94A]/30 text-xs font-black text-[#FFC94A]">
                      <Award className="w-4 h-4" />
                      <span>رجل المباراة (MVP): {currentResult.mvp.name} ({currentResult.mvp.rating})</span>
                    </div>
                  )}
                </div>

                {/* Commentary Timeline */}
                <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
                  <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF5267]" />
                    <span>شريط أحداث اللقاء التكتيكية</span>
                  </h4>

                  <div className="space-y-2">
                    {currentResult.events.map((ev, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 ${
                          ev.type === 'goal' || ev.type === 'horus'
                            ? 'border-[#27D17F]/40 bg-[#27D17F]/10 text-white'
                            : ev.type === 'octopus'
                            ? 'border-[#9B72FF]/40 bg-[#9B72FF]/10 text-white'
                            : 'border-white/5 bg-white/5 text-slate-300'
                        }`}
                      >
                        <span className="font-black text-xs text-[#FFC94A] w-8">
                          {ev.minute}'
                        </span>
                        <span className="flex-1 leading-relaxed">{ev.textAr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </PitchBg>
  );
};
