import React from 'react';
import { PLAYSTYLES } from '../game/playstyles';
import { PlayStyleId } from '../types/models';
import { Eye, Shield, Target, Zap, Sparkles, Feather, Flame, Activity } from 'lucide-react';

interface StyleChipProps {
  styleId?: PlayStyleId;
  size?: 'sm' | 'md' | 'lg';
  showDesc?: boolean;
}

export const StyleChip: React.FC<StyleChipProps> = ({ styleId, size = 'md', showDesc = false }) => {
  if (!styleId || !PLAYSTYLES[styleId]) return null;

  const style = PLAYSTYLES[styleId];

  const getIcon = () => {
    switch (styleId) {
      case 'horusEye': return <Eye className="w-3.5 h-3.5 text-[#FFC94A] animate-pulse" />;
      case 'octopus': return <Sparkles className="w-3.5 h-3.5 text-[#9B72FF]" />;
      case 'sniper': return <Target className="w-3.5 h-3.5 text-[#FF5267]" />;
      case 'finisher': return <Flame className="w-3.5 h-3.5 text-[#FF6B4A]" />;
      case 'hawk': return <Feather className="w-3.5 h-3.5 text-[#35B8FF]" />;
      case 'rocket': return <Zap className="w-3.5 h-3.5 text-[#27D17F]" />;
      case 'wall': return <Shield className="w-3.5 h-3.5 text-[#94A3B8]" />;
      default: return <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-black',
  }[size];

  const isMythic = style.tier === 'mythic';

  return (
    <div className="flex flex-col gap-1 items-start">
      <div
        className={`inline-flex items-center rounded-full border shadow-sm transition-all ${sizeClasses} ${
          isMythic
            ? 'border-[#FFC94A]/60 bg-gradient-to-r from-[#FFC94A]/20 via-[#9B72FF]/20 to-[#FFC94A]/20 shadow-[0_0_12px_rgba(255,201,74,0.35)]'
            : 'border-white/15 bg-white/5 backdrop-blur-md'
        }`}
      >
        {getIcon()}
        <span style={{ color: style.badgeColor }}>
          {style.nameAr}
        </span>
        {isMythic && (
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FFC94A] bg-[#FFC94A]/20 px-1 rounded">
            أسطوري
          </span>
        )}
      </div>
      {showDesc && (
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs pr-1">
          {style.descriptionAr}
        </p>
      )}
    </div>
  );
};
