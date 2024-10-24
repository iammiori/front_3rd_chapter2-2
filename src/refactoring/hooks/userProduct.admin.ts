import { useState } from 'react';
import { Discount, Product } from '../../types';

const getOpenProductIdSet = (
  openProductIds: Set<string>,
  productId: string
) => {
  const newSet = new Set(openProductIds);
  if (newSet.has(productId)) {
    newSet.delete(productId);
  } else {
    newSet.add(productId);
  }
  return newSet;
};

const createUpdatedProduct = (
  product: Product,
  updates: Partial<Omit<Product, 'id'>>
) => ({
  ...product,
  ...updates
});

const addDiscountToProduct = (product: Product, discount: Discount) => ({
  ...product,
  discounts: [...product.discounts, discount]
});

const deleteDiscountFromProduct = (product: Product, index: number) => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index)
});

export const useProduct = (
  initialProducts: Product[],
  onProductUpdate: (product: Product) => void
) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0
  });

  const toggleProductAccordion = (productId: string) =>
    setOpenProductIds((prev) => getOpenProductIdSet(prev, productId));

  const handleEditProduct = (product: Product) =>
    setEditingProduct({ ...product });

  const updateEditingProduct = (field: keyof Product, value: any) => {
    if (!editingProduct) {
      return;
    }

    const updatedProduct = createUpdatedProduct(editingProduct, {
      [field]: value
    });
    setEditingProduct(updatedProduct);
  };

  const handleEditComplete = () => {
    if (!editingProduct) {
      return;
    }

    onProductUpdate(editingProduct);
    setEditingProduct(null);
  };

  const handleAddDiscount = (productId: string) => {
    const selectedProduct = initialProducts.find((p) => p.id === productId);
    if (!selectedProduct) {
      return;
    }

    const updatedProduct = addDiscountToProduct(selectedProduct, newDiscount);
    onProductUpdate(updatedProduct);
    setEditingProduct(updatedProduct);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const selectedProduct = initialProducts.find((p) => p.id === productId);
    if (!selectedProduct) {
      return;
    }

    const newProduct = deleteDiscountFromProduct(selectedProduct, index);
    onProductUpdate(newProduct);
    setEditingProduct(newProduct);
  };

  return {
    openProductIds,
    editingProduct,
    newDiscount,
    setNewDiscount,
    toggleProductAccordion,
    handleEditProduct,
    updateEditingProduct,
    handleEditComplete,
    handleAddDiscount,
    handleRemoveDiscount
  };
};
