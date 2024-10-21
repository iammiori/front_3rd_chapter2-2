import { useState } from 'react';
import { Coupon } from '../../types.ts';

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>([...initialCoupons]);

  const addCouponToList = (coupons: Coupon[], newCoupon: Coupon): Coupon[] => {
    return [...coupons, newCoupon];
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => addCouponToList(prev, newCoupon));
  };
  return { coupons, addCoupon };
};
