import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { buildReelSequence, PLAYSTYLES } from '../game/playstyles';
import { PlayStyleId, PlayerCard, Team } from '../types/models';
import { StyleChip } from './StyleChip';
import { Sparkles, Trophy } from 'lucide-react';

interface StyleRevealModalProps {
  card: PlayerCard;
  team: Team;
  finalStyleId: PlayStyleId;
  onComplete: () => void;
}

export const StyleRevealModal: React.FC<StyleRevealModalProps> = ({
  card,
  team,
  finalStyleId,
  onComplete,
}) => {
  const [reel, setReel] = useState<PlayStyleId[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    const sequence = buildReelSequence(card.pos, finalStyleId, 22);
    setReel(sequence);

    let idx = 0;
    let delay = 60; // Initial rapid spin speed

    const step = () => {
      idx++;
      if (idx < sequence.length) {
        setCurrentIndex(idx);
        // Gradually decelerate towards the end
        if (idx > sequence.length - 8) {
          delay += 60;
        } else if (idx > sequence.length - 4) {
          delay += 120;
        }
        setTimeout(step, delay);
      } else {
        setIsSpinning(false);
        // Trigger celebratory confetti
        const isMythic = finalStyleId === 'horusEye' || finalStyleId === 'octopus';
        confetti({
          particleCount: isMythic ? 150 : 80,
          spread: isMythic ? 100 : 70,
          origin: { y: 0.6 },
          colors: isMythic ? ['#FFC94A', '#9B72FF', '#FFFFFF', '#35B8FF'] : ['#27D17F', '#35B8FF', '#FFC94A'],
        });
      }
    };

    const timeout = setTimeout(step, delay);
    return () => clearTimeout(timeout);
  }, [card.pos, finalStyleId]);

  const currentStyleId = reel[currentIndex] || finalStyleId;
  const currentStyle = PLAYSTYLES[currentStyleId];
  const isFinalMythic = (finalStyleId === 'horusEye' || finalStyleId === 'octopus') && !isSpinning;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl p-7 border flex flex-col items-center text-center shadow-2xl transition-all duration-500 ${
          isFinalMythic
            ? 'border-[#FFC94A] bg-gradient-to-b from-[#2B1F08] via-[#141824] to-[#0A0E17] shadow-[0_0_50px_rgba(255,201,74,0.4)]'
            : 'border-white/15 bg-gradient-to-b from-[#111A29] to-[#080E18]'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FFC94A] mb-2">
          <Trophy className="w-4 h-4" />
          <span>انتقال رسمي إلى {team.name}</span>
        </div>

        <h3 className="text-2xl font-black text-white mb-1">
          الكشف عن أسلوب اللعب
        </h3>
        <p className="text-xs text-slate-400 mb-6 font-medium">
          عجلة القدرات التكتيكية تدور لتحديد أسلوب {card.name}...
        </p>

        {/* The Spinning Slot Reel Window */}
        <div className="relative w-full py-6 px-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center min-h-[170px] overflow-hidden">
          {/* Scanline & subtle background beam */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

          <div
            className={`transition-transform duration-100 flex flex-col items-center ${
              isSpinning ? 'scale-95 blur-[0.4px]' : 'scale-110'
            }`}
          >
            <div className="text-3xl mb-3">
              {currentStyleId === 'horusEye' ? '👁️' : currentStyleId === 'octopus' ? '🐙' : '⚡'}
            </div>
            <div className="text-xl font-black" style={{ color: currentStyle.badgeColor }}>
              {currentStyle.nameAr}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">
              {currentStyle.nameEn}
            </div>
          </div>

          {!isSpinning && (
            <div className="mt-4 animate-bounce">
              <Sparkles className="w-5 h-5 text-[#FFC94A]" />
            </div>
          )}
        </div>

        {/* Description after landing */}
        {!isSpinning && (
          <div className="mt-5 text-center animate-fade-in">
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs font-semibold">
              {PLAYSTYLES[finalStyleId].descriptionAr}
            </p>
            <div className="mt-3">
              <StyleChip styleId={finalStyleId} size="lg" />
            </div>
          </div>
        )}

        <button
          onClick={onComplete}
          disabled={isSpinning}
          className={`mt-6 w-full py-3.5 px-6 rounded-2xl font-black text-base transition-all ${
            isSpinning
              ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-400'
              : 'bg-gradient-to-r from-[#FFC94A] to-[#FF9E2C] text-black hover:opacity-95 shadow-lg shadow-[#FFC94A]/25 cursor-pointer active:scale-95'
          }`}
        >
          {isSpinning ? 'جاري السحب...' : 'تأكيد الإضافة للتشكيلة'}
        </button>
      </div>
    </div>
  );
};
