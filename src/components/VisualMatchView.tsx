import React, { useEffect, useRef, useState } from 'react';
import { MatchResult, MatchStatEvent, Team } from '../types/models';
import { MatchVisualCoordinator, VisualPlayerState } from '../game/matchSim';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';

interface VisualMatchViewProps {
  home: Team;
  away: Team;
  result: MatchResult;
  onFinish?: () => void;
}

export const VisualMatchView: React.FC<VisualMatchViewProps> = ({ home, away, result, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [liveHomeScore, setLiveHomeScore] = useState(0);
  const [liveAwayScore, setLiveAwayScore] = useState(0);
  const [activeBanner, setActiveBanner] = useState<string | null>(null);
  const [bannerColor, setBannerColor] = useState<string>('#FFC94A');
  const [currentCommentary, setCurrentCommentary] = useState<string>('صافرة البداية تنطلق! مباراة تكتيكية ملحمية.');

  const playersRef = useRef<VisualPlayerState[]>([]);
  const ballRef = useRef<{ x: number; y: number; vx: number; vy: number; targetX: number; targetY: number }>({
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    targetX: 50,
    targetY: 50,
  });

  const specialEffectRef = useRef<{
    type: 'horus' | 'octopus' | 'goal' | null;
    timer: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>({
    type: null,
    timer: 0,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  // Initialize visual players on mount
  useEffect(() => {
    playersRef.current = MatchVisualCoordinator.getInitialPositions(home, away);
  }, [home, away]);

  // Match clock progression and event trigger
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentMinute(prev => {
        if (prev >= 90) {
          setIsPlaying(false);
          clearInterval(interval);
          if (onFinish) onFinish();
          return 90;
        }

        const nextMinute = prev + 1;

        // Check if an event matches this minute
        const triggered = result.events.find(e => e.minute === nextMinute);
        if (triggered) {
          setCurrentCommentary(triggered.textAr);

          if (triggered.type === 'goal' || triggered.type === 'horus') {
            if (triggered.teamId === home.id) {
              setLiveHomeScore(s => s + 1);
            } else {
              setLiveAwayScore(s => s + 1);
            }

            setActiveBanner(triggered.type === 'horus' ? '⚡ عين حورس الأسطورية!' : '⚽ جوووووووول!');
            setBannerColor(triggered.type === 'horus' ? '#FFC94A' : '#27D17F');
            setTimeout(() => setActiveBanner(null), 3000);

            // Ball kicks towards net
            ballRef.current.targetX = triggered.teamId === home.id ? 95 : 5;
            ballRef.current.targetY = 48 + (Math.random() * 8 - 4);

            if (triggered.type === 'horus') {
              specialEffectRef.current = {
                type: 'horus',
                timer: 45,
                startX: 40,
                startY: 50,
                endX: triggered.teamId === home.id ? 95 : 5,
                endY: 50,
              };
            }
          } else if (triggered.type === 'octopus') {
            setActiveBanner('🐙 الأخطبوط الأسود يتصدى!');
            setBannerColor('#9B72FF');
            setTimeout(() => setActiveBanner(null), 2500);

            specialEffectRef.current = {
              type: 'octopus',
              timer: 45,
              startX: triggered.teamId === home.id ? 10 : 90,
              startY: 50,
              endX: triggered.teamId === home.id ? 10 : 90,
              endY: 50,
            };
          } else if (triggered.type === 'save') {
            setActiveBanner('🧤 تصدٍ خيالي!');
            setBannerColor('#35B8FF');
            setTimeout(() => setActiveBanner(null), 2000);
          }
        }

        // Random subtle ball movement between players
        if (Math.random() < 0.3) {
          const randomPlayer = playersRef.current[Math.floor(Math.random() * playersRef.current.length)];
          if (randomPlayer) {
            ballRef.current.targetX = randomPlayer.x;
            ballRef.current.targetY = randomPlayer.y;
          }
        }

        return nextMinute;
      });
    }, 400 / simSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, result.events, home.id, onFinish]);

  // Main 60fps 2D Canvas rendering loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear & Draw Tactical Grass Pitch
      ctx.fillStyle = '#0B1C10';
      ctx.fillRect(0, 0, w, h);

      // Grass stripes
      const stripeWidth = w / 10;
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
          ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
        }
      }

      // Pitch Boundary & Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      const padding = 20;

      // Outer Box
      ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);

      // Halfway Line
      ctx.beginPath();
      ctx.moveTo(w / 2, padding);
      ctx.lineTo(w / 2, h - padding);
      ctx.stroke();

      // Center Circle
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.16, 0, Math.PI * 2);
      ctx.stroke();

      // Center Dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Penalty Boxes (Left & Right)
      const boxW = w * 0.14;
      const boxH = h * 0.44;
      const boxY = (h - boxH) / 2;

      // Left Box
      ctx.strokeRect(padding, boxY, boxW, boxH);
      // Right Box
      ctx.strokeRect(w - padding - boxW, boxY, boxW, boxH);

      // Goals (Left & Right)
      const goalH = h * 0.22;
      const goalY = (h - goalH) / 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(padding - 10, goalY, 10, goalH);
      ctx.fillRect(w - padding, goalY, 10, goalH);

      // 2. Animate and Draw Players
      playersRef.current.forEach(p => {
        // Natural wandering around initial position
        p.x += (p.targetX - p.x) * 0.05 + (Math.random() - 0.5) * 0.2;
        p.y += (p.targetY - p.y) * 0.05 + (Math.random() - 0.5) * 0.2;

        const px = (p.x / 100) * w;
        const py = (p.y / 100) * h;

        const isHome = p.teamId === home.id;

        // Player Circle Glow
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.fillStyle = isHome ? '#35B8FF' : '#FFC94A';
        ctx.shadowColor = isHome ? 'rgba(53, 184, 255, 0.6)' : 'rgba(255, 201, 74, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer Ring for Goalkeepers
        if (p.pos === 'GK') {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Player Initial
        ctx.fillStyle = '#050B12';
        ctx.font = 'bold 9px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.name.charAt(0), px, py + 1);

        // Player Name Tag Below
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 8px Cairo, sans-serif';
        ctx.fillText(p.name.split(' ')[0], px, py + 16);
      });

      // 3. Animate & Draw Ball
      const b = ballRef.current;
      b.x += (b.targetX - b.x) * 0.08;
      b.y += (b.targetY - b.y) * 0.08;
      const bx = (b.x / 100) * w;
      const by = (b.y / 100) * h;

      // Ball Shadow
      ctx.beginPath();
      ctx.arc(bx + 2, by + 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Ball
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#050B12';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Special Mythic Effects Rendering
      const fx = specialEffectRef.current;
      if (fx.type === 'horus' && fx.timer > 0) {
        fx.timer--;
        ctx.save();
        ctx.strokeStyle = '#FFC94A';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#FFC94A';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo((fx.startX / 100) * w, (fx.startY / 100) * h);
        ctx.lineTo((fx.endX / 100) * w, (fx.endY / 100) * h);
        ctx.stroke();

        // Horus Laser Core
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      if (fx.type === 'octopus' && fx.timer > 0) {
        fx.timer--;
        ctx.save();
        ctx.strokeStyle = '#9B72FF';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#9B72FF';
        ctx.shadowBlur = 18;
        const ox = (fx.startX / 100) * w;
        const oy = (fx.startY / 100) * h;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(ox, oy, 20 + i * 12, -Math.PI / 2, Math.PI / 2, false);
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [home.id]);

  const restartSimulation = () => {
    setCurrentMinute(0);
    setLiveHomeScore(0);
    setLiveAwayScore(0);
    setIsPlaying(true);
    setCurrentCommentary('إعادة انطلاق المباراة!');
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Match Scoreboard Header */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-[#0E1A2C] via-[#121F33] to-[#0E1A2C] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#35B8FF] shadow-[0_0_10px_#35B8FF]" />
          <span className="font-black text-lg text-white">{home.name}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-black tracking-wider text-white bg-black/40 px-6 py-1.5 rounded-xl border border-white/10">
            {liveHomeScore} - {liveAwayScore}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs font-bold text-[#FFC94A]">
            <span className="animate-pulse">●</span>
            <span>الدقيقة {currentMinute}'</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-black text-lg text-white">{away.name}</span>
          <div className="w-4 h-4 rounded-full bg-[#FFC94A] shadow-[0_0_10px_#FFC94A]" />
        </div>
      </div>

      {/* 2D Canvas Pitch Box */}
      <div className="relative w-full max-w-4xl aspect-[16/9] rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-contain"
        />

        {/* Live Banner Overlay */}
        {activeBanner && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
            <div
              className="px-8 py-3 rounded-2xl font-black text-2xl text-black shadow-2xl tracking-wide"
              style={{ backgroundColor: bannerColor }}
            >
              {activeBanner}
            </div>
          </div>
        )}
      </div>

      {/* Egyptian Commentary Ticker */}
      <div className="w-full max-w-4xl bg-[#09111C]/90 border border-white/10 rounded-xl p-3 flex items-center gap-3">
        <div className="px-2 py-0.5 rounded bg-[#FFC94A]/20 text-[#FFC94A] text-xs font-extrabold whitespace-nowrap">
          تعليق مباشر
        </div>
        <p className="text-sm font-semibold text-slate-200 truncate">
          {currentCommentary}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setSimSpeed(s => (s === 1 ? 2 : s === 2 ? 4 : 1))}
          className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
        >
          <FastForward className="w-4 h-4" />
          <span>{simSpeed}x سرعة</span>
        </button>

        <button
          onClick={restartSimulation}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
