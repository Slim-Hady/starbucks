import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const TAX_RATE = 0.08;
  const tax = cartTotal * TAX_RATE;
  const total = cartTotal + tax;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sb-dark text-white">
          <h2 className="text-xl font-bold">Your Cart {items.length > 0 && <span className="text-sb-gold">({items.length})</span>}</h2>
          <button onClick={() => setIsOpen(false)} className="text-2xl hover:text-sb-gold transition" aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="text-8xl">🛒</span>
            <h3 className="text-xl font-bold text-sb-black">Your cart is empty</h3>
            <p className="text-gray-500">Add some delicious drinks to get started!</p>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="bg-sb-green text-white font-bold px-6 py-3 rounded-pill hover:bg-sb-dark transition mt-2">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 bg-sb-cream rounded-card p-3 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sb-black text-sm truncate">{item.name}</h4>
                    <p className="text-gray-500 text-xs capitalize">{item.size} · {item.milk}</p>
                    <p className="text-sb-green font-bold text-sm mt-1">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-sb-light font-bold text-sb-dark flex items-center justify-center transition">−</button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-sb-light font-bold text-sb-dark flex items-center justify-center transition">+</button>
                      <button onClick={() => removeItem(item.key)} className="ml-auto text-red-400 hover:text-red-600 text-xs font-semibold transition">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-6 bg-white space-y-3">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-sb-black text-lg border-t pt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <button className="w-full bg-sb-green hover:bg-sb-dark text-white font-bold py-4 rounded-pill transition-colors text-base mt-2">
                Proceed to Checkout
              </button>
              <button onClick={clearCart} className="w-full text-gray-400 hover:text-red-500 text-sm transition">Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
