import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuItems } from '../data/menuItems';
import DrinkCard from '../components/DrinkCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [isNew, setIsNew] = useState([]);

  useEffect(() => {
    setFeatured(menuItems.filter((i) => i.isFeatured));
    setIsNew(menuItems.filter((i) => i.isNew).slice(0, 3));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[560px] flex items-center justify-start overflow-hidden bg-sb-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-sb-dark via-sb-dark/80 to-transparent z-10" />
        <img
          src="https://placehold.co/1920x900/1E3932/D4E9E2?text=Summer+Collection+2024"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-sb-gold font-bold text-sm tracking-widest uppercase mb-3">Summer Collection</p>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-4 max-w-xl">
            Refresh<br />Your Day
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">Discover our new summer drinks crafted to keep you cool and energized all season long.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/menu" className="bg-sb-green hover:bg-emerald-600 text-white font-bold text-base px-8 py-4 rounded-pill transition-all hover:scale-105 shadow-lg">
              Order Now
            </Link>
            <Link to="/rewards" className="border-2 border-white text-white hover:bg-white hover:text-sb-dark font-bold text-base px-8 py-4 rounded-pill transition-all">
              Join Rewards
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Drinks - horizontal scroll */}
      <section className="bg-sb-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-sb-dark">Featured Drinks</h2>
            <Link to="/menu" className="text-sb-green font-bold hover:underline text-sm">See all →</Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featured.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-64 snap-start">
                <DrinkCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's New */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-sb-dark mb-8">What's New</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isNew.map((item) => (
              <DrinkCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Rewards CTA */}
      <section className="py-16 bg-gradient-to-r from-sb-dark via-[#155835] to-sb-green relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-5 text-[300px] font-black text-white">★</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <span className="text-sb-gold text-5xl block mb-4 animate-bounce">★</span>
          <h2 className="text-4xl font-black text-white mb-3">Join Starbucks Rewards</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">Earn Stars, unlock free drinks, and get exclusive member offers. It's free to join.</p>
          <Link to="/rewards" className="inline-block bg-sb-gold hover:brightness-110 text-white font-black text-base px-10 py-4 rounded-pill transition-all hover:scale-105 shadow-xl">
            Join Starbucks Rewards
          </Link>
        </div>
      </section>

      {/* Seasonal Promotion */}
      <section className="bg-sb-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-sb-green font-bold text-sm tracking-widest uppercase mb-2">Limited Time</p>
            <h2 className="text-4xl font-black text-sb-dark mb-4 leading-tight">Summer Sips Are Here</h2>
            <p className="text-gray-600 text-base mb-6 max-w-md">Beat the heat with our refreshing new summer lineup — from dragonfruit refreshers to cold brew specials, every sip is a vacation.</p>
            <Link to="/menu?category=cold" className="inline-block bg-sb-green text-white font-bold px-8 py-3 rounded-pill hover:bg-sb-dark transition">
              Explore Summer Drinks
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {menuItems.filter((i) => i.category === 'cold').slice(0, 4).map((item) => (
              <img key={item.id} src={item.image} alt={item.name} className="rounded-card shadow-md w-full h-36 object-cover hover:scale-105 transition-transform" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
