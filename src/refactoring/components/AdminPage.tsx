import { useState } from 'react';
import { Coupon, Product } from '../../types.ts';
import { useCoupon } from '../hooks/useCoupon.admin.ts';
import { useProductForm } from '../hooks/useProductForm.admin.ts';
import { useProduct } from '../hooks/userProduct.admin.ts';

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          {showNewProductForm && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
              <div className="mb-2">
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  상품명
                </label>
                <input
                  id="productName"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => updateNewProduct('name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="productPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  가격
                </label>
                <input
                  id="productPrice"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    updateNewProduct('price', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="productStock"
                  className="block text-sm font-medium text-gray-700"
                >
                  재고
                </label>
                <input
                  id="productStock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    updateNewProduct('stock', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleAddNewProduct}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
            </div>
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
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>
                {openProductIds.has(product.id) && (
                  <div className="mt-2">
                    {editingProduct && editingProduct.id === product.id ? (
                      <div>
                        <div className="mb-4">
                          <label className="block mb-1">상품명: </label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                              updateEditingProduct('name', e.target.value)
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1">가격: </label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              updateEditingProduct(
                                'price',
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1">재고: </label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              updateEditingProduct(
                                'stock',
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            할인 정보
                          </h4>
                          {editingProduct.discounts.map((discount, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center mb-2"
                            >
                              <span>
                                {discount.quantity}개 이상 구매 시{' '}
                                {discount.rate * 100}% 할인
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveDiscount(product.id, index)
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="수량"
                              value={newDiscount.quantity}
                              onChange={(e) =>
                                setNewDiscount({
                                  ...newDiscount,
                                  quantity: parseInt(e.target.value)
                                })
                              }
                              className="w-1/3 p-2 border rounded"
                            />
                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={newDiscount.rate * 100}
                              onChange={(e) =>
                                setNewDiscount({
                                  ...newDiscount,
                                  rate: parseInt(e.target.value) / 100
                                })
                              }
                              className="w-1/3 p-2 border rounded"
                            />
                            <button
                              onClick={() => handleAddDiscount(product.id)}
                              className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                              할인 추가
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleEditComplete}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                        >
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시{' '}
                              {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          data-testid="modify-button"
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                        >
                          수정
                        </button>
                      </div>
                    )}
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
                      ? `${coupon.discountValue}원`
                      : `${coupon.discountValue}%`}{' '}
                    할인
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
