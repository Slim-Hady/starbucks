import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuItems } from '../data/menuItems';
import { useCart } from '../hooks/useCart';
import DrinkCard from '../components/DrinkCard';

const SIZE_PRICES = { tall: -0.5, grande: 0, venti: 0.5 };
const MILK_OPTIONS = ['Whole Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk', 'Coconut Milk'];
const SWEETNESS = ['No Sugar', 'Light', 'Standard', 'Extra Sweet'];
const ICE_LEVELS = ['No Ice', 'Light Ice', 'Standard', 'Extra Ice'];

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState('grande');
  const [milk, setMilk] = useState('Whole Milk');
  const [sweetness, setSweetness] = useState('Standard');
  const [ice, setIce] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const found = menuItems.find((i) => i.id === parseInt(id));
    setProduct(found || null);
    if (found) {
      setRelated(menuItems.filter((i) => i.category === found.category && i.id !== found.id).slice(0, 3));
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center"><p className="text-2xl font-bold text-gray-400">Product not found.</p>
        <Link to="/menu" className="text-sb-green font-bold mt-4 block">← Back to Menu</Link></div>
      </div>
    );
  }

  const unitPrice = product.price + SIZE_PRICES[size];
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    addItem(product, { size, milk, sweetness, ice, quantity, unitPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-sb-cream pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <Link to="/menu" className="inline-flex items-center gap-1 text-sb-green font-bold mb-6 hover:underline text-sm">← Back to Menu</Link>

        <div className="bg-white rounded-[20px] shadow-xl overflow-hidden md:flex">
          <div className="md:w-1/2">
            <img src={product.image} alt={product.name} className="w-full h-80 md:h-full object-cover" />
          </div>

          <div className="md:w-1/2 p-6 sm:p-10 flex flex-col">
            {product.isNew && <span className="bg-sb-gold text-white text-xs font-bold px-3 py-1 rounded-pill self-start mb-3">NEW</span>}
            <h1 className="text-3xl font-black text-sb-dark mb-2">{product.name}</h1>
            <p className="text-gray-500 text-sm mb-1">{product.calories} calories · {product.category}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Size */}
            <div className="mb-5">
              <label className="block text-sb-dark font-bold text-sm mb-2">Size</label>
              <div className="flex gap-2">
                {Object.entries(SIZE_PRICES).map(([s, diff]) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-pill border-2 text-sm font-bold capitalize transition ${size === s ? 'border-sb-green bg-sb-green text-white' : 'border-gray-200 text-gray-600 hover:border-sb-green'}`}
                  >
                    {s}<br/><span className="text-xs font-normal">{diff === 0 ? 'Base' : diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Milk */}
            <div className="mb-5">
              <label className="block text-sb-dark font-bold text-sm mb-2">Milk Type</label>
              <select value={milk} onChange={(e) => setMilk(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sb-green">
                {MILK_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Sweetness */}
            <div className="mb-5">
              <label className="block text-sb-dark font-bold text-sm mb-2">Sweetness</label>
              <div className="flex gap-2 flex-wrap">
                {SWEETNESS.map((s) => (
                  <button key={s} onClick={() => setSweetness(s)} className={`px-3 py-1.5 rounded-pill border-2 text-xs font-bold transition ${sweetness === s ? 'border-sb-green bg-sb-green text-white' : 'border-gray-200 text-gray-600 hover:border-sb-green'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Ice */}
            <div className="mb-6">
              <label className="block text-sb-dark font-bold text-sm mb-2">Ice Level</label>
              <div className="flex gap-2 flex-wrap">
                {ICE_LEVELS.map((i) => (
                  <button key={i} onClick={() => setIce(i)} className={`px-3 py-1.5 rounded-pill border-2 text-xs font-bold transition ${ice === i ? 'border-sb-green bg-sb-green text-white' : 'border-gray-200 text-gray-600 hover:border-sb-green'}`}>{i}</button>
                ))}
              </div>
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center gap-3 bg-sb-cream rounded-pill px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="font-bold text-sb-dark w-6 text-center">−</button>
                <span className="font-bold text-sb-dark w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="font-bold text-sb-dark w-6 text-center">+</button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 font-black text-base py-3 rounded-pill transition-all ${added ? 'bg-emerald-600 text-white scale-95' : 'bg-sb-green hover:bg-sb-dark text-white hover:scale-105 shadow-md'}`}
              >
                {added ? '✓ Added!' : `Add to Cart · $${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-black text-sb-dark mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => <DrinkCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
