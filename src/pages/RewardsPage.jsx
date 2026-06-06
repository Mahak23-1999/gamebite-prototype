import { useStore } from '../hooks/useStore';

export default function RewardsPage() {
  const { rewards, xp, rewardHistory } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reward Vault</h1>
          <p className="text-sm text-gray-500 mt-1">Your {xp} XP unlocks real food rewards</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {rewards.map(r => {
            const unlocked = xp >= r.xpRequired;
            return (
              <div key={r.id} className={`bg-white rounded-3xl p-5 border shadow-sm flex gap-5 items-center ${unlocked ? 'border-violet-100 hover:shadow-md transition' : 'border-gray-100 opacity-70'}`}>
                <img src={r.image} alt={r.name} className="w-20 h-20 rounded-2xl object-cover shadow"/>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-base">{r.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{r.desc}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-sm font-bold ${unlocked ? 'text-violet-700' : 'text-gray-400'}`}>
                      {r.xpRequired} XP required
                    </span>
                    <button className={`px-4 py-1.5 rounded-xl text-sm font-bold transition ${
                      unlocked ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                      {unlocked ? 'Claim Reward' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Reward History</h2>
          <div className="divide-y divide-gray-50">
            {rewardHistory.map(r => (
              <div key={r.id} className="flex items-center gap-4 py-3">
                {r.image
                  ? <img src={r.image} alt={r.name} className="w-12 h-12 rounded-xl object-cover"/>
                  : <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">+C</div>
                }
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
                {r.xp !== 0 && (
                  <span className={`text-sm font-bold ${r.xp < 0 ? 'text-red-400' : 'text-violet-600'}`}>{r.xp} XP</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
