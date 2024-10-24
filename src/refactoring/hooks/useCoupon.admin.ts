import { useState } from 'react';
import { Coupon } from '../../types';

const initialCoupon: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0
};

const resetCoupon = () => initialCoupon;

export const useCoupon = (onCouponAdd: (coupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialCoupon);

  const updateField = (field: keyof Coupon, value: any) => {
    setNewCoupon((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon(resetCoupon());
  };

  return {
    newCoupon,
    updateField,
    handleAddCoupon
  };
};
