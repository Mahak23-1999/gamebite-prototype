import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const STAGES = ['Order Confirmed', 'Preparing', 'On The Way', 'Delivered'];

export default function OrderPage() {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [stage, setStage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const items = cart.length > 0 ? cart : [
    { name: 'Chicken Burger', price: 199, qty: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=50&h=50&fit=crop' },
    { name: 'Cheese Pizza', price: 299, qty: 1, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50&h=50&fit=crop' },
    { name: 'Coke 500ml', price: 40, qty: 1, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=50&h=50&fit=crop' },
  ];
  const orderTotal = cart.length > 0 ? total : 538;

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 1500);
    const t2 = setTimeout(() => setShowPopup(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
        {/* Left: Order Summary */}
        <div className="space-y-5">
          {/* Confirmed header */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" className="w-5 h-5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Order Confirmed</h1>
                <p className="text-xs text-gray-400">Order ID: GB123456789</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Thank you! Your order has been placed successfully.</p>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover"/>
                  <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-400">x {item.qty}</span>
                  <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="font-bold text-violet-700 text-lg">₹{orderTotal}</span>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="font-bold text-gray-900 mb-5">Preparing Your Order</h2>
            <div className="relative">
              {/* track line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100"/>
              <div
                className="absolute top-4 left-4 h-0.5 bg-violet-500 transition-all duration-1000"
                style={{ width: `${Math.max(0, (stage - 1) / (STAGES.length - 1) * 100)}%` }}
              />
              <div className="relative flex justify-between">
                {STAGES.map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-2 w-20">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                      i < stage ? 'bg-violet-600 border-violet-600 text-white' :
                      i === stage ? 'bg-violet-100 border-violet-400 text-violet-600' :
                      'bg-white border-gray-200 text-gray-300'
                    }`}>
                      {i < stage ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : i === stage ? (
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"/>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300"/>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold text-center leading-tight ${
                      i <= stage ? 'text-violet-700' : 'text-gray-400'
                    }`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Delivery Details */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h2 className="font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="space-y-3 text-sm">
              {[
                ['Order ID', 'GB123456789'],
                ['Estimated Delivery', '25 – 30 Minutes'],
                ['Delivery Address', '221B Baker Street, London'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400 font-medium">{k}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[55%]">{v}</span>
                </div>
              ))}
            </div>

            {/* Delivery illustration */}
            <div className="mt-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=120&h=80&fit=crop&crop=center"
                alt="delivery"
                className="w-20 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-bold text-violet-700 mb-1">Rider Assigned</p>
                <p className="text-xs text-gray-500 leading-relaxed">Your order will arrive in<br/><strong className="text-violet-700">25–30 minutes</strong></p>
              </div>
            </div>
            <button className="w-full mt-4 border border-violet-200 text-violet-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-50 transition">
              Track Order
            </button>
          </div>

          {/* Time summary */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-wider mb-2">While you wait</p>
            <h3 className="text-2xl font-bold mb-1">You have ~25 minutes</h3>
            <p className="text-violet-200 text-sm">Play games and earn real rewards instead of just scrolling.</p>
            <div className="flex gap-3 mt-4 text-xs text-violet-200">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-300"/>
                Earn XP
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-300"/>
                Win Rewards
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-pink-300"/>
                Unlock Badges
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GameBite Popup */}
      {showPopup && (
        <div className="fixed bottom-8 right-8 animate-slide-in-right z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 w-80 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-500">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Timer */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estimated wait</p>
                <p className="font-bold text-violet-700 text-sm">25–30 minutes</p>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-1.5">We have enough time until delivery.</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Let's earn some rewards while we wait. Play games, complete challenges, and unlock coupons.
            </p>

            <button
              onClick={() => navigate('/hub')}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              Enter GameBite
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
