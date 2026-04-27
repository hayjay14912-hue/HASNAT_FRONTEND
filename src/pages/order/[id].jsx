import React, { useMemo, useRef } from "react";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";
import Link from "next/link";
// internal
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ErrorMsg from "@/components/common/error-msg";
import { useGetOrderByIdQuery } from "@/redux/features/order/orderApi";
import PrdDetailsLoader from "@/components/loader/prd-details-loader";
import { getDiscountedUnitPrice, getLineItemTotal } from "@/utils/pricing";

const SingleOrder = ({ params }) => {
  const orderId = params.id;
  const printRef = useRef();
  const { data: order, isError, isLoading } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  const tempOrderData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("temp_order_data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [orderId]);

  const orderToUse = order?.order || tempOrderData;

  const formatMoney = (value) => {
    const parsed = Number(value || 0);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
  };

  const normalizeOrderStatus = (value) => {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) return "pending";
    if (raw === "dispatch" || raw === "dispatched") return "dispatched";
    if (raw === "cancelled" || raw === "canceled") return "cancel";
    return raw;
  };

  const getStatusLabel = (value) => {
    const normalized = normalizeOrderStatus(value);
    if (normalized === "cancel") return "Cancelled";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  let content = null;
  if (isLoading && !orderToUse) {
    content = <PrdDetailsLoader loading={isLoading} />;
  }
  if (isError && !orderToUse) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (orderToUse) {
    const {
      name,
      country,
      city,
      contact,
      invoice,
      createdAt,
      cart,
      shippingCost,
      discount,
      totalAmount,
      paymentMethod,
      status,
      trackingId,
      trackingNumber,
      courierCompany,
      courierName,
      deliveryPersonName,
    } = orderToUse;

    const cartItems = Array.isArray(cart) ? cart : [];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + getLineItemTotal(item),
      0
    );
    const shippingValue = Number(shippingCost || 0);
    const discountValue = Number(discount || 0);
    const resolvedTotal = Number(totalAmount || subtotal + shippingValue - discountValue);
    const statusLabel = getStatusLabel(status);
    const resolvedTrackingId = String(trackingId || trackingNumber || "").trim();
    const resolvedCourierCompany = String(courierCompany || courierName || "").trim();
    const resolvedDeliveryPersonName = String(deliveryPersonName || "").trim();
    const normalizedCourierKey = resolvedCourierCompany.toLowerCase().replace(/[\s._-]+/g, "");
    const isLocalDelivery = normalizedCourierKey === "local" || normalizedCourierKey === "localdelivery";

    content = (
      <>
        <section className="aura-order-page">
          <div className="container aura-order-container">
            <div className="aura-order-success">
              <p>
                Thank you <strong>{name}</strong>. Your order has been received.
              </p>
            </div>

            <div ref={printRef} className="aura-order-shell tp-invoice-print-wrapper">
              <div className="aura-order-header">
                <div className="aura-order-brand">
                  <h2 className="aura-order-wordmark">NEES</h2>
                  <p>
                    2879 Elk Creek Road
                    <br />
                    Stone Mountain, Georgia
                  </p>
                </div>
                <div className="aura-order-title">
                  <span>Order Confirmation</span>
                  <h1>Invoice</h1>
                  <div className="aura-order-meta-pills">
                    <p>
                      <strong>Invoice ID:</strong> #{invoice}
                    </p>
                    <p>
                      <strong>Date:</strong> {dayjs(createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="aura-order-customer">
                <div>
                  <p className="aura-order-block-label">Bill To</p>
                  <h2>{name}</h2>
                  <p>{country}</p>
                  <p>{city}</p>
                  <p>{contact}</p>
                </div>
                <div className="aura-order-customer-summary">
                  <div>
                    <span>Items</span>
                    <strong>{cartItems.length}</strong>
                  </div>
                  <div>
                    <span>Subtotal</span>
                    <strong>PKR {formatMoney(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{statusLabel}</strong>
                  </div>
                </div>
              </div>

              <div className="aura-order-table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">SL</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Item Price</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.orderQuantity}</td>
                        <td>PKR {formatMoney(getDiscountedUnitPrice(item))}</td>
                        <td>PKR {formatMoney(getLineItemTotal(item))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="aura-order-totals">
                <div className="aura-order-total-card">
                  <h5>Payment Method</h5>
                  <p>{paymentMethod || "COD"}</p>
                </div>
                <div className="aura-order-total-card">
                  <h5>Shipping</h5>
                  <p>PKR {formatMoney(shippingValue)}</p>
                </div>
                <div className="aura-order-total-card">
                  <h5>Discount</h5>
                  <p>PKR {formatMoney(discountValue)}</p>
                </div>
                <div className="aura-order-total-card is-highlight">
                  <h5>Total Amount</h5>
                  <p>PKR {formatMoney(resolvedTotal)}</p>
                </div>
              </div>

              {(resolvedTrackingId || resolvedCourierCompany || resolvedDeliveryPersonName) && (
                <div className="aura-order-totals" style={{ marginTop: "12px" }}>
                  <div className="aura-order-total-card">
                    <h5>Courier</h5>
                    <p>{resolvedCourierCompany || "N/A"}</p>
                  </div>
                  <div className="aura-order-total-card">
                    <h5>Tracking ID</h5>
                    <p>{isLocalDelivery ? "N/A (Local Delivery)" : (resolvedTrackingId || "N/A")}</p>
                  </div>
                  <div className="aura-order-total-card">
                    <h5>Delivery Person</h5>
                    <p>{resolvedDeliveryPersonName || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="aura-order-actions">
              <Link href="/shop" className="aura-order-back-btn">
                Continue Shopping
              </Link>
              <ReactToPrint
                trigger={() => (
                  <button type="button" className="aura-order-print-btn">
                    <span>
                      <i className="fa-solid fa-print"></i>
                    </span>
                    Print Invoice
                  </button>
                )}
                content={() => printRef.current}
                documentTitle={`Invoice-${invoice || orderId}`}
              />
            </div>
          </div>
        </section>
      </>
    );
  }
  if (!isLoading && !isError && !orderToUse) {
    content = <ErrorMsg msg="Order not found" />;
  }
  return (
    <>
      <Wrapper>
        <SEO pageTitle={"Order Details"} />
        <HeaderTwo style_2={true} />
        {/* content */}
        {content}
        {/* content */}
        {/* footer start */}
        <Footer primary_style={true} />
        {/* footer end */}
      </Wrapper>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: { params },
  };
};

export default SingleOrder;
