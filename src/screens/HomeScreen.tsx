import React, { useState } from 'react';
import { PitchBg } from '../components/PitchBg';
import { PlayerCardWidget } from '../components/PlayerCardWidget';
import { Trophy, Play, RotateCcw, HelpCircle, Flame, Eye, Sparkles, X } from 'lucide-react';
import { PlayerCard } from '../types/models';

interface HomeScreenProps {
  onStartNew: () => void;
  onResume: () => void;
  hasSavedGame: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartNew, onResume, hasSavedGame }) => {
  const [showHowToModal, setShowHowToModal] = useState(false);

  // Showcase hero cards for landing presentation
  const heroCards: PlayerCard[] = [
    {
      id: 'hero_1',
      name: 'كريستيانو رونالدو',
      club: 'النصر',
      era: 'legend',
      pos: 'ATT',
      rating: 94,
      playStyle: 'horusEye',
    },
    {
      id: 'hero_2',
      name: 'كيليان مبابي',
      club: 'ريال مدريد',
      era: 'current',
      pos: 'ATT',
      rating: 91,
      playStyle: 'rocket',
    },
    {
      id: 'hero_3',
      name: 'ليونيل ميسي',
      club: 'إنتر ميامي',
      era: 'legend',
      pos: 'ATT',
      rating: 95,
      playStyle: 'artist',
    },
  ];

  return (
    <PitchBg>
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFC94A] to-[#FF9E2C] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#FFC94A]/20">
            ⚽
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">مزاد الكورة</h1>
            <p className="text-xs text-[#FFC94A] font-bold">Kora Mzad Tactical Auction</p>
          </div>
        </div>

        <button
          onClick={() => setShowHowToModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#FFC94A]" />
          <span>طريقة اللعب</span>
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 flex flex-col items-center justify-center text-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFC94A]/15 via-[#35B8FF]/15 to-[#FFC94A]/15 border border-[#FFC94A]/30 text-xs font-bold text-[#FFC94A] mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>النسخة التكتيكية الثالثة • 481 لاعباً • 15 أسلوب لعب</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-3xl mb-4">
          ابنِ تشكيلة أحلامك في
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC94A] via-[#FFD77D] to-[#FF9E2C] block">
            مزاد كروي استراتيجي
          </span>
        </h2>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-medium">
          زايد بذكاء في المزادات المفتوحة والسرية، اكشف أساليب اللعب الأسطورية مثل عين حورس، وقد فريقك في مباريات محاكاة تكتيكية مباشرة!
        </p>

        {/* Fanned 3 Hero Cards Showcase */}
        <div className="relative w-full max-w-lg h-[340px] flex items-center justify-center my-4">
          {/* Left card */}
          <div className="absolute transform -translate-x-28 rotate-[-12deg] scale-85 opacity-80 hover:opacity-100 hover:scale-95 transition-all z-10">
            <PlayerCardWidget card={heroCards[0]} size="compact" />
          </div>

          {/* Right card */}
          <div className="absolute transform translate-x-28 rotate-[12deg] scale-85 opacity-80 hover:opacity-100 hover:scale-95 transition-all z-10">
            <PlayerCardWidget card={heroCards[1]} size="compact" />
          </div>

          {/* Center Card (Messi) */}
          <div className="relative z-20 transform hover:scale-105 transition-all shadow-2xl">
            <PlayerCardWidget card={heroCards[2]} size="compact" highlight />
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-8">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
            <Eye className="w-3.5 h-3.5 text-[#FFC94A]" />
            <span>عين حورس الأسطورية</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
            <Trophy className="w-3.5 h-3.5 text-[#35B8FF]" />
            <span>9 أوضاع لعب مختلفة</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
            <Flame className="w-3.5 h-3.5 text-[#27D17F]" />
            <span>محاكاة ملعب 2D مع تعليق مصري</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            onClick={onStartNew}
            className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#FFC94A] to-[#FF9E2C] text-black font-black text-lg shadow-xl shadow-[#FFC94A]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>بدء مزاد جديد</span>
          </button>

          {hasSavedGame && (
            <button
              onClick={onResume}
              className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-lg active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-[#FFC94A]" />
              <span>استئناف اللعبة السابقة</span>
            </button>
          )}
        </div>
      </main>

      {/* How To Play Modal */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0D1625] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#FFC94A]" />
                <h3 className="text-xl font-black text-white">دليل مدرب مزاد الكورة</h3>
              </div>
              <button
                onClick={() => setShowHowToModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-black text-white text-base mb-1 text-[#FFC94A]">
                  1. المزاد وإدارة الميزانية
                </h4>
                <p>
                  يبدأ المزاد بسعر افتتاحي محدد بناءً على تقييم اللاعب. استخدم شرائح المزايدة السريعة (+1M، +5M، +10M، +25M) للتفوق على الخصوم مع الحفاظ على ميزانية كافية لإكمال المراكز الأساسية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-black text-white text-base mb-1 text-[#35B8FF]">
                  2. أساليب اللعب وعجلة الحظ (PlayStyles)
                </h4>
                <p>
                  بمجرد أن تفوز بأي بطاقة، تدور عجلة أسلوب اللعب لتمنح بطاقتك قدرة خاصة! أسلوب <strong>عين حورس الأسطورية</strong> يمنح دقة ليزرية للمهاجمين، بينما <strong>الأخطبوط الأسود</strong> يحول حارسك لجدار مستحيل الاختراق.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-black text-white text-base mb-1 text-[#27D17F]">
                  3. درافت المدربين والمزاد الأعمى
                </h4>
                <p>
                  اختر من بين 9 أوضاع مختلفة: في درافت المدربين تختار بطاقة واحدة من بين 4 بطاقات كل جولة بنظام Snake Draft، وفي المزاد الأعمى تكون البطاقات مقلوبة وتراهن على المركز فقط!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="font-black text-white text-base mb-1 text-[#9B72FF]">
                  4. بطاقات التعويض والمحاكاة التكتيكية
                </h4>
                <p>
                  إذا انتهى المزاد دون أن تكمل مراكز التشكيلة، يمنحك النظام بطاقات تعويضية مجانية لضمان خوض التحدي في مباريات المحاكاة المباشرة مع تعليق مصري حي وركلات ترجيح!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToModal(false)}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#FFC94A] text-black font-black text-base cursor-pointer hover:opacity-95"
            >
              فهمت، لنبدأ الآن!
            </button>
          </div>
        </div>
      )}
    </PitchBg>
  );
};
