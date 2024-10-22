import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from './utils/cartUtils';

type CartItems = CartItem[];
type CouponState = Coupon | null;

const isProductInCart = (cartItems: CartItems, product: Product) =>
  cartItems.some((item) => item.product.id === product.id);

const getAvailableStock = (cartItems: CartItems, product: Product) => {
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  return cartItem ? product.stock - cartItem.quantity : product.stock;
};

const createCartItem = (product: Product) => ({
  product,
  quantity: 1
});

const incrementProductQuantity = (cartItems: CartItems, product: Product) =>
  cartItems.map((item) =>
    item.product.id === product.id
      ? {
          ...item,
          quantity: Math.max(0, Math.min(item.quantity + 1, product.stock))
        }
      : item
  );

export const useCart = () => {
  const [cart, setCart] = useState<CartItems>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponState>(null);

  const addToCart = (product: Product) => {
    const availableStock = getAvailableStock(cart, product);

    if (availableStock <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    setCart((prevCart) =>
      isProductInCart(prevCart, product)
        ? incrementProductQuantity(prevCart, product)
        : [...prevCart, createCartItem(product)]
    );
  };

  const removeFromCart = (productId: string) =>
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );

  const updateQuantity = (productId: string, newQuantity: number) =>
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );

  const applyCoupon = (coupon: Coupon) => setSelectedCoupon(coupon);

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  return {
    cart,
    selectedCoupon,

    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,

    calculateTotal
  };
};
