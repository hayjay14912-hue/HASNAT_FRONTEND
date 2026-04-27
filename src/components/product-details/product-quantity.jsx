import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { Minus, Plus } from '@/svg';
import { decrement, increment } from '@/redux/features/cartSlice';

const ProductQuantity = ({ quickViewMode = false }) => {
  const { orderQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const quantityClassName = quickViewMode
    ? 'tp-product-quantity mb-15 mr-15 aura-qv-quantity-pill'
    : 'tp-product-quantity aura-pdp-quantity-pill';
  // handleIncrease
  const handleIncrease = () => {
    dispatch(increment());
  };
  // handleDecrease
  const handleDecrease = () => {
    dispatch(decrement());
  };
  return (
    <div className={`tp-product-details-quantity ${quickViewMode ? 'aura-qv-quantity' : ''}`}>
      <div className={quantityClassName}>
        <span className="tp-cart-minus" onClick={handleDecrease}>
          <Minus />
        </span>
        <input className="tp-cart-input" type="text" readOnly value={orderQuantity} />
        <span className="tp-cart-plus" onClick={handleIncrease}>
          <Plus />
        </span>
      </div>
    </div>
  );
};

export default ProductQuantity;
