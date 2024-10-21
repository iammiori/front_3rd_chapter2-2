import { useState } from 'react';
import { Product } from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>([...initialProducts]);

  const updateProducts = (
    products: Product[],
    updateProduct: Product
  ): Product[] => {
    return products.map((product) =>
      product.id === updateProduct.id ? updateProduct : product
    );
  };

  const addProductToList = (
    products: Product[],
    newProduct: Product
  ): Product[] => {
    return [...products, newProduct];
  };

  const updateProduct = (updateProduct: Product) => {
    setProducts((prev) => updateProducts(prev, updateProduct));
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => addProductToList(prev, newProduct));
  };
  return {
    products,
    updateProduct,
    addProduct
  };
};
