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

  return applicableDiscounts.reduce(
    (maxRate, { rate }) => Math.max(maxRate, rate),
    0
  );
};

const applyDiscount = (price: number, discountRate: number) => {
  return price * (1 - discountRate);
};

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const discountRate = getMaxApplicableDiscount(item);
  return applyDiscount(product.price * quantity, discountRate);
};

const applyCouponDiscount = (total: number, coupon: Coupon) => {
  const { discountType } = coupon;
  switch (discountType) {
    case 'amount':
      return total - coupon.discountValue;
    case 'percentage':
      return applyDiscount(total, coupon.discountValue / 100);
    default:
      return total;
  }
};

const calculateCartTotalWithoutCoupon = (carts: CartItem[]) => {
  return carts.reduce(
    (total, item) => {
      const itemTotal = calculateItemTotal(item);
      total.totalBeforeDiscount += item.product.price * item.quantity;
      total.totalAfterDiscount += itemTotal;
      total.totalDiscount =
        total.totalBeforeDiscount - total.totalAfterDiscount;
      return total;
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0, totalDiscount: 0 }
  );
};

export const calculateCartTotal = (
  carts: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const total = calculateCartTotalWithoutCoupon(carts);

  if (!selectedCoupon) {
    return total;
  }

  const discountedTotal = applyCouponDiscount(
    total.totalAfterDiscount,
    selectedCoupon
  );
  total.totalDiscount = total.totalBeforeDiscount - discountedTotal;
  total.totalAfterDiscount = discountedTotal;

  return total;
};

const updateItemQuantity = (item: CartItem, newQuantity: number) => ({
  ...item,
  quantity: Math.min(newQuantity, item.product.stock)
});

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  const shouldRemove = newQuantity === 0;
  const updateItem = (item: CartItem) =>
    item.product.id === productId
      ? updateItemQuantity(item, newQuantity)
      : item;

  return shouldRemove
    ? cart.filter((item) => item.product.id !== productId)
    : cart.map(updateItem);
};
