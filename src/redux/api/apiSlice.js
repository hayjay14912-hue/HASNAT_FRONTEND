import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEFAULT_API_BASE_URL = "https://hasnat-backend.vercel.app";
const envApiBaseUrl = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
const isLoopbackApi = /localhost|127\.0\.0\.1/i.test(envApiBaseUrl);
const isLocalRuntime = process.env.NODE_ENV !== "production";

const NEXT_PUBLIC_API_BASE_URL =
  envApiBaseUrl && (isLocalRuntime || !isLoopbackApi)
    ? envApiBaseUrl
    : DEFAULT_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { getState, endpoint }) => {
      try {
        const userInfo = Cookies.get('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          if (user?.accessToken) {
            headers.set("Authorization", `Bearer ${user.accessToken}`);
          }
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["Products","Coupon","Product","RelatedProducts","UserOrder","UserOrders","ProductType","OfferProducts","PopularProducts","TopRatedProducts"]
});
