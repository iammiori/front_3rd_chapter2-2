import { CartItem, Coupon, Discount } from '../../../types';

const findDiscountRate = (discounts: Discount[], quantity: number) => {
  return (
    discounts.find((discount) => discount.quantity === quantity)?.rate ?? 0
  );
};

const applyDiscount = (price: number, discountRate: number) => {
  return price * (1 - discountRate);
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discountRate = findDiscountRate(product.discounts, quantity);
  return applyDiscount(product.price, discountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  return 0;
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
