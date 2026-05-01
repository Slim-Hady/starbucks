import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rewardsTiers, howItWorks } from '../data/rewards';
import { useAuthContext } from '../context/AuthContext';

export default function Rewards() {
  const { isLoggedIn, user } = useAuthContext();
  const [tiers, setTiers] = useState([]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    setTiers(rewardsTiers);
    setSteps(howItWorks);
  }, []);

  const userStars = user?.stars || 0;
  const nextTierStars = tiers.find((t) => t.stars > userStars)?.stars || 400;
  const progress = Math.min((userStars / nextTierStars) * 100, 100);

  return (
    <main className="min-h-screen bg-sb-cream">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sb-dark via-[#155835] to-sb-green py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 text-[200px] font-black flex items-center justify-center pointer-events-none select-none text-sb-gold">★★★</div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-6xl mb-4 animate-pulse">⭐</div>
          <h1 className="text-5xl font-black mb-4">Starbucks Rewards</h1>
          <p className="text-gray-300 text-lg mb-8">Join millions of members earning Stars on every purchase. Free drinks, exclusive offers, and more.</p>
          {!isLoggedIn && (
            <Link to="/login" className="inline-block bg-sb-gold hover:brightness-110 text-white font-black px-10 py-4 rounded-pill transition-all hover:scale-105 shadow-xl">
              Join Now — It's Free
            </Link>
          )}
        </div>
      </section>

      {/* User Dashboard (if logged in) */}
      {isLoggedIn && (
        <section className="bg-white py-10 px-4 shadow-inner">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-sb-dark mb-1">Welcome back, {user.name.split(' ')[0]}! ⭐</h2>
            <p className="text-gray-500 text-sm mb-6">You have <span className="font-bold text-sb-gold">{userStars} Stars</span>. Keep earning to unlock your next reward!</p>

            <div className="bg-gradient-to-r from-sb-dark to-sb-green rounded-[20px] p-6 text-white mb-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm">⭐ {userStars} Stars</span>
                <span className="text-sm text-gray-300">Next: {nextTierStars} Stars</span>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div className="bg-sb-gold h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-300 mt-2">{nextTierStars - userStars} more Stars until your next reward</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-sb-light rounded-card p-4 text-center shadow">
                <p className="text-sm text-gray-500">Current Tier</p>
                <p className="font-black text-sb-dark text-lg">{userStars >= 300 ? '⭐ Gold' : '🟢 Green'}</p>
              </div>
              <div className="bg-sb-light rounded-card p-4 text-center shadow">
                <p className="text-sm text-gray-500">Stars Earned</p>
                <p className="font-black text-sb-gold text-2xl">{userStars}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-16 px-4 bg-sb-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-sb-dark text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="bg-white rounded-card shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="w-8 h-8 rounded-full bg-sb-green text-white font-black flex items-center justify-center text-sm mx-auto mb-3">{step.step}</div>
                <h3 className="font-black text-sb-dark text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier System */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-sb-dark text-center mb-4">Member Tiers</h2>
          <p className="text-center text-gray-500 mb-10">Earn more Stars to unlock exclusive perks at each level.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[20px] border-2 border-sb-green p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-black text-sb-green mb-2">🟢 Green Level</h3>
              <p className="text-gray-600 text-sm mb-4">Join Rewards for free and start earning immediately. Unlock rewards at 25, 50, and 150 Stars.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Free birthday reward</li>
                <li>✓ Member-exclusive offers</li>
                <li>✓ Free in-store refills</li>
                <li>✓ Order ahead with the app</li>
              </ul>
            </div>
            <div className="rounded-[20px] border-2 border-sb-gold bg-gradient-to-br from-[#fffbf0] to-[#fff8e1] p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-black text-sb-gold mb-2">⭐ Gold Level</h3>
              <p className="text-gray-600 text-sm mb-4">Reach 300 Stars in a year to earn Gold Status and unlock the best rewards at 200 and 400 Stars.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ All Green Level perks</li>
                <li>✓ Personalized Gold Card</li>
                <li>✓ Gold-exclusive monthly offers</li>
                <li>✓ Double Star Days</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Catalog */}
      <section className="py-16 px-4 bg-sb-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-sb-dark text-center mb-4">Rewards Catalog</h2>
          <p className="text-center text-gray-500 mb-10">Use your Stars to unlock these amazing rewards.</p>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-sb-light -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
              {tiers.map((tier) => (
                <div key={tier.stars} className="bg-white rounded-card shadow-md p-4 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img src={tier.image} alt={tier.reward} className="w-full h-24 object-cover rounded-xl mb-3" />
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-pill text-xs font-black mb-2 ${tier.stars === 400 ? 'bg-sb-gold text-white' : 'bg-sb-dark text-white'}`}>
                    ⭐ {tier.stars}
                  </div>
                  <p className="text-sb-dark font-bold text-xs">{tier.reward}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
