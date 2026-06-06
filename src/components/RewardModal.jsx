import { useEffect, useState } from 'react';
import { addXP, addCoins } from '../data/store';

const GAME_REWARDS = {
  win: { xp: 75, coins: 30, reward: { name: 'Coca-Cola 330ml', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=120&h=120&fit=crop', desc: 'Added to Reward Inventory' } },
  lose: { xp: 25, coins: 10, reward: null },
};

export default function RewardModal({ score, won, onClose, onContinue }) {
  const [revealed, setRevealed] = useState(false);
  const data = won ? GAME_REWARDS.win : GAME_REWARDS.lose;

  useEffect(() => {
    addXP(data.xp);
    addCoins(data.coins);
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transition-all duration-500 ${revealed ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Header */}
        <div className={`px-6 pt-8 pb-5 text-center ${won ? 'bg-gradient-to-br from-violet-600 to-purple-700' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
          <div className="text-white">
            <div className="text-3xl font-black mb-1">{won ? 'Game Completed' : 'Good Effort'}</div>
            <div className="text-violet-200 text-sm">
              Score: <span className="font-bold text-white text-lg">{score}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Rewards earned */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rewards Earned</p>
            <div className="flex gap-3">
              <div className="flex-1 bg-violet-50 rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-black text-violet-700">+{data.xp}</p>
                <p className="text-xs text-violet-500 font-semibold">XP</p>
              </div>
              <div className="flex-1 bg-amber-50 rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-black text-amber-600">+{data.coins}</p>
                <p className="text-xs text-amber-500 font-semibold">Coins</p>
              </div>
            </div>
          </div>

          {/* Reward unlocked */}
          {won && data.reward && (
            <div className={`border-2 border-violet-100 rounded-2xl p-4 flex items-center gap-4 ${revealed ? 'animate-reward-reveal' : 'opacity-0'}`}>
              <img src={data.reward.image} alt={data.reward.name} className="w-16 h-16 rounded-xl object-cover shadow-md"/>
              <div>
                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-0.5">Reward Unlocked</p>
                <p className="font-bold text-gray-900">{data.reward.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{data.reward.desc}</p>
              </div>
            </div>
          )}

          {!won && (
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-sm font-semibold text-gray-700">Keep playing to unlock bigger rewards</p>
              <p className="text-xs text-gray-400 mt-1">Survive 30 seconds to win a reward</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
            >
              View Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
