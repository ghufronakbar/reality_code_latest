export const formatPrice = (price?: unknown, simplify = false): string => {
  if (
    typeof price !== "number" ||
    isNaN(price) ||
    price === undefined ||
    price === null ||
    !price
  ) {
    return "Rp. 0";
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  if (simplify) {
    if (price >= 1_000_000) {
      return `Rp. ${(price / 1_000_000).toFixed(1)}M`;
    } else if (price >= 1_000) {
      return `Rp. ${(price / 1_000).toFixed(1)}K`;
    }
    return `Rp. ${price}`;
  }

  return formattedPrice;
};
