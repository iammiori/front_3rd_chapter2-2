import { Discount } from '../../types';
import { getDiscountRate, getPercentValue } from '../utils/price';

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
        value={getPercentValue(newDiscount.rate)}
        onChange={(e) =>
          setNewDiscount({
            ...newDiscount,
            rate: getDiscountRate(parseInt(e.target.value))
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
