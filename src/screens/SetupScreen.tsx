import React, { useState } from 'react';
import { PitchBg } from '../components/PitchBg';
import { FORMATION_SLOTS, Formation, GAME_MODES, GameMode, GameSettings, PlayerPoolType } from '../types/models';
import { Users, Bot, Layers, ArrowLeft, ArrowRight, Play, Check } from 'lucide-react';

interface SetupScreenProps {
  onConfirmSettings: (settings: GameSettings) => void;
  onBack: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onConfirmSettings, onBack }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [teamCount, setTeamCount] = useState<number>(3);
  const [humanCount, setHumanCount] = useState<number>(1);
  const [gameMode, setGameMode] = useState<GameMode>('fiveOpen');
  const [poolType, setPoolType] = useState<PlayerPoolType>('all');
  const [formation, setFormation] = useState<Formation>('Five');
  const [budget, setBudget] = useState<number>(150);
  const [timerSec, setTimerSec] = useState<number>(15);

  const handleModeSelect = (modeKey: GameMode) => {
    setGameMode(modeKey);
    const modeInfo = GAME_MODES[modeKey];
    setFormation(modeInfo.formation);
    setBudget(modeInfo.defaultBudget);
    setTimerSec(modeInfo.timerSec);
  };

  const handleStart = () => {
    const finalSettings: GameSettings = {
      teamCount,
      humanCount,
      gameMode,
      poolType,
      formation,
      budget,
      timerSec,
      soundEnabled: true,
      hapticsEnabled: true,
    };
    onConfirmSettings(finalSettings);
  };

  return (
    <PitchBg>
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={currentStep === 1 ? onBack : () => setCurrentStep(s => (s === 3 ? 2 : 1))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{currentStep === 1 ? 'الرئيسية' : 'السابق'}</span>
        </button>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                currentStep === step
                  ? 'bg-[#FFC94A] text-black shadow-lg shadow-[#FFC94A]/30 scale-110'
                  : currentStep > step
                  ? 'bg-[#27D17F] text-black'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
          ))}
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-bold">الخطوة {currentStep} من 3</span>
        </div>
      </header>

      {/* Main Wizard Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-6 flex flex-col justify-between">
        {/* Step 1: Teams & Players */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2">إعداد الفرق والمدربين</h2>
              <p className="text-sm text-slate-300 font-medium">حدد عدد الفرق المشاركة والمدربين البشريين أو البوتات</p>
            </div>

            {/* Total Teams */}
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 shadow-xl">
              <label className="block text-sm font-black text-[#FFC94A] mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>إجمالي عدد الفرق في المزاد</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      setTeamCount(num);
                      if (humanCount > num) setHumanCount(num);
                    }}
                    className={`py-4 rounded-2xl font-black text-base transition-all border cursor-pointer ${
                      teamCount === num
                        ? 'border-[#FFC94A] bg-[#FFC94A]/15 text-white shadow-[0_0_20px_rgba(255,201,74,0.25)]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {num} فرق
                  </button>
                ))}
              </div>
            </div>

            {/* Human vs Bot */}
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 shadow-xl">
              <label className="block text-sm font-black text-[#35B8FF] mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>عدد المدربين البشريين (والباقي أذكياء اصطناعيون)</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: teamCount }, (_, i) => i + 1).map(h => (
                  <button
                    key={h}
                    onClick={() => setHumanCount(h)}
                    className={`py-3.5 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
                      humanCount === h
                        ? 'border-[#35B8FF] bg-[#35B8FF]/15 text-white shadow-[0_0_20px_rgba(53,184,255,0.25)]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {h === 1 ? 'مدرب واحد + بوتات' : `${h} مدربين`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Game Mode & Card Pool */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2">نمط المزاد وحزمة البطاقات</h2>
              <p className="text-sm text-slate-300 font-medium">اختر تجربة اللعب المناسبة لك وتشكيلة اللاعبين</p>
            </div>

            {/* Pool Selector */}
            <div className="flex items-center justify-center gap-3">
              {(['all', 'legends', 'current'] as PlayerPoolType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setPoolType(type)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs border transition-all cursor-pointer ${
                    poolType === type
                      ? 'border-[#FFC94A] bg-[#FFC94A] text-black shadow-lg shadow-[#FFC94A]/25'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {type === 'all' ? 'جميع اللاعبين (481 بطاقة)' : type === 'legends' ? 'الأساطير فقط' : 'اللاعبون الحاليون فقط'}
                </button>
              ))}
            </div>

            {/* 9 Game Modes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
              {Object.values(GAME_MODES).map(mode => {
                const isSelected = gameMode === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => handleModeSelect(mode.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FFC94A] bg-[#FFC94A]/10 shadow-[0_0_20px_rgba(255,201,74,0.25)]'
                        : 'border-white/10 bg-[#0C1524]/80 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-black text-sm text-white">{mode.name}</span>
                        {mode.isHorusNight && (
                          <span className="text-[10px] font-black text-[#FFC94A] bg-[#FFC94A]/20 px-1.5 py-0.5 rounded">
                            5x حورس
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {mode.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span>{mode.defaultBudget}M ميزانية</span>
                      <span>{mode.timerSec}ث مؤقت</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Formation, Budget, Timer */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2">التشكيل والميزانية التكتيكية</h2>
              <p className="text-sm text-slate-300 font-medium">اللمسات الأخيرة قبل انطلاق صافرة البداية</p>
            </div>

            {/* Formations */}
            <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 shadow-xl">
              <label className="block text-sm font-black text-[#FFC94A] mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>الخطة التكتيكية المطلوبة لكل فريق</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.entries(FORMATION_SLOTS) as [Formation, any][]).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setFormation(key)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formation === key
                        ? 'border-[#FFC94A] bg-[#FFC94A]/15 text-white shadow-[0_0_15px_rgba(255,201,74,0.2)]'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-black text-sm mb-1">{info.label}</div>
                    <div className="text-[10px] text-slate-400 font-bold">
                      {info.gk}ح • {info.def}د • {info.mid}و • {info.att}هـ
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Timer Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-white">الميزانية الابتدائية</span>
                  <span className="text-xl font-black text-[#FFC94A]">{budget}M</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full accent-[#FFC94A] cursor-pointer"
                />
              </div>

              <div className="bg-[#0C1524] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-white">وقت المزايدة لكل لاعب</span>
                  <span className="text-xl font-black text-[#35B8FF]">{timerSec} ثانية</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={timerSec}
                  onChange={e => setTimerSec(Number(e.target.value))}
                  className="w-full accent-[#35B8FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(s => (s === 1 ? 2 : 3))}
              className="mr-auto flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#FFC94A] to-[#FF9E2C] text-black font-black text-base shadow-lg shadow-[#FFC94A]/20 hover:opacity-95 cursor-pointer"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="mr-auto flex items-center gap-2 py-4 px-10 rounded-2xl bg-gradient-to-r from-[#27D17F] to-[#10B981] text-black font-black text-lg shadow-xl shadow-[#27D17F]/25 hover:opacity-95 cursor-pointer active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>انطلاق المزاد الآن!</span>
            </button>
          )}
        </div>
      </main>
    </PitchBg>
  );
};
