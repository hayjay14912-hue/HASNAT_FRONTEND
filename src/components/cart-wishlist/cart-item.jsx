import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import Link from "next/link";
// internal
import { Close, Minus, Plus } from "@/svg";
import { add_cart_product, quantityDecrement, remove_product } from "@/redux/features/cartSlice";
import { getDiscountedUnitPrice, getLineItemTotal } from "@/utils/pricing";
import { getActiveBogoOffer } from "@/utils/bogo";
import { buildProductPath, getProductImageAlt } from "@/utils/seo-utils";

const CartItem = ({ product, rowIndex = 0 }) => {
  const { _id, img, title, price, discount, orderQuantity = 0 } = product || {};
  const [isQtyAnimating, setIsQtyAnimating] = useState(false);

  const dispatch = useDispatch();
  const parsedPrice = Number(price || 0);
  const unitPrice = getDiscountedUnitPrice(product);
  const linePrice = getLineItemTotal(product);
  const bogoOffer = getActiveBogoOffer(product);
  const productPath = buildProductPath(product || { _id, title });
  const imageAlt = getProductImageAlt(product);
  const formatCurrency = (value) =>
    `PKR ${Number(value || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const brandName =
    product?.brand?.name ||
    product?.manufacturer ||
    product?.company ||
    "NEES Medical";

  useEffect(() => {
    if (!orderQuantity) {
      return;
    }
    setIsQtyAnimating(true);
    const timer = setTimeout(() => {
      setIsQtyAnimating(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [orderQuantity]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle decrement product
  const handleDecrement = (prd) => {
    dispatch(quantityDecrement(prd));
  };

  // handle remove product
  const handleRemovePrd = (prd) => {
    dispatch(remove_product(prd));
  };

  return (
    <tr className="aura-cart-row" style={{ "--aura-row-index": rowIndex }}>
      {/* img */}
      <td className="tp-cart-img aura-cart-cell-media" data-label="Product">
        <Link href={productPath} className="aura-cart-image-wrap">
          <Image src={img} alt={imageAlt} width={60} height={60} className="aura-cart-image" />
        </Link>
      </td>
      {/* title */}
      <td className="tp-cart-title aura-cart-cell-title" data-label="Product">
        <p className="aura-cart-brand">{brandName}</p>
        <Link href={productPath}>{title}</Link>
      </td>
      {/* price */}
      <td className="tp-cart-price aura-cart-cell-price" data-label="Subtotal">
        <div className="aura-cart-price-wrap">
          <span>{formatCurrency(linePrice)}</span>
        </div>
        <p className="aura-cart-meta">
          {bogoOffer
            ? `${bogoOffer.label} - ${bogoOffer.bundleSize} pcs for ${formatCurrency(
                bogoOffer.bundlePrice
              )}`
            : `Unit ${formatCurrency(unitPrice)}${
                Number(discount || 0) > 0 ? ` (was ${formatCurrency(parsedPrice)})` : ""
              }`}
        </p>
      </td>
      {/* quantity */}
      <td className="tp-cart-quantity aura-cart-cell-qty" data-label="Quantity">
        <div className={`tp-product-quantity aura-cart-quantity ${isQtyAnimating ? "is-pulse" : ""}`}>
          <button
            onClick={() => handleDecrement(product)}
            className="tp-cart-minus aura-cart-qty-btn"
            type="button"
            aria-label={`Decrease quantity of ${title}`}
          >
            <Minus />
          </button>
          <input className="tp-cart-input" type="text" value={orderQuantity} readOnly />
          <button
            onClick={() => handleAddProduct(product)}
            className="tp-cart-plus aura-cart-qty-btn"
            type="button"
            aria-label={`Increase quantity of ${title}`}
          >
            <Plus />
          </button>
        </div>
      </td>
      {/* action */}
      <td className="tp-cart-action aura-cart-cell-remove" data-label="Remove">
        <div className="aura-cart-remove-wrap">
          <button
            onClick={() => handleRemovePrd({ title, id: _id })}
            className="tp-cart-action-btn aura-cart-remove-btn"
            type="button"
            aria-label={`Remove ${title} from cart`}
          >
            <Close />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CartItem;
