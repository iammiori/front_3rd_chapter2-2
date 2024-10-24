import { useState } from 'react';
import { Coupon, Product } from '../../types.ts';
import { useCoupon } from '../hooks/useCoupon.admin.ts';
import { useProductForm } from '../hooks/useProductForm.admin.ts';
import { useProduct } from '../hooks/userProduct.admin.ts';
import { AdminLayout } from '../layout/index.tsx';
import { formatCurrency } from '../utils/price.ts';
import ProductEditor from './ProductEditor.tsx';
import { ProductForm } from './ProductForm.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd
}: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const { newProduct, updateNewProduct, resetNewProductForm } =
    useProductForm();

  const {
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
  } = useProduct(products, onProductUpdate);

  const {
    newCoupon,
    updateField: updateNewCoupon,
    handleAddCoupon
  } = useCoupon(onCouponAdd);

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    resetNewProductForm();
    setShowNewProductForm(false);
  };

  return (
    <AdminLayout>
      <AdminLayout.Header>
        <AdminLayout.Title>관리자 페이지</AdminLayout.Title>
      </AdminLayout.Header>
      <AdminLayout.Content>
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && (
            <ProductForm>
              <ProductForm.Field>
                <ProductForm.Label htmlFor="productName">
                  상품명
                </ProductForm.Label>

                <input
                  id="productName"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => updateNewProduct('name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </ProductForm.Field>

              <ProductForm.Field>
                <ProductForm.Label htmlFor="productPrice">
                  가격
                </ProductForm.Label>

                <input
                  id="productPrice"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    updateNewProduct('price', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </ProductForm.Field>

              <ProductForm.Field>
                <ProductForm.Label htmlFor="productStock">
                  재고
                </ProductForm.Label>

                <input
                  id="productStock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    updateNewProduct('stock', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </ProductForm.Field>

              <button
                onClick={handleAddNewProduct}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
            </ProductForm>
          )}
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-${index + 1}`}
                className="bg-white p-4 rounded shadow"
              >
                <button
                  data-testid="toggle-button"
                  onClick={() => toggleProductAccordion(product.id)}
                  className="w-full text-left font-semibold"
                >
                  {product.name} - {formatCurrency(product.price, '원')} (재고:{' '}
                  {product.stock})
                </button>
                {openProductIds.has(product.id) && (
                  <div className="mt-2">
                    <ProductEditor
                      product={product}
                      editingProduct={editingProduct}
                      updateEditingProduct={updateEditingProduct}
                      handleRemoveDiscount={handleRemoveDiscount}
                      handleAddDiscount={handleAddDiscount}
                      handleEditComplete={handleEditComplete}
                      handleEditProduct={handleEditProduct}
                      newDiscount={newDiscount}
                      setNewDiscount={setNewDiscount}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={newCoupon.name}
                onChange={(e) => updateNewCoupon('name', e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="쿠폰 코드"
                value={newCoupon.code}
                onChange={(e) => updateNewCoupon('code', e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    updateNewCoupon(
                      'discountType',
                      e.target.value as 'amount' | 'percentage'
                    )
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="amount">금액(원)</option>
                  <option value="percentage">할인율(%)</option>
                </select>
                <input
                  type="number"
                  placeholder="할인 값"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    updateNewCoupon('discountValue', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddCoupon}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                쿠폰 추가
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => (
                  <div
                    key={index}
                    data-testid={`coupon-${index + 1}`}
                    className="bg-gray-100 p-2 rounded"
                  >
                    {coupon.name} ({coupon.code}):
                    {coupon.discountType === 'amount'
                      ? formatCurrency(coupon.discountValue, '원')
                      : `${coupon.discountValue}%`}{' '}
                    할인
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout.Content>
    </AdminLayout>
  );
};
