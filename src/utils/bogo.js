const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInt = (value, fallback = 1) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getActiveBogoOffer = (product = {}) => {
  const offer = product?.bogoOffer;
  if (!offer || !offer.enabled) {
    return null;
  }

  const bundleSize = Math.max(1, toInt(offer?.bundleSize, 2));
  const bundlePrice = Math.max(0, toNumber(offer?.bundlePrice, 0));
  if (bundlePrice <= 0) {
    return null;
  }

  return {
    enabled: true,
    label: String(offer?.label || "Buy 1 Get 1 FREE").trim() || "Buy 1 Get 1 FREE",
    bundleSize,
    bundlePrice,
  };
};

export const getProductPurchaseStep = (product = {}) => getActiveBogoOffer(product)?.bundleSize || 1;

export const normalizeOrderQuantity = (product = {}, quantity = 1) => {
  const step = getProductPurchaseStep(product);
  const requested = Math.max(step, toInt(quantity, step));

  if (step <= 1) {
    return requested;
  }

  const bundles = Math.max(1, Math.ceil(requested / step));
  return bundles * step;
};

export const getBogoBundleCount = (product = {}, quantity = 0) => {
  const offer = getActiveBogoOffer(product);
  if (!offer) return 0;
  const normalizedQty = normalizeOrderQuantity(product, quantity);
  return Math.max(1, Math.round(normalizedQty / offer.bundleSize));
};

export const getBogoLineTotal = (product = {}, quantity = 0) => {
  const offer = getActiveBogoOffer(product);
  if (!offer) return 0;
  return getBogoBundleCount(product, quantity) * offer.bundlePrice;
};

export const getBogoPerUnitPrice = (product = {}) => {
  const offer = getActiveBogoOffer(product);
  if (!offer) return 0;
  return offer.bundlePrice / offer.bundleSize;
};
