import { useState } from 'react';
import { Product } from '../../types';

export const useProductForm = () => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: 'default-new', // todo: nanoid()
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  const updateNewProduct = (field: keyof Omit<Product, 'id'>, value: any) =>
    setNewProduct((prev) => ({ ...prev, [field]: value }));

  const resetNewProductForm = () =>
    setNewProduct({
      id: 'default-new',
      name: '',
      price: 0,
      stock: 0,
      discounts: []
    });

  return {
    newProduct,
    updateNewProduct,
    resetNewProductForm
  };
};
