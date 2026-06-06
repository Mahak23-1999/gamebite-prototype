import { useEffect, useRef, useState } from 'react';

const W = 700, H = 320;
const LANE_Y = [80, 160, 240];
const GROUND_Y = 270;

function makeObstacle(x) {
  const lane = Math.floor(Math.random() * 3);
  return { x, y: LANE_Y[lane] - 20, lane, w: 36, h: 36, type: 'obstacle' };
}

function makeFood(x) {
  const lane = Math.floor(Math.random() * 3);
  return { x, y: LANE_Y[lane] - 18, lane, w: 32, h: 32, collected: false };
}

export default function DeliveryRushGame({ onGameEnd }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | playing | won | lost
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [collected, setCollected] = useState(0);

  function initGame() {
    stateRef.current = {
      riderLane: 1,
      riderX: 80,
      riderY: LANE_Y[1],
      jumping: false,
      jumpV: 0,
      obstacles: [],
      foods: [],
      score: 0,
      collected: 0,
      speed: 4,
      frameCount: 0,
      timeLeft: 30,
      lastTime: null,
      elapsed: 0,
      alive: true,
    };
  }

  function startGame() {
    initGame();
    setPhase('playing');
    setScore(0);
    setTimeLeft(30);
    setCollected(0);
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const gs = stateRef.current;

    // Input
    function onKey(e) {
      if (!gs.alive) return;
      if ((e.key === 'ArrowUp' || e.key === 'w') && gs.riderLane > 0) {
        gs.riderLane -= 1;
        gs.riderY = LANE_Y[gs.riderLane];
      }
      if ((e.key === 'ArrowDown' || e.key === 's') && gs.riderLane < 2) {
        gs.riderLane += 1;
        gs.riderY = LANE_Y[gs.riderLane];
      }
    }
    window.addEventListener('keydown', onKey);

    function drawBackground(ctx) {
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.6);
      sky.addColorStop(0, '#e8e4ff');
      sky.addColorStop(1, '#f5f3ff');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H * 0.65);

      // Road
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, H * 0.65, W, H * 0.35);
      // Road lines
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.setLineDash([30, 20]);
      for (let l = 0; l < 3; l++) {
        ctx.beginPath();
        ctx.moveTo(0, LANE_Y[l] + 5);
        ctx.lineTo(W, LANE_Y[l] + 5);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Ground stripe
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(0, GROUND_Y, W, 4);

      // Buildings (static decoration)
      ctx.fillStyle = '#c4b5fd';
      const bldgs = [120, 250, 400, 560, 650];
      bldgs.forEach((bx, i) => {
        const bh = 40 + (i * 13 % 30);
        ctx.fillRect(bx + (gs.frameCount * 0.3 % W) % W - 100, H * 0.65 - bh, 25, bh);
      });
    }

    function drawRider(ctx, x, y) {
      // Bike body
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.roundRect(x - 20, y, 40, 22, 4);
      ctx.fill();

      // Wheels
      ctx.fillStyle = '#1f2937';
      ctx.beginPath(); ctx.arc(x - 12, y + 24, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 12, y + 24, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath(); ctx.arc(x - 12, y + 24, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 12, y + 24, 4, 0, Math.PI * 2); ctx.fill();

      // Rider body
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.roundRect(x - 8, y - 26, 16, 22, 3);
      ctx.fill();

      // Helmet
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(x, y - 30, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x - 7, y - 32, 14, 4);

      // Food bag
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(x + 10, y - 18, 14, 14);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 10, y - 18, 14, 14);
    }

    function drawObstacle(ctx, obs) {
      // Traffic cone
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w / 2, obs.y);
      ctx.lineTo(obs.x, obs.y + obs.h);
      ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.fillRect(obs.x + 8, obs.y + 12, obs.w - 16, 5);
      ctx.fillRect(obs.x + 5, obs.y + obs.h - 8, obs.w - 10, 6);
    }

    function drawFood(ctx, food) {
      if (food.collected) return;
      // Food box
      ctx.fillStyle = '#dcfce7';
      ctx.beginPath();
      ctx.roundRect(food.x, food.y, food.w, food.h, 6);
      ctx.fill();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(food.x, food.y, food.w, food.h);

      ctx.fillStyle = '#16a34a';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☒', food.x + food.w / 2, food.y + food.h / 2 + 6);
      ctx.textAlign = 'left';
    }

    function drawHUD(ctx, gs) {
      // Score
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 130, 44, 10);
      ctx.fill();
      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 11px Poppins, sans-serif';
      ctx.fillText('SCORE', 22, 28);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Poppins, sans-serif';
      ctx.fillText(gs.score, 22, 46);

      // Timer
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.roundRect(W / 2 - 50, 10, 100, 44, 10);
      ctx.fill();
      ctx.fillStyle = gs.timeLeft <= 10 ? '#ef4444' : '#7c3aed';
      ctx.font = 'bold 11px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TIME', W / 2, 28);
      ctx.font = `bold 18px Poppins, sans-serif`;
      ctx.fillText(`${Math.ceil(gs.timeLeft)}s`, W / 2, 46);
      ctx.textAlign = 'left';

      // Collected
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.roundRect(W - 140, 10, 130, 44, 10);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 11px Poppins, sans-serif';
      ctx.fillText('COLLECTED', W - 128, 28);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Poppins, sans-serif';
      ctx.fillText(`${gs.collected} boxes`, W - 128, 46);

      // Lane indicators
      ctx.fillStyle = 'rgba(124,58,237,0.15)';
      ctx.beginPath();
      ctx.roundRect(5, gs.riderY - 24, W - 10, 50, 4);
      ctx.fill();
    }

    function checkCollision(a, bx, by, bw, bh) {
      return a.x < bx + bw && a.x + a.w > bx && a.y < by + bh && a.y + a.h > by;
    }

    let lastTimestamp = null;
    function loop(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      if (!gs.alive) return;

      gs.frameCount++;
      gs.elapsed += dt;
      gs.timeLeft = Math.max(0, 30 - gs.elapsed);
      gs.speed = 4 + gs.elapsed * 0.12;

      // Spawn obstacles
      if (gs.frameCount % 90 === 0) gs.obstacles.push(makeObstacle(W + 20));
      if (gs.frameCount % 60 === 0) gs.foods.push(makeFood(W + 20));

      // Move obstacles
      gs.obstacles = gs.obstacles.filter(o => o.x > -50);
      gs.obstacles.forEach(o => { o.x -= gs.speed; });

      // Move food
      gs.foods = gs.foods.filter(f => f.x > -50);
      gs.foods.forEach(f => { f.x -= gs.speed; });

      // Collision: obstacle
      const riderHitbox = { x: gs.riderX - 18, y: gs.riderY - 24, w: 36, h: 48 };
      for (const obs of gs.obstacles) {
        if (obs.lane === gs.riderLane && checkCollision(riderHitbox, obs.x, obs.y, obs.w, obs.h)) {
          gs.alive = false;
          setPhase('lost');
          setScore(gs.score);
          setCollected(gs.collected);
          onGameEnd && onGameEnd(gs.score, false);
          return;
        }
      }

      // Collision: food
      for (const food of gs.foods) {
        if (!food.collected && food.lane === gs.riderLane && checkCollision(riderHitbox, food.x, food.y, food.w, food.h)) {
          food.collected = true;
          gs.score += 100;
          gs.collected += 1;
        }
      }

      // Win condition
      if (gs.timeLeft <= 0) {
        gs.alive = false;
        setPhase('won');
        setScore(gs.score);
        setCollected(gs.collected);
        onGameEnd && onGameEnd(gs.score, true);
        return;
      }

      // Update state for UI
      setScore(gs.score);
      setTimeLeft(Math.ceil(gs.timeLeft));

      // Draw
      ctx.clearRect(0, 0, W, H);
      drawBackground(ctx);
      gs.foods.forEach(f => drawFood(ctx, f));
      gs.obstacles.forEach(o => drawObstacle(ctx, o));
      drawRider(ctx, gs.riderX, gs.riderY - 24);
      drawHUD(ctx, gs);

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', onKey);
    };
  }, [phase]);

  const laneButtons = [
    { label: 'Lane 1', key: 'ArrowUp', icon: '↑' },
    { label: 'Lane 3', key: 'ArrowDown', icon: '↓' },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Canvas wrapper */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-violet-100 bg-gray-900 w-full" style={{ maxWidth: W }}>
        <canvas ref={canvasRef} width={W} height={H} className="block w-full"/>

        {/* Overlay states */}
        {phase === 'idle' && (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/95 to-purple-900/95 flex flex-col items-center justify-center gap-5">
            <div>
              <h3 className="text-white text-2xl font-bold text-center mb-1">Delivery Rush</h3>
              <p className="text-violet-300 text-sm text-center">Collect food boxes, avoid obstacles, survive 30 seconds</p>
            </div>
            <div className="flex gap-8 text-center">
              <div className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-violet-300 text-xs mb-1">Controls</p>
                <p className="text-white text-sm font-bold">↑ / ↓ Arrow Keys</p>
                <p className="text-violet-300 text-xs">or W / S keys</p>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3">
                <p className="text-violet-300 text-xs mb-1">Scoring</p>
                <p className="text-white text-sm font-bold">+100 per box</p>
                <p className="text-violet-300 text-xs">avoid cones</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-white text-violet-700 px-8 py-3 rounded-xl font-bold text-sm hover:bg-violet-50 transition shadow-lg"
            >
              Start Game
            </button>
          </div>
        )}

        {phase === 'lost' && (
          <div className="absolute inset-0 bg-red-900/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="text-5xl font-black text-white">Crash!</div>
            <p className="text-red-200 text-sm">You hit an obstacle</p>
            <div className="flex gap-6 text-center mt-2">
              <div className="bg-white/10 rounded-xl px-5 py-3">
                <p className="text-red-200 text-xs mb-1">Score</p>
                <p className="text-white text-xl font-bold">{score}</p>
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3">
                <p className="text-red-200 text-xs mb-1">Boxes</p>
                <p className="text-white text-xl font-bold">{collected}</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="mt-2 bg-white text-red-700 px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {phase === 'won' && (
          <div className="absolute inset-0 bg-violet-900/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="text-3xl font-black text-white">You Survived!</div>
            <p className="text-violet-200 text-sm">30 seconds completed</p>
            <div className="flex gap-6 text-center mt-2">
              <div className="bg-white/10 rounded-xl px-5 py-3">
                <p className="text-violet-200 text-xs mb-1">Score</p>
                <p className="text-white text-xl font-bold">{score}</p>
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3">
                <p className="text-violet-200 text-xs mb-1">Boxes Collected</p>
                <p className="text-white text-xl font-bold">{collected}</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="mt-2 bg-white text-violet-700 px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-50 transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-screen lane controls */}
      {phase === 'playing' && (
        <div className="flex gap-3 mt-3">
          <button
            onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
            className="w-11 h-11 bg-violet-100 hover:bg-violet-200 rounded-xl flex items-center justify-center text-violet-700 font-bold text-lg transition active:scale-95"
          >↑</button>
          <button
            onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
            className="w-11 h-11 bg-violet-100 hover:bg-violet-200 rounded-xl flex items-center justify-center text-violet-700 font-bold text-lg transition active:scale-95"
          >↓</button>
          <div className="px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-500 flex items-center">
            Use arrow keys or buttons
          </div>
        </div>
      )}
    </div>
  );
}
