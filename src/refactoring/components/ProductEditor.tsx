import { Discount, Product } from '../../types';
import DiscountForm from './DiscountForm';
import DiscountItem from './DiscountItem';

type Props = {
  product: Product;
  editingProduct: Product | null;
  updateEditingProduct: (field: keyof Product, value: any) => void;
  handleRemoveDiscount: (productId: string, index: number) => void;
  handleAddDiscount: (productId: string) => void;
  handleEditComplete: () => void;
  handleEditProduct: (product: Product) => void;
  newDiscount: Discount;
  setNewDiscount: (discount: Discount) => void;
};

export default function ProductEditor({
  product,
  editingProduct,
  updateEditingProduct,
  handleRemoveDiscount,
  handleAddDiscount,
  handleEditComplete,
  handleEditProduct,
  newDiscount,
  setNewDiscount
}: Props) {
  if (!editingProduct || editingProduct.id !== product.id) {
    return (
      <div>
        {product.discounts.map((discount, index) => (
          <DiscountItem
            key={index}
            quantity={discount.quantity}
            rate={discount.rate}
            showRemoveButton={false}
          />
        ))}
        <button
          data-testid="modify-button"
          onClick={() => handleEditProduct(product)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
        >
          수정
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => updateEditingProduct('name', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) =>
            updateEditingProduct('price', parseInt(e.target.value))
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
            updateEditingProduct('stock', parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        {editingProduct.discounts.map((discount, index) => (
          <DiscountItem
            key={index}
            quantity={discount.quantity}
            rate={discount.rate}
            onRemove={() => handleRemoveDiscount(product.id, index)}
          />
        ))}

        <DiscountForm
          newDiscount={newDiscount}
          setNewDiscount={setNewDiscount}
          onAdd={() => handleAddDiscount(product.id)}
        />
      </div>

      <button
        onClick={handleEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
}
