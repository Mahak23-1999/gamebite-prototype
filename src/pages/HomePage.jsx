import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart, placeOrder } from '../data/store';
import { useStore } from '../hooks/useStore';

const FOODS = [
  {
    id: 1, name: 'Cheese Pizza', restaurant: 'La Pinoz Pizza', price: 299, category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop&crop=center',
  },
  {
    id: 2, name: 'Chicken Burger', restaurant: 'Burger King', price: 199, category: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=280&fit=crop&crop=center',
  },
  {
    id: 3, name: 'Creamy Pasta', restaurant: 'The Pasta Bowl', price: 249, category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=280&fit=crop&crop=center',
  },
  {
    id: 4, name: 'Grilled Sandwich', restaurant: 'Sandwich House', price: 179, category: 'Sandwich',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=280&fit=crop&crop=center',
  },
  {
    id: 5, name: 'Margherita Pizza', restaurant: 'Dominos', price: 349, category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=280&fit=crop&crop=center',
  },
  {
    id: 6, name: 'Double Smash Burger', restaurant: 'Smashburger', price: 279, category: 'Burger',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=280&fit=crop&crop=center',
  },
];

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Pasta', 'Sandwich'];

export default function HomePage() {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedItems, setAddedItems] = useState(new Set());

  const filtered = activeCategory === 'All' ? FOODS : FOODS.filter(f => f.category === activeCategory);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function handleAdd(food) {
    addToCart(food);
    setAddedItems(prev => new Set([...prev, food.id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const n = new Set(prev);
        n.delete(food.id);
        return n;
      });
    }, 1500);
  }

  function handleOrder() {
    placeOrder();
    navigate('/order');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-violet-600">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="font-medium text-gray-700">Delivering to</span>
          <span className="text-violet-600 font-semibold">221B Baker Street, London</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <div className="flex-1 mx-8 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition"
            placeholder="Search for pizza, burger, pasta..."
          />
        </div>

        <div className="flex items-center gap-3">
          {cart.length > 0 && (
            <button
              onClick={handleOrder}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              Place Order
              <span className="bg-white text-violet-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{cartCount}</span>
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">A</div>
        </div>
      </header>

      <div className="px-8 py-6 space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden h-56 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop&crop=center"
            alt="Food banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-violet-800/70 to-transparent"/>
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <div className="animate-fade-in-up">
              <p className="text-violet-200 text-sm font-semibold mb-1 tracking-wider uppercase">Food + Rewards</p>
              <h1 className="text-white text-4xl font-bold leading-tight mb-2">
                Good Food.<br/>Great Time.
              </h1>
              <p className="text-violet-200 text-sm max-w-xs leading-relaxed">
                Order your favorite food and earn rewards while you wait.
              </p>
              <button
                className="mt-4 bg-white text-violet-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-50 transition-all shadow-md"
                onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })}
              >
                Order Now
              </button>
            </div>
          </div>
          {/* Floating timer badge */}
          <div className="absolute top-4 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
            <p className="text-[10px] text-gray-500 font-medium">Earn while you wait</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-xs font-bold text-gray-800">GameBite Active</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div id="menu-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Popular Right Now</h2>
            <button className="text-sm text-violet-600 font-semibold hover:text-violet-800 transition">View All</button>
          </div>

          <div className="flex gap-2 mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-200 hover:text-violet-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food Cards */}
          <div className="grid grid-cols-4 gap-4">
            {filtered.map((food, i) => (
              <div
                key={food.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative overflow-hidden h-40">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-600 shadow-sm">
                    +20 XP
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="font-semibold text-gray-900 text-sm">{food.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2.5">{food.restaurant}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">₹{food.price}</span>
                    <button
                      onClick={() => handleAdd(food)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        addedItems.has(food.id)
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                      }`}
                    >
                      {addedItems.has(food.id) ? 'Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up" style={{ marginLeft: '112px' }}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-3.5 flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</p>
                <p className="font-bold text-gray-900">₹{cartTotal}</p>
              </div>
              <button
                onClick={handleOrder}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
