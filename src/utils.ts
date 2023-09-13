export const fetchData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

export const findUnique = (dataCollection, elementId) =>
  dataCollection.find(({ id }) => id === elementId);

export const formattedPrice = (basePrice, priceMultiplier) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format((basePrice * priceMultiplier) / 100);
