import { useStore } from '../hooks/useStore';
import { useState } from 'react';

const TABS = ['Overview', 'Badges', 'Rewards', 'Game History'];

function StatCard({ label, value, sub, color = 'violet' }) {
  const colors = {
    violet: 'from-violet-50 to-purple-50 text-violet-700',
    amber: 'from-amber-50 to-yellow-50 text-amber-700',
    orange: 'from-orange-50 to-red-50 text-orange-600',
    green: 'from-green-50 to-emerald-50 text-green-700',
    blue: 'from-blue-50 to-cyan-50 text-blue-700',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 text-center`}>
      <p className={`text-2xl font-black ${color === 'amber' ? 'text-amber-600' : color === 'orange' ? 'text-orange-600' : color === 'green' ? 'text-green-700' : color === 'blue' ? 'text-blue-700' : 'text-violet-700'}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-600 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const store = useStore();
  const [tab, setTab] = useState('Overview');
  const pct = Math.min(100, Math.round((store.xp / store.nextLevelXp) * 100));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Profile header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 relative">
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-16 h-16 rounded-full bg-white/30"
                  style={{ left: `${i * 17}%`, top: '-20%' }}/>
              ))}
            </div>
          </div>
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-8 mb-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
                alt="profile"
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900">Arjun Sharma</h1>
                <p className="text-sm text-gray-500">Level {store.level} – {store.levelName}</p>
              </div>
              <div className="ml-auto pb-1">
                <button className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* XP bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-violet-700 font-bold">{store.xp} / {store.nextLevelXp} XP</span>
                <span className="text-gray-400">{100 - pct}% to Level {store.level + 1}</span>
              </div>
              <div className="h-2.5 bg-violet-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Coins" value={store.coins} color="amber"/>
          <StatCard label="Day Streak" value={store.streak} color="orange"/>
          <StatCard label="Games Played" value={store.gamesPlayed} color="violet"/>
          <StatCard label="Badges" value={store.badges.filter(b => b.unlocked).length} color="blue"/>
          <StatCard label="Challenges" value={store.challengesCompleted} color="green"/>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-100 px-5 pt-2">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  tab === t ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'Overview' && (
              <div className="grid grid-cols-2 gap-6">
                {/* Progress overview */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Progress Overview</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Total XP Earned', value: '2,450 XP', icon: '⚡', color: 'text-violet-700' },
                      { label: 'Total Coins', value: `${store.coins}`, icon: 'C', color: 'text-amber-600' },
                      { label: 'Games Played', value: store.gamesPlayed, icon: '▶', color: 'text-blue-600' },
                      { label: 'Challenges Completed', value: store.challengesCompleted, icon: '+', color: 'text-green-600' },
                      { label: 'Current Streak', value: `${store.streak} Days`, icon: '~', color: 'text-orange-500' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-sm font-bold w-5 text-center ${item.color}`}>{item.icon}</span>
                          <span className="text-sm text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reward History */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Reward History</h3>
                    <button className="text-xs text-violet-600 font-semibold">View All</button>
                  </div>
                  <div className="space-y-3">
                    {store.rewardHistory.map(r => (
                      <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        {r.image ? (
                          <img src={r.image} alt={r.name} className="w-10 h-10 rounded-xl object-cover"/>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <span className="text-amber-600 text-xs font-bold">+C</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                          <p className="text-[11px] text-gray-400">{r.date}</p>
                        </div>
                        <div className="text-right">
                          {r.xp !== 0 && (
                            <p className={`text-xs font-bold ${r.xp < 0 ? 'text-red-400' : 'text-violet-600'}`}>
                              {r.xp} XP
                            </p>
                          )}
                          {r.coins !== 0 && (
                            <p className="text-xs font-bold text-amber-600">+{r.coins}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'Badges' && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Badge Collection</h3>
                <div className="grid grid-cols-6 gap-3">
                  {store.badges.map(badge => (
                    <div key={badge.id} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center ${
                      badge.unlocked ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                    }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        badge.unlocked ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg' : 'bg-gray-200'
                      }`}>
                        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-gray-800">{badge.name}</p>
                      <p className="text-[9px] text-gray-400 leading-tight">{badge.desc}</p>
                      {badge.unlocked && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Earned</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Rewards' && (
              <div className="grid grid-cols-2 gap-3">
                {store.rewards.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-violet-200 transition">
                    <img src={r.image} alt={r.name} className="w-14 h-14 rounded-xl object-cover"/>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                      <p className="text-xs font-bold text-violet-600 mt-1">{r.xpRequired} XP</p>
                    </div>
                    <button className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      store.xp >= r.xpRequired ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {store.xp >= r.xpRequired ? 'Claim' : 'Locked'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Game History' && (
              <div className="space-y-3">
                {[
                  { game: 'Delivery Rush', score: 980, won: true, date: '06 Jun', xp: 75 },
                  { game: 'Delivery Rush', score: 660, won: false, date: '05 Jun', xp: 25 },
                  { game: 'Delivery Rush', score: 1120, won: true, date: '04 Jun', xp: 75 },
                  { game: 'Delivery Rush', score: 540, won: false, date: '03 Jun', xp: 25 },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${g.won ? 'bg-green-100' : 'bg-red-50'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={g.won ? '#16a34a' : '#ef4444'} strokeWidth="2" className="w-5 h-5">
                        {g.won
                          ? <polyline points="20 6 9 17 4 12"/>
                          : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                        }
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{g.game}</p>
                      <p className="text-xs text-gray-400">{g.date} • Score: {g.score}</p>
                    </div>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-full">+{g.xp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
