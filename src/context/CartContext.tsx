'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Log when provider mounts
  console.log('🛒 CartProvider mounted');

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('🛒 useEffect running - loading from localStorage');
    setMounted(true);
    
    try {
      const savedCart = localStorage.getItem('handcrafted-cart');
      console.log('🛒 Raw localStorage data:', savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('🛒 Parsed cart data:', parsedCart);
        setItems(parsedCart);
      } else {
        console.log('🛒 No saved cart found');
      }
    } catch (error) {
      console.error('🛒 Failed to parse cart:', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted && initialized) {
      console.log('🛒 Saving to localStorage:', items);
      localStorage.setItem('handcrafted-cart', JSON.stringify(items));
    }
  }, [items, mounted, initialized]);

  const addItem = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    console.log('🛒 Adding item to cart:', { product, quantity });
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        console.log('🛒 Item exists, updating quantity');
        const updatedItems = prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
        console.log('🛒 Updated items:', updatedItems);
        return updatedItems;
      } else {
        console.log('🛒 Adding new item');
        const newItem = { ...product, quantity: Math.min(quantity, product.stock) };
        const updatedItems = [...prevItems, newItem];
        console.log('🛒 New items:', updatedItems);
        return updatedItems;
      }
    });
  };

  const removeItem = (id: string) => {
    console.log('🛒 Removing item:', id);
    setItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('🛒 Updating quantity:', { id, quantity });
    setItems(prevItems =>
      prevItems.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('🛒 Clearing cart');
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log('🛒 Current state:', { items, totalItems, totalPrice, mounted, initialized });

  // Don't render children until after hydration
  if (!mounted || !initialized) {
    console.log('🛒 Provider not ready, showing null');
    return null;
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}