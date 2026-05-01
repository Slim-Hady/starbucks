import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuItems } from '../data/menuItems';
import { categories } from '../data/categories';
import DrinkCard from '../components/DrinkCard';
import SearchBar from '../components/SearchBar';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      let filtered = menuItems;
      if (activeCategory !== 'all') filtered = filtered.filter((i) => i.category === activeCategory);
      if (query) filtered = filtered.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()));
      setItems(filtered);
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [activeCategory, query]);

  const handleCategory = (id) => setActiveCategory(id);

  return (
    <main className="min-h-screen bg-sb-cream">
      {/* Page header */}
      <div className="bg-sb-dark text-white py-12 px-4 sm:px-6 text-center">
        <h1 className="text-4xl font-black mb-2">Our Menu</h1>
        <p className="text-gray-300 text-base">Find your perfect drink or bite</p>
      </div>

      {/* Sticky filter + search */}
      <div className="sticky top-16 z-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm font-bold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-sb-green text-white shadow-md scale-105'
                    : 'bg-sb-cream text-sb-dark hover:bg-sb-light'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64 ml-auto">
            <SearchBar onSearch={setQuery} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold">No items found</h3>
            <p className="text-sm mt-2">Try a different category or search term.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {items.map((item) => (
              <DrinkCard key={item.id} item={item} />
            ))}
          </div>
        )}
        <p className="text-center text-gray-400 text-sm mt-8">{items.length} item{items.length !== 1 ? 's' : ''} shown</p>
      </div>
    </main>
  );
}
