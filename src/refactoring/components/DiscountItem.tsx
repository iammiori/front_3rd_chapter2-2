import { getPercentValue } from '../utils/price';

type Props = {
  quantity: number;
  rate: number;
  onRemove?: () => void;
  showRemoveButton?: boolean;
};

export default function DiscountItem({
  quantity,
  rate,
  onRemove,
  showRemoveButton = true
}: Props) {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {quantity}개 이상 구매 시 {getPercentValue(rate)}% 할인
      </span>
      {showRemoveButton && onRemove && (
        <button
          onClick={onRemove}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      )}
    </div>
  );
}
