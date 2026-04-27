import { getActiveBogoOffer, getBogoLineTotal, getBogoPerUnitPrice } from "@/utils/bogo";

export const FREE_SHIPPING_THRESHOLD = 7000;
export const STANDARD_SHIPPING_COST = 300;

export const getDiscountValue = (discount) => Number(discount || 0);

export const getBasePrice = (price) => Number(price || 0);

export const getDiscountedUnitPrice = (item = {}) => {
  const bogoOffer = getActiveBogoOffer(item);
  if (bogoOffer) {
    return getBogoPerUnitPrice(item);
  }
  const basePrice = getBasePrice(item?.price);
  const discountValue = getDiscountValue(item?.discount);
  if (discountValue <= 0) return basePrice;
  return basePrice - (basePrice * discountValue) / 100;
};

export const getLineItemTotal = (item = {}) => {
  const bogoOffer = getActiveBogoOffer(item);
  if (bogoOffer) {
    return getBogoLineTotal(item, item?.orderQuantity || 0);
  }
  return getDiscountedUnitPrice(item) * Number(item?.orderQuantity || 0);
};

export const getCartTotals = (items = []) =>
  items.reduce(
    (acc, item) => {
      acc.total += getLineItemTotal(item);
      acc.quantity += Number(item?.orderQuantity || 0);
      return acc;
    },
    { total: 0, quantity: 0 }
  );

export const getShippingCost = (subtotal = 0) =>
  Number(subtotal || 0) >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
