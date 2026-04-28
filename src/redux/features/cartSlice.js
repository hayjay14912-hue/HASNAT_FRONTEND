import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";
import { isPurchasableOnline } from "@/utils/product-access";
import { getProductPurchaseStep, normalizeOrderQuantity } from "@/utils/bogo";

const initialState = {
  cart_products: [],
  orderQuantity: 1,
  orderQuantityStep: 1,
  activeOrderProductId: "",
  cartMiniOpen:false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add_cart_product: (state, { payload }) => {
      if (!isPurchasableOnline(payload)) {
        notifyError("This item is currently unavailable for online checkout.");
        return;
      }
      const step = getProductPurchaseStep(payload);
      const requestedQuantity =
        state.activeOrderProductId === payload?._id
          ? normalizeOrderQuantity(payload, state.orderQuantity)
          : step;
      const isExist = state.cart_products.some((i) => i._id === payload._id);
      if (!isExist) {
        if (payload.quantity < requestedQuantity) {
          notifyError("No more quantity available for this product!");
          return;
        }
        const newItem = {
          ...payload,
          orderQuantity: requestedQuantity,
        };
        state.cart_products.push(newItem);
        notifySuccess(`${requestedQuantity} ${payload.title} added to cart`);
      } else {
        state.cart_products.map((item) => {
          if (item._id === payload._id) {
            const nextQuantity = item.orderQuantity + requestedQuantity;
            if (item.quantity >= nextQuantity) {
              item.orderQuantity = nextQuantity;
              notifySuccess(`${requestedQuantity} ${item.title} added to cart`);
            } else {
              notifyError("No more quantity available for this product!");
              state.orderQuantity = step;
            }
          }
          return { ...item };
        });
      }
      setLocalStorage("cart_products", state.cart_products);
    },
    increment: (state, { payload }) => {
      state.orderQuantity = state.orderQuantity + state.orderQuantityStep;
    },
    decrement: (state, { payload }) => {
      state.orderQuantity =
        state.orderQuantity > state.orderQuantityStep
          ? state.orderQuantity - state.orderQuantityStep
          : state.orderQuantityStep;
    },
    quantityDecrement: (state, { payload }) => {
      state.cart_products.map((item) => {
        if (item._id === payload._id) {
          const step = getProductPurchaseStep(item);
          if (item.orderQuantity > step) {
            item.orderQuantity = item.orderQuantity - step;
          }
        }
        return { ...item };
      });
      setLocalStorage("cart_products", state.cart_products);
    },
    remove_product: (state, { payload }) => {
      state.cart_products = state.cart_products.filter(
        (item) => item._id !== payload.id
      );
      setLocalStorage("cart_products", state.cart_products);
      notifyError(`${payload.title} Remove from cart`);
    },
    get_cart_products: (state, action) => {
      state.cart_products = getLocalStorage("cart_products").map((item) => ({
        ...item,
        orderQuantity: normalizeOrderQuantity(item, item?.orderQuantity || 1),
      }));
    },
    initialOrderQuantity: (state, { payload }) => {
      state.orderQuantity = 1;
      state.orderQuantityStep = 1;
      state.activeOrderProductId = "";
    },
    configureOrderQuantity: (state, { payload }) => {
      const step = getProductPurchaseStep(payload);
      state.orderQuantityStep = step;
      state.orderQuantity = step;
      state.activeOrderProductId = String(payload?._id || "");
    },
    clearCart:(state) => {
      const isClearCart = window.confirm('Are you sure you want to remove all items ?');
      if(isClearCart){
        state.cart_products = []
      }
      setLocalStorage("cart_products", state.cart_products);
    },
    openCartMini:(state,{payload}) => {
      state.cartMiniOpen = true
    },
    closeCartMini:(state,{payload}) => {
      state.cartMiniOpen = false
    },
  },
});

export const {
  add_cart_product,
  increment,
  decrement,
  get_cart_products,
  remove_product,
  quantityDecrement,
  initialOrderQuantity,
  configureOrderQuantity,
  clearCart,
  closeCartMini,
  openCartMini,
} = cartSlice.actions;
export default cartSlice.reducer;
