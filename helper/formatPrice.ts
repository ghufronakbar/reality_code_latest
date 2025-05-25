export const formatPrice = (price?: unknown, simplify = false): string => {
  if (typeof price !== "number" || isNaN(price)) {
    return "";
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  if (simplify) {
    if (price >= 1_000_000) {
      return `Rp. ${(price / 1_000_000).toFixed(0)}M`;
    } else if (price >= 1_000) {
      return `Rp. ${(price / 1_000).toFixed(0)}K`;
    }    
    return `Rp. ${formattedPrice}`;
  }

  return formattedPrice;
};
