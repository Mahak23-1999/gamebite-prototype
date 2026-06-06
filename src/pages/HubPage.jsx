import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { incrementGamesPlayed } from '../data/store';
import DeliveryRushGame from '../components/DeliveryRushGame';
import RewardModal from '../components/RewardModal';

function XPBar({ current, max }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-violet-700">{current} XP</span>
        <span className="text-gray-400">Next: {max} XP</span>
      </div>
      <div className="h-2.5 bg-violet-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ChallengeRow({ challenge }) {
  const pct = Math.min(100, (challenge.progress / challenge.total) * 100);
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        challenge.completed ? 'bg-green-100' : 'bg-violet-100'
      }`}>
        {challenge.completed ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" className="w-4 h-4">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <span className={`text-sm font-semibold ${challenge.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {challenge.text}
          </span>
          <span className="text-xs font-bold text-gray-500">{challenge.progress}/{challenge.total}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${challenge.completed ? 'bg-green-400' : 'bg-violet-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
        challenge.completed ? 'bg-green-50 text-green-600' : 'bg-violet-50 text-violet-600'
      }`}>+{challenge.xpReward} XP</span>
    </div>
  );
}

function RewardCard({ reward, userXP }) {
  const canClaim = userXP >= reward.xpRequired;
  return (
    <div className={`bg-white rounded-2xl border p-3.5 flex items-center gap-3.5 transition-all ${canClaim ? 'border-violet-200 shadow-sm hover:shadow-md hover:-translate-y-0.5' : 'border-gray-100 opacity-70'}`}>
      <img src={reward.image} alt={reward.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{reward.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{reward.desc}</p>
        <p className={`text-xs font-bold mt-1 ${canClaim ? 'text-violet-600' : 'text-gray-400'}`}>
          {reward.xpRequired} XP required
        </p>
      </div>
      <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
        canClaim ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}>
        {canClaim ? 'Claim' : 'Locked'}
      </button>
    </div>
  );
}

function BadgeCard({ badge }) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all ${
      badge.unlocked ? 'bg-white border-violet-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        badge.unlocked ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-md' : 'bg-gray-200'
      }`}>
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div>
        <p className="text-[11px] font-bold text-gray-800">{badge.name}</p>
        <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{badge.desc}</p>
      </div>
    </div>
  );
}

export default function HubPage() {
  const navigate = useNavigate();
  const store = useStore();
  const [timeLeft, setTimeLeft] = useState(23 * 60 + 45);
  const [showGame, setShowGame] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastGameResult, setLastGameResult] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  function handleGameEnd(score, won) {
    incrementGamesPlayed();
    setShowGame(false);
    setLastGameResult({ score, won });
    setShowReward(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Top Row: Timer + XP + Coins */}
        <div className="grid grid-cols-3 gap-4">
          {/* Timer */}
          <div className="col-span-1 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8"/>
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-2">Order Arrives In</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black tabular-nums timer-tick">{mins}:{secs}</span>
              <span className="text-violet-300 text-sm mb-2">mins</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-violet-200 text-xs">Rider is on the way</span>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face"
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-gray-400 font-medium">Level {store.level}</p>
                <p className="font-bold text-gray-900 text-sm">{store.levelName}</p>
              </div>
              <button className="ml-auto w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-gray-500">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <XPBar current={store.xp} max={store.nextLevelXp}/>
            <p className="text-xs text-gray-400 mt-2">
              Next reward: <span className="font-semibold text-violet-600">Free Coke</span>
            </p>
          </div>

          {/* Coins */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-3">Total Coins</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" fill="#f59e0b" className="w-7 h-7">
                  <circle cx="12" cy="12" r="10"/>
                  <path fill="#fde68a" d="M12 6v12M8 9h8M8 15h8" stroke="#f59e0b" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-black text-amber-600 tabular-nums">{store.coins}</p>
                <p className="text-xs text-gray-400">coins earned</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400"/>
              <span className="text-xs text-gray-500">{store.streak}-day streak active</span>
            </div>
          </div>
        </div>

        {/* Why Am I Here + Challenges */}
        <div className="grid grid-cols-3 gap-4">
          {/* Why block */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Why Am I Here?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              You have time before delivery. Complete challenges and earn exciting rewards while you wait.
            </p>
            <div className="space-y-2">
              {[
                { icon: '▶', text: 'Play games to earn XP', color: 'bg-violet-50 text-violet-700' },
                { icon: '+', text: 'Claim real food rewards', color: 'bg-green-50 text-green-700' },
                { icon: '★', text: 'Unlock achievements', color: 'bg-amber-50 text-amber-700' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${item.color}`}>
                  <span className="text-xs font-bold w-4 text-center">{item.icon}</span>
                  <span className="text-xs font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="col-span-2 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Daily Challenges</h3>
              <button className="text-xs text-violet-600 font-semibold">View All</button>
            </div>
            <div>
              {store.challenges.map(c => <ChallengeRow key={c.id} challenge={c}/>)}
            </div>
          </div>
        </div>

        {/* FEATURED GAME */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">FEATURED GAME</span>
                <span className="text-xs text-gray-400">+50 XP on win</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delivery Rush</h2>
              <p className="text-sm text-gray-500 mt-0.5">Control the rider, collect food boxes, avoid traffic cones. Survive 30 seconds to win.</p>
            </div>
            {!showGame && (
              <button
                onClick={() => setShowGame(true)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-violet-700 hover:to-purple-700 transition shadow-md"
              >
                Play Now
              </button>
            )}
          </div>

          {showGame ? (
            <DeliveryRushGame onGameEnd={handleGameEnd}/>
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden h-40 cursor-pointer group"
              onClick={() => setShowGame(true)}
            >
              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&h=200&fit=crop&crop=center"
                alt="game preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-800/80 to-transparent flex items-center px-8">
                <div>
                  <p className="text-white font-bold text-lg">High Score: 980</p>
                  <p className="text-violet-200 text-sm">Click to play</p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition">
                  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reward Vault + Achievements */}
        <div className="grid grid-cols-2 gap-4">
          {/* Reward Vault */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Reward Vault</h3>
              <button className="text-xs text-violet-600 font-semibold">View All</button>
            </div>
            <div className="space-y-3">
              {store.rewards.map(r => <RewardCard key={r.id} reward={r} userXP={store.xp}/>)}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Achievements</h3>
              <button className="text-xs text-violet-600 font-semibold">View All</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {store.badges.map(b => <BadgeCard key={b.id} badge={b}/>)}
            </div>

            {/* Streak card */}
            <div className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-orange-700 mb-1">Daily Streak</p>
                  <p className="text-3xl font-black text-orange-600">{store.streak} <span className="text-sm font-semibold">days</span></p>
                </div>
                <div className="flex gap-1.5">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${i < store.streak % 7 || store.streak >= 7 ? 'bg-orange-400' : 'bg-orange-100'}`}/>
                  ))}
                </div>
              </div>
              <p className="text-xs text-orange-500 mt-2">Keep playing daily to maintain your streak</p>
            </div>

            {/* Next reward hint */}
            <div className="mt-3 bg-violet-50 rounded-2xl p-3 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=48&h=48&fit=crop"
                alt="reward"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">Keep playing</p>
                <p className="text-xs font-semibold text-gray-800">Your next reward is waiting for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Modal */}
      {showReward && lastGameResult && (
        <RewardModal
          score={lastGameResult.score}
          won={lastGameResult.won}
          onClose={() => { setShowReward(false); navigate('/rewards'); }}
          onContinue={() => { setShowReward(false); setShowGame(true); }}
        />
      )}
    </div>
  );
}
