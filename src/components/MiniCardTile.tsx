import React from 'react';
import { PlayerCard } from '../types/models';
import { StyleChip } from './StyleChip';

interface MiniCardTileProps {
  card: PlayerCard;
  onClick?: () => void;
  selected?: boolean;
}

export const MiniCardTile: React.FC<MiniCardTileProps> = ({ card, onClick, selected = false }) => {
  const isLegend = card.era === 'legend';

  return (
    <div
      onClick={onClick}
      className={`relative p-3 rounded-2xl border transition-all select-none flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-[#FFC94A] hover:scale-[1.02]' : ''
      } ${
        selected
          ? 'border-[#FFC94A] bg-[#FFC94A]/10 shadow-[0_0_20px_rgba(255,201,74,0.3)]'
          : isLegend
          ? 'border-[#FFC94A]/30 bg-[#161D2B]/90'
          : 'border-white/10 bg-[#0E1522]/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`font-black text-lg ${
              isLegend ? 'text-[#FFC94A]' : 'text-white'
            }`}
          >
            {card.rating}
          </span>
          <span className="text-xs font-black uppercase text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
            {card.pos}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[90px]">
          {card.club}
        </span>
      </div>

      <div className="my-2">
        <div className="font-bold text-sm text-white truncate">{card.name}</div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        {card.playStyle ? (
          <StyleChip styleId={card.playStyle} size="sm" />
        ) : (
          <span className="text-[10px] text-slate-400">عادي</span>
        )}
      </div>
    </div>
  );
};
