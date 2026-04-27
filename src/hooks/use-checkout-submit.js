import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useSaveOrderMutation } from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";
import { getLineItemTotal } from "@/utils/pricing";

const useCheckoutSubmit = () => {
  // offerCoupons
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // addOrder
  const [saveOrder] = useSaveOrderMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // user
  const { user } = useSelector((state) => state.auth);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // showCard
  const [showCard, setShowCard] = useState(false);
  // coupon apply message
  const [couponApplyMsg,setCouponApplyMsg] = useState("");
  const submitInFlightRef = useRef(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const {register,handleSubmit,setValue,formState: { errors }} = useForm();

  let couponRef = useRef("");

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  //calculate total and discount value
  useEffect(() => {
    const result = cart_products?.filter(
      (p) => p.productType === discountProductType
    );
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) => preValue + getLineItemTotal(currentValue),
      0
    );
    let totalValue = "";
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType
  ]);


  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      notifyError("Coupons are still loading. Please try again.");
      return;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ${result[0].minimumAmount} PKR required to apply this coupon!`
      );
      return;
    } else {
      // notifySuccess(
      //   `Your Coupon ${result[0].title} is Applied on ${result[0].productType}!`
      // );
      setCouponApplyMsg(`Your Coupon ${result[0].title} is Applied on ${result[0].productType} productType!`)
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      dispatch(set_coupon(result[0]));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("")
      }, 5000);
    }
  };

  // handleShippingCost
  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  //set values
  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("country", shipping_info.country);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("zipCode", shipping_info.zipCode);
    setValue("contactNo", shipping_info.contactNo);
    setValue("email", shipping_info.email);
    setValue("orderNote", shipping_info.orderNote);
  }, [user, setValue, shipping_info, router]);

  const serializeCartItems = (items = []) =>
    items.map((item) => ({
      _id: item?._id,
      title: item?.title || "",
      img: item?.img || "",
      price: Number(item?.price || 0),
      discount: Number(item?.discount || 0),
      orderQuantity: Number(item?.orderQuantity || 1),
      quantity: Number(item?.quantity || 0),
      status: item?.status || "in-stock",
      sku: item?.sku || "",
      productType: item?.productType || "",
      parent: item?.parent || "",
      children: item?.children || "",
      brand: item?.brand?.name
        ? {
            id: item?.brand?.id || item?.brand?._id || "",
            name: item?.brand?.name || "",
          }
        : null,
      category: item?.category
        ? {
            id: item?.category?.id || item?.category?._id || "",
            name: item?.category?.name || "",
          }
        : null,
      inquiryOnly: Boolean(item?.inquiryOnly),
      isInquiryOnly: Boolean(item?.isInquiryOnly),
      professionalUseOnly: Boolean(item?.professionalUseOnly),
      bogoOffer: item?.bogoOffer
        ? {
            enabled: Boolean(item?.bogoOffer?.enabled),
            label: String(item?.bogoOffer?.label || "").trim(),
            bundleSize: Number(item?.bogoOffer?.bundleSize || 0),
            bundlePrice: Number(item?.bogoOffer?.bundlePrice || 0),
          }
        : null,
    }));

  // submitHandler
  const submitHandler = async (data) => {
    if (submitInFlightRef.current) {
      return;
    }

    submitInFlightRef.current = true;
    setIsCheckoutSubmit(true);
    dispatch(set_shipping(data));

    const parsedCartTotal = Number(cartTotal);
    const resolvedTotal =
      Number.isFinite(parsedCartTotal) && parsedCartTotal > 0
        ? parsedCartTotal
        : Number(total || 0) + Number(shippingCost || 0) - Number(discountAmount || 0);

    const orderInfo = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "Pending",
      cart: serializeCartItems(cart_products),
      paymentMethod: data.payment,
      subTotal: Number(total || 0),
      shippingCost: Number(shippingCost || 0),
      discount: Number(discountAmount || 0),
      totalAmount: Number(resolvedTotal || 0),
      orderNote: data.orderNote,
      user: user?._id || null,
      guestCheckout: !user?._id,
    };

    try {
      const res = await saveOrder(orderInfo).unwrap();
      const createdOrder = res?.order;

      if (!createdOrder?._id) {
        throw new Error("Order response missing order id");
      }

      localStorage.setItem("temp_order_data", JSON.stringify(createdOrder));
      localStorage.removeItem("cart_products");
      localStorage.removeItem("couponInfo");

      const orderId = createdOrder._id;

      notifySuccess("Your Order Confirmed!");
      await router.push(`/order/${orderId}`);
    } catch (error) {
      console.error("Order submission error:", error);
      notifyError("Failed to place order. Please try again.");
    } finally {
      submitInFlightRef.current = false;
      setIsCheckoutSubmit(false);
    }
  };


  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    submitHandler,
    handleSubmit,
    cartTotal,
    couponApplyMsg,
    showCard,
    setShowCard,
  };
};

export default useCheckoutSubmit;
