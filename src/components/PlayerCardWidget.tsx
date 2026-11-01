import React from 'react';
import { PlayerCard } from '../types/models';
import { StyleChip } from './StyleChip';
import { ShieldAlert, Award, Star } from 'lucide-react';

interface PlayerCardWidgetProps {
  card: PlayerCard;
  isBlind?: boolean;
  size?: 'normal' | 'large' | 'compact';
  showOpeningPrice?: number;
  highlight?: boolean;
}

export const PlayerCardWidget: React.FC<PlayerCardWidgetProps> = ({
  card,
  isBlind = false,
  size = 'normal',
  showOpeningPrice,
  highlight = false,
}) => {
  const isLegend = card.era === 'legend';
  const isHighRated = card.rating >= 90;

  if (isBlind) {
    return (
      <div
        className={`relative rounded-3xl p-5 border-2 border-dashed border-[#FFC94A]/40 bg-gradient-to-b from-[#111C2E] to-[#0A121F] shadow-2xl flex flex-col items-center justify-center text-center select-none ${
          size === 'large' ? 'w-80 h-[440px]' : 'w-64 h-[350px]'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-[#FFC94A]/10 border border-[#FFC94A]/30 flex items-center justify-center mb-4">
          <ShieldAlert className="w-10 h-10 text-[#FFC94A] animate-pulse" />
        </div>
        <div className="text-xl font-black text-[#FFC94A] mb-1">بطاقة غامضة</div>
        <div className="text-sm text-slate-300 font-bold mb-4">المزاد الأعمى</div>
        <div className="px-4 py-1.5 rounded-full bg-white/10 text-white font-extrabold text-sm border border-white/20">
          المركز المطلوب: {card.pos}
        </div>
        {showOpeningPrice !== undefined && (
          <div className="mt-6 text-xs text-amber-300 font-bold">
            سعر الافتتاح: {showOpeningPrice}M
          </div>
        )}
      </div>
    );
  }

  const dimensions = {
    compact: 'w-56 h-[320px] p-4',
    normal: 'w-72 h-[410px] p-6',
    large: 'w-84 h-[470px] p-7',
  }[size];

  return (
    <div
      className={`relative rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-300 select-none shadow-2xl ${dimensions} ${
        isLegend
          ? 'border-2 border-[#FFC94A] bg-gradient-to-b from-[#2A2006] via-[#121927] to-[#080E17]'
          : 'border-2 border-[#35B8FF]/40 bg-gradient-to-b from-[#0D243A] via-[#0D1826] to-[#060B12]'
      } ${highlight ? 'scale-105 shadow-[0_0_35px_rgba(255,201,74,0.4)]' : ''}`}
    >
      {/* Background FIFA Card Polygon Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,0 L 100,25 L 100,100 L 0,80 Z" fill="rgba(255, 255, 255, 0.05)" />
          <path d="M 10,0 L 90,0 L 50,45 Z" fill="rgba(255, 201, 74, 0.08)" />
        </svg>
      </div>

      {/* Gold animated shine layer */}
      {isHighRated && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-[#FFC94A]/10 pointer-events-none" />
      )}

      {/* Header: Rating + Pos & Era Badge */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col items-center">
          <span
            className={`font-black tracking-tight leading-none ${
              size === 'large' ? 'text-5xl' : 'text-4xl'
            } ${isLegend ? 'text-[#FFC94A]' : 'text-white'}`}
          >
            {card.rating}
          </span>
          <span className="text-sm font-black tracking-wider text-slate-300 uppercase mt-0.5">
            {card.pos}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold border ${
              isLegend
                ? 'bg-[#FFC94A]/15 text-[#FFC94A] border-[#FFC94A]/40'
                : 'bg-[#35B8FF]/15 text-[#35B8FF] border-[#35B8FF]/40'
            }`}
          >
            {isLegend ? 'أسطورة' : 'لاعب حالي'}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
            {card.club}
          </div>
        </div>
      </div>

      {/* Center Silhouette & Star Emblem */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div
          className={`rounded-full flex items-center justify-center border transition-transform ${
            size === 'large' ? 'w-24 h-24' : 'w-20 h-20'
          } ${
            isLegend
              ? 'bg-[#FFC94A]/10 border-[#FFC94A]/30 shadow-[0_0_20px_rgba(255,201,74,0.2)]'
              : 'bg-[#35B8FF]/10 border-[#35B8FF]/30'
          }`}
        >
          {isLegend ? (
            <Award className="w-10 h-10 text-[#FFC94A]" />
          ) : (
            <Star className="w-9 h-9 text-[#35B8FF]" />
          )}
        </div>
      </div>

      {/* Footer: Name + PlayStyle & Opening Price */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={`font-black text-white tracking-wide truncate max-w-full ${
            size === 'large' ? 'text-2xl' : 'text-xl'
          }`}
        >
          {card.name}
        </div>

        <div className="mt-2 flex flex-col items-center">
          {card.playStyle ? (
            <StyleChip styleId={card.playStyle} size="md" />
          ) : (
            <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
              أسلوب اللعب غير محدد
            </span>
          )}
        </div>

        {showOpeningPrice !== undefined && (
          <div className="mt-3 pt-2 w-full border-t border-white/10 flex justify-between items-center text-xs text-slate-300">
            <span>سعر الافتتاح</span>
            <span className="font-extrabold text-[#FFC94A] text-sm">
              {showOpeningPrice}M
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
