import { apiSlice } from "../../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // saveOrder
    saveOrder: builder.mutation({
      query: (data) => ({
        url: "/api/order/saveOrder",
        method: "POST",
        body: data,
      }),
      invalidatesTags:['UserOrders'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result) {
            localStorage.removeItem("couponInfo");
            localStorage.removeItem("cart_products");
            localStorage.removeItem("shipping_info");
          }
        } catch (err) {
          // do nothing
        }
      },

    }),
    // send order confirmation email
    sendOrderConfirmation: builder.mutation({
      query: (data) => ({
        url: "/api/order/send-confirmation",
        method: "POST",
        body: data,
      }),
    }),
    // getUserOrders
    getUserOrders: builder.query({
      query: () => `/api/user-order`,
      providesTags:["UserOrders"],
      keepUnusedDataFor: 600,
    }),
    // getUserOrders
    getUserOrderById: builder.query({
      query: (id) => `/api/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
    // getOrderById - for both authenticated and guest users
    getOrderById: builder.query({
      query: (id) => `/api/order/${id}`,
      providesTags: (result, error, arg) => [{ type: "Order", id: arg }],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useSaveOrderMutation,
  useSendOrderConfirmationMutation,
  useGetUserOrderByIdQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
} = authApi;
