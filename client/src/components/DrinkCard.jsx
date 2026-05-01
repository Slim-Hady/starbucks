import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function DrinkCard({ item }) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-card shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      <Link to={`/menu/${item.id}`} className="relative block overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.isNew && (
          <span className="absolute top-3 left-3 bg-sb-gold text-white text-xs font-bold px-2 py-1 rounded-pill">NEW</span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow hover:scale-110 transition"
          aria-label="Favorite"
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sb-black text-base leading-snug mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm flex-1 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sb-green font-bold text-lg">${item.price.toFixed(2)}</span>
          <button
            onClick={() => addItem(item)}
            className="bg-sb-green hover:bg-sb-dark text-white text-sm font-bold px-4 py-2 rounded-pill transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
