import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, options = {}) => {
    setItems((prev) => {
      const key = `${product.id}-${options.size || 'grande'}-${options.milk || 'whole'}-${options.sweetness || 'standard'}-${options.ice || 'standard'}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + (options.quantity || 1) } : i);
      }
      return [...prev, { ...product, key, quantity: options.quantity || 1, size: options.size || 'grande', milk: options.milk || 'Whole Milk', sweetness: options.sweetness || 'Standard', ice: options.ice || 'Standard', unitPrice: options.unitPrice || product.price }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => i.key === key ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartTotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}
