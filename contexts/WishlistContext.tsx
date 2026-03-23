/*"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  vendorId: string;
  shopId: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    // Save wishlist to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems(prevItems => {
      if (prevItems.find(item => item._id === product._id)) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};*/

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  vendorId: string;
  shopId: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

const WISHLIST_STORAGE_KEY = 'shaddyna_wishlist';

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const loadWishlist = () => {
      try {
        if (typeof window === 'undefined') return;
        
        const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (savedWishlist) {
          const parsed = JSON.parse(savedWishlist);
          // Validate that it's an array
          if (Array.isArray(parsed)) {
            setWishlistItems(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadWishlist();
  }, []);

  // Save to localStorage whenever wishlistItems changes (but only after initial load)
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
      // Dispatch custom event for cross-tab synchronization
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { items: wishlistItems } 
      }));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems, isInitialized]);

  // Listen for changes from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setWishlistItems(parsed);
          }
        } catch (error) {
          console.error('Error parsing wishlist from storage event:', error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent<{ items: WishlistItem[] }>) => {
      if (e.detail?.items) {
        setWishlistItems(e.detail.items);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated' as any, handleCustomEvent);
    };
  }, []);

  const addToWishlist = useCallback((product: WishlistItem) => {
    setWishlistItems(prevItems => {
      // Check if already exists
      if (prevItems.some(item => item._id === product._id)) {
        console.log('Product already in wishlist:', product._id);
        return prevItems;
      }
      
      const newItems = [...prevItems, {
        ...product,
        // Ensure all required fields are present
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || '/placeholder-image.jpg',
        vendorId: product.vendorId,
        shopId: product.shopId
      }];
      
      console.log('Added to wishlist:', product.name, 'Total items:', newItems.length);
      return newItems;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item._id !== productId);
      console.log('Removed from wishlist:', productId, 'Total items:', newItems.length);
      return newItems;
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    console.log('Wishlist cleared');
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};