import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique item id based on product+size+color
  productId: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  color: string;
  size: string;
  quantity: number;
  imageUrl?: string | null;
}

export interface AppliedCoupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  total: number;
}

const CART_STORAGE_KEY = "tester_cart_items";
const COUPON_STORAGE_KEY = "tester_cart_coupon";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    // Default demo cart with 1 initial product so the cart drawer & flow are immediately testable
    return [
      {
        id: "tailored-linen-shirt-ecru-M",
        productId: "tailored-linen-shirt",
        slug: "tailored-linen-shirt",
        title: "Tailored Linen Shirt",
        price: 4999,
        compareAtPrice: 5999,
        color: "Ecru",
        size: "M",
        quantity: 1,
        imageUrl: null,
      },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return null;
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    }
  }, [appliedCoupon]);

  const addItem = (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => {
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const itemId = `${item.productId}-${item.color}-${item.size}`.toLowerCase().replace(/\s+/g, "-");

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, id: itemId, quantity: qty }];
    });

    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const freeShippingThreshold = 5000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 490;

  // Coupon evaluation
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, subtotal)
    : 0;

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      const coupon: AppliedCoupon = {
        code: "WELCOME10",
        type: "percent",
        value: 10,
        discountAmount: Math.round((subtotal * 10) / 100),
      };
      setAppliedCoupon(coupon);
      return { success: true, message: "Coupon WELCOME10 applied (10% off)!" };
    }
    if (code === "TESTER500") {
      if (subtotal < 3000) {
        return { success: false, message: "Minimum spend of ₹3,000 required for TESTER500." };
      }
      const coupon: AppliedCoupon = {
        code: "TESTER500",
        type: "fixed",
        value: 500,
        discountAmount: 500,
      };
      setAppliedCoupon(coupon);
      return { success: true, message: "Coupon TESTER500 applied (₹500 off)!" };
    }
    return { success: false, message: "Invalid promo code. Try WELCOME10 or TESTER500." };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        setIsCartDrawerOpen,
        itemCount,
        subtotal,
        shippingFee,
        freeShippingThreshold,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
