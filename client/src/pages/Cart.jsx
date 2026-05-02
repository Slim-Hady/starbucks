import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Cart() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const TAX_RATE = 0.08;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const orderItems = items.map(item => ({
        product: item._id || item.id,
        size: item.size || 'Grande',
        quantity: item.quantity,
        price: item.unitPrice,
      }));
      
      await api.createOrder({
        items: orderItems,
        totalPrice: total,
      });
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-sb-cream flex items-center justify-center px-4">
        <div className="text-center fade-in">
          <div className="text-9xl mb-6">🛒</div>
          <h2 className="text-3xl font-black text-sb-dark mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Browse our menu and add some drinks or food to get started!</p>
          <Link to="/menu" className="inline-block bg-sb-green hover:bg-sb-dark text-white font-bold px-8 py-4 rounded-pill transition">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sb-cream py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-sb-dark mb-8">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.key} className="bg-white rounded-card shadow-md flex gap-4 p-4 hover:shadow-lg transition">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sb-dark text-base">{item.name}</h3>
                  <p className="font-black text-sb-green whitespace-nowrap">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
                <p className="text-gray-500 text-xs mt-0.5 capitalize">{item.size} · {item.milk} · {item.sweetness} sweetness · {item.ice} ice</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 bg-sb-cream rounded-pill px-3 py-1.5">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="font-bold text-sb-dark">−</button>
                    <span className="font-bold text-sb-dark w-5 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="font-bold text-sb-dark">+</button>
                  </div>
                  <button onClick={() => removeItem(item.key)} className="text-red-400 hover:text-red-600 text-xs font-semibold transition">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[20px] shadow-lg p-6">
          <h2 className="text-xl font-black text-sb-dark mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-between text-lg font-black text-sb-dark border-t pt-4 mb-6">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full bg-sb-green hover:bg-sb-dark text-white font-black py-4 rounded-pill text-base transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          <button onClick={clearCart} className="w-full text-gray-400 hover:text-red-500 text-sm transition">Clear cart</button>
        </div>

        <div className="text-center mt-6">
          <Link to="/menu" className="text-sb-green font-bold hover:underline text-sm">← Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
