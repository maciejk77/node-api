export const fetchData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

export const getElementById = (dataCollection: any[], elementId: string) =>
  dataCollection.find(({ id }) => id === elementId);

export const formattedPrice = (basePrice: number, priceMultiplier: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format((basePrice * priceMultiplier) / 100);
