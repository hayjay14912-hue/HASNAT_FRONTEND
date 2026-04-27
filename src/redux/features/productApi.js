import { apiSlice } from "../api/apiSlice";
import { isActiveProduct } from "@/utils/product-access";

const filterActiveProducts = (items) =>
  Array.isArray(items) ? items.filter((item) => isActiveProduct(item)) : [];

const filterListPayload = (payload) => {
  if (Array.isArray(payload)) {
    return filterActiveProducts(payload);
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return { ...payload, data: filterActiveProducts(payload.data) };
    }

    if (Array.isArray(payload.products)) {
      return { ...payload, products: filterActiveProducts(payload.products) };
    }
  }

  return payload;
};

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getShopProducts: builder.query({
      query: () => `/api/product/shop-list`,
      transformResponse: filterListPayload,
      providesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => `/api/product/all`,
      transformResponse: filterListPayload,
      providesTags:['Products']
    }),
    getProductType: builder.query({
      query: ({ type, query }) => {
        const qs = query ? `?${query}` : '';
        return `/api/product/${type}${qs}`;
      },
      transformResponse: filterListPayload,
      providesTags:['ProductType']
    }),
    getOfferProducts: builder.query({
      query: (type) => `/api/product/offer?type=${type}`,
      transformResponse: filterListPayload,
      providesTags:['OfferProducts']
    }),
    getPopularProductByType: builder.query({
      query: (type) => `/api/product/popular/${type}`,
      transformResponse: filterListPayload,
      providesTags:['PopularProducts']
    }),
    getTopRatedProducts: builder.query({
      query: () => `/api/product/top-rated`,
      transformResponse: filterListPayload,
      providesTags:['TopRatedProducts']
    }),
    // get single product
    getProduct: builder.query({
      query: (id) => `/api/product/single-product/${id}`,
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
      invalidatesTags: (result, error, arg) => [
        { type: "RelatedProducts", id:arg },
      ],
    }),
    // get related products
    getRelatedProducts: builder.query({
      query: (id) => `/api/product/related-product/${id}`,
      transformResponse: filterListPayload,
      providesTags: (result, error, arg) => [
        { type: "RelatedProducts", id: arg },
      ],
    }),
  }),
});

export const {
  useGetShopProductsQuery,
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useGetProductTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductByTypeQuery,
  useGetTopRatedProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
} = productApi;
