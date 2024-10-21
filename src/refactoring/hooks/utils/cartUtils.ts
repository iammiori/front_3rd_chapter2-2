import { CartItem, Coupon } from '../../../types';

export const getMaxApplicableDiscount = (item: CartItem) => {
  const {
    product: { discounts },
    quantity
  } = item;
  if (discounts.length === 0) {
    return 0;
  }

  const applicableDiscounts = discounts.filter(
    (discount) => discount.quantity === quantity
  );

  if (applicableDiscounts.length === 0) {
    return 0;
  }

  return discounts.reduce((maxRate, { rate }) => Math.max(maxRate, rate), 0);
};

const applyDiscount = (price: number, discountRate: number) => {
  return price * (1 - discountRate);
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discountRate = getMaxApplicableDiscount(item);
  return applyDiscount(product.price * quantity, discountRate);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return [];
};
