import { Discount } from '../../types';

type Props = {
  newDiscount: Discount;
  setNewDiscount: (discount: Discount) => void;
  onAdd: () => void;
};

export default function DiscountForm({
  newDiscount,
  setNewDiscount,
  onAdd
}: Props) {
  return (
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
        onClick={onAdd}
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </button>
    </div>
  );
}
