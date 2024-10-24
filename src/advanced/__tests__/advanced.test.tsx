import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within
} from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { AdminPage } from '../../refactoring/components/AdminPage';
import { CartPage } from '../../refactoring/components/CartPage';
import { useCoupon } from '../../refactoring/hooks/useCoupon.admin';
import { useProductForm } from '../../refactoring/hooks/useProductForm.admin';
import { useProduct } from '../../refactoring/hooks/userProduct.admin';
import { cn } from '../../refactoring/libs/utils';
import * as priceUtils from '../../refactoring/utils/price';
import { Coupon, Product } from '../../types';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }]
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }]
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }]
  }
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' }
      });
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' }
      });
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' }
      });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15,000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' }
        });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' }
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' }
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12,000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' }
        });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' }
        });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인')
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' }
      });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' }
      });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' }
      });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });

    describe('useProductForm: 새로운 상품 추가 폼', () => {
      test('초기값이 없으면 기본값으로 초기화되어야 한다', () => {
        const { result } = renderHook(() => useProductForm());

        expect(result.current.newProduct).toEqual({
          id: 'default-new',
          name: '',
          price: 0,
          stock: 0,
          discounts: []
        });
      });

      test('필드를 올바르게 업데이트해야 한다', () => {
        const selectedProduct: Product = {
          id: 'default-new',
          name: '',
          price: 0,
          stock: 0,
          discounts: []
        };
        const { result } = renderHook(() => useProductForm());

        act(() => {
          result.current.updateNewProduct('name', 'Product 2');
        });

        expect(result.current.newProduct).toEqual({
          ...selectedProduct,
          name: 'Product 2'
        });
      });

      test('폼을 기본값으로 리셋해야 한다', () => {
        const { result } = renderHook(() => useProductForm());

        act(() => {
          result.current.updateNewProduct('name', 'Product 2');
        });

        expect(result.current.newProduct.name).toBe('Product 2');

        act(() => {
          result.current.resetNewProductForm();
        });

        expect(result.current.newProduct).toEqual({
          id: 'default-new',
          name: '',
          price: 0,
          stock: 0,
          discounts: []
        });
      });
    });

    describe('useProduct.admin 상품 관리 - 어드민', () => {
      const initialProducts: Product[] = [
        { id: '1', name: 'Product 1', price: 1000, stock: 100, discounts: [] },
        { id: '2', name: 'Product 2', price: 2000, stock: 200, discounts: [] }
      ];

      test('초기 상태를 확인한다', () => {
        const { result } = renderHook(() =>
          useProduct(initialProducts, () => {})
        );

        expect(result.current.openProductIds.size).toBe(0);
        expect(result.current.editingProduct).toBeNull();
        expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
      });

      test('토글을 위한 상품 id가 set에 설정이 된다', () => {
        const { result } = renderHook(() =>
          useProduct(initialProducts, () => {})
        );

        act(() => {
          result.current.toggleProductAccordion('1');
        });

        expect(result.current.openProductIds.has('1')).toBe(true);

        act(() => {
          result.current.toggleProductAccordion('1');
        });

        expect(result.current.openProductIds.has('1')).toBe(false);
      });

      test('수정할 상품을 선택할 수 있다.', () => {
        const { result } = renderHook(() =>
          useProduct(initialProducts, () => {})
        );

        act(() => {
          result.current.handleEditProduct(initialProducts[0]);
        });

        expect(result.current.editingProduct).toEqual(initialProducts[0]);
      });

      test('수정 중인 상품의 정보가 업데이트 된다', () => {
        const { result } = renderHook(() =>
          useProduct(initialProducts, () => {})
        );

        act(() => {
          result.current.handleEditProduct(initialProducts[0]);
        });

        act(() => {
          result.current.updateEditingProduct('name', 'Product 2');
        });

        expect(result.current.editingProduct).toEqual({
          ...initialProducts[0],
          name: 'Product 2'
        });
      });

      test('수정 완료 시 onProductUpdate 호출이 된다', () => {
        const onProductUpdate = vi.fn();
        const { result } = renderHook(() =>
          useProduct(initialProducts, onProductUpdate)
        );

        act(() => {
          result.current.handleEditProduct(initialProducts[0]);
        });

        act(() => {
          result.current.updateEditingProduct('name', 'Product 1');
          result.current.handleEditComplete();
        });

        expect(onProductUpdate).toHaveBeenCalledWith({
          ...initialProducts[0],
          name: 'Product 1'
        });
        expect(result.current.editingProduct).toBeNull();
      });
      test('상품에 할인을 추가 할 수 있다', () => {
        const onProductUpdate = vi.fn();
        const { result } = renderHook(() =>
          useProduct(initialProducts, onProductUpdate)
        );

        act(() => {
          result.current.handleEditProduct(initialProducts[0]); // 상품 편집
        });

        act(() => {
          result.current.setNewDiscount({ quantity: 5, rate: 10 });
        });

        act(() => {
          result.current.handleAddDiscount('1');
        });

        expect(onProductUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            id: '1',
            name: 'Product 1',
            price: 1000,
            stock: 100,
            discounts: expect.arrayContaining([{ quantity: 5, rate: 10 }])
          })
        );
      });

      test('상품에 등록된 할인을 제거 할 수 있다', () => {
        const productWithDiscount: Product = {
          id: '1',
          name: 'Product 1',
          price: 1000,
          stock: 100,
          discounts: [
            { quantity: 5, rate: 10 },
            { quantity: 10, rate: 20 }
          ]
        };

        const onProductUpdate = vi.fn();
        const { result } = renderHook(() =>
          useProduct([productWithDiscount], onProductUpdate)
        );

        act(() => {
          result.current.handleRemoveDiscount('1', 0);
        });

        expect(onProductUpdate).toHaveBeenCalledWith({
          id: '1',
          name: 'Product 1',
          price: 1000,
          stock: 100,
          discounts: [{ quantity: 10, rate: 20 }]
        });
      });
    });

    describe('useCoupon.admin 쿠폰 관리 - 어드민', () => {
      test('기본 쿠폰 값으로 초기화 되어야 한다', () => {
        const { result } = renderHook(() => useCoupon(() => {}));

        expect(result.current.newCoupon).toEqual({
          name: '',
          code: '',
          discountType: 'percentage',
          discountValue: 0
        });
      });

      test('쿠폰 필드가 업데이트 된다', () => {
        const { result } = renderHook(() => useCoupon(() => {}));

        act(() => {
          result.current.updateField('name', '어머낫 이건 꼭 사야해');
        });

        expect(result.current.newCoupon.name).toBe('어머낫 이건 꼭 사야해');
      });

      test('handleAddCoupon은 onCouponAdd를 호출하고, 쿠폰을 초기화한다', () => {
        const onCouponAdd = vi.fn();
        const { result } = renderHook(() => useCoupon(onCouponAdd));

        act(() => {
          result.current.updateField('name', '어머낫 이건 꼭 사야해');
          result.current.updateField('code', 'code-1');
          result.current.updateField('discountValue', 20);
        });

        act(() => {
          result.current.handleAddCoupon();
        });

        expect(onCouponAdd).toHaveBeenCalledWith({
          name: '어머낫 이건 꼭 사야해',
          code: 'code-1',
          discountType: 'percentage',
          discountValue: 20
        });

        expect(result.current.newCoupon).toEqual({
          name: '',
          code: '',
          discountType: 'percentage',
          discountValue: 0
        });
      });
    });

    describe('순수함수 테스트 - util-formatCurrency', () => {
      const number = 123456;
      test('올바른 숫자 포맷과 currency를 표기할 수 있다 - 원화', () => {
        expect(priceUtils.formatCurrency(number, '원', 'ko-KR')).toBe(
          '123,456원'
        );
      });
      test('올바른 숫자 포맷과 currency를 표기할 수 있다 - India', () => {
        expect(priceUtils.formatCurrency(number, undefined, 'en-IN')).toBe(
          '1,23,456'
        );
      });
    });

    describe('순수함수 테스트 - lib-util-cn', () => {
      test('머지가 잘 된다', () => {
        const result = cn('bg-red-500', 'text-white', 'p-4');
        expect(result).toBe('bg-red-500 text-white p-4');
      });

      test('falsy값을 필터링 한다', () => {
        const result = cn('bg-red-500', undefined, 'text-white', null, 'p-4');
        expect(result).toBe('bg-red-500 text-white p-4');
      });

      test('아무것도 입력안하면 빈값을 반환한다.', () => {
        const result = cn();
        expect(result).toBe('');
      });

      test('conflict이 나면, 후자가 머지가 잘 된다', () => {
        const result = cn('bg-red-500', 'text-white', 'p-4', 'bg-blue-500');
        expect(result).toBe('text-white p-4 bg-blue-500');
      });
    });
  });
});
