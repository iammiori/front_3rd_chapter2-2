import { CartItem, Coupon } from '../../types';

type CartTotal = {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  return discounts.length === 0
    ? 0
    : Math.max(
        ...discounts
          .filter((discount) => discount.quantity <= item.quantity)
          .map((discount) => discount.rate),
        0
      );
};

const calculateDiscountedPrice = (price: number, discountRate: number) =>
  price * (1 - discountRate);

export const calculateItemTotal = (item: CartItem) => {
  const basePrice = item.product.price * item.quantity;
  const discountRate = getMaxApplicableDiscount(item);
  return calculateDiscountedPrice(basePrice, discountRate);
};

const calculateCouponDiscount = (total: number, coupon: Coupon) => {
  if (!coupon) {
    return total;
  }

  return coupon.discountType === 'amount'
    ? total - coupon.discountValue
    : calculateDiscountedPrice(total, coupon.discountValue / 100);
};

const calculateBaseCartTotal = (items: CartItem[]) => {
  const totalBeforeDiscount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalAfterDiscount = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount
  } as CartTotal;
};

export const calculateCartTotal = (
  items: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const baseTotal = calculateBaseCartTotal(items);

  if (!selectedCoupon) {
    return baseTotal;
  }

  const finalTotal = calculateCouponDiscount(
    baseTotal.totalAfterDiscount,
    selectedCoupon
  );

  return {
    ...baseTotal,
    totalAfterDiscount: finalTotal,
    totalDiscount: baseTotal.totalBeforeDiscount - finalTotal
  } as CartTotal;
};

export const updateCartItemQuantity = (
  items: CartItem[],
  productId: string,
  newQuantity: number
) => {
  if (newQuantity === 0) {
    return items.filter((item) => item.product.id !== productId);
  }

  return items.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
      : item
  );
};
