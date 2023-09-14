export const fetchData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

export const getElementById = (dataCollection: any[], elementId: string) =>
  dataCollection.find(({ id }) => id === elementId);

export const formatPrice = (
  basePrice: number,
  priceMultiplier: number = null
) => {
  const calculatePrice =
    (priceMultiplier ? basePrice * priceMultiplier : basePrice) / 100;

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(calculatePrice);
};
