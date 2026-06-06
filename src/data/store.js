// Central game state - simple module-level store with pub/sub
let state = {
  xp: 120,
  coins: 250,
  level: 7,
  levelName: 'Food Explorer',
  nextLevelXp: 200,
  streak: 7,
  gamesPlayed: 12,
  challengesCompleted: 18,
  orderTime: 25 * 60, // seconds
  cart: [],
  orderPlaced: false,
  badges: [
    { id: 'first_order', name: 'First Order', desc: 'Placed your first order', unlocked: true },
    { id: 'fast_player', name: 'Fast Player', desc: 'Completed a game in record time', unlocked: true },
    { id: 'pizza_master', name: 'Pizza Master', desc: 'Ordered pizza 5 times', unlocked: true },
    { id: 'reward_hunter', name: 'Reward Hunter', desc: 'Claimed 3 rewards', unlocked: true },
    { id: 'delivery_champion', name: 'Delivery Champion', desc: 'Played during 10 deliveries', unlocked: false },
    { id: 'streak_master', name: 'Streak Master', desc: 'Maintained a 10-day streak', unlocked: false },
  ],
  rewardHistory: [
    { id: 1, name: 'Free Coke', xp: -100, coins: 0, date: '06 Jun 2026', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=60&h=60&fit=crop' },
    { id: 2, name: '₹20 Coupon', xp: -50, coins: 0, date: '05 Jun 2026', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop' },
    { id: 3, name: 'Free Donut', xp: -200, coins: 0, date: '03 Jun 2026', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=60&h=60&fit=crop' },
    { id: 4, name: '+50 Coins Earned', xp: 0, coins: 50, date: '02 Jun 2026', image: null },
  ],
  challenges: [
    { id: 'play1', text: 'Play 1 Game', progress: 0, total: 1, xpReward: 20, completed: false },
    { id: 'earn100', text: 'Earn 100 XP', progress: 120, total: 100, xpReward: 50, completed: true },
    { id: 'streak3', text: 'Maintain 3 Day Streak', progress: 1, total: 3, xpReward: 30, completed: false },
  ],
  rewards: [
    { id: 1, name: 'Free Coke', xpRequired: 100, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=80&h=80&fit=crop', desc: 'Coca-Cola 330ml' },
    { id: 2, name: '₹20 Coupon', xpRequired: 200, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=80&fit=crop', desc: 'Off your next order' },
    { id: 3, name: 'Free Donut', xpRequired: 200, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=80&h=80&fit=crop', desc: 'Chocolate glazed donut' },
    { id: 4, name: 'Premium Pack', xpRequired: 500, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop', desc: 'Exclusive bundle reward' },
  ],
};

const listeners = new Set();

export function getState() { return { ...state }; }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => fn({ ...state }));
}

export function addXP(amount) {
  state.xp += amount;
  if (state.xp >= state.nextLevelXp) {
    state.xp -= state.nextLevelXp;
    state.level += 1;
    state.nextLevelXp = Math.floor(state.nextLevelXp * 1.3);
  }
  notify();
}

export function addCoins(amount) {
  state.coins += amount;
  notify();
}

export function addToCart(item) {
  const existing = state.cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart = [...state.cart, { ...item, qty: 1 }];
  }
  notify();
}

export function placeOrder() {
  state.orderPlaced = true;
  notify();
}

export function incrementGamesPlayed() {
  state.gamesPlayed += 1;
  // update challenge
  const c = state.challenges.find(c => c.id === 'play1');
  if (c && !c.completed) { c.progress = 1; c.completed = true; }
  notify();
}

export function unlockBadge(id) {
  const badge = state.badges.find(b => b.id === id);
  if (badge) badge.unlocked = true;
  notify();
}
