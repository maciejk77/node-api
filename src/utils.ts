import { IData } from './interfaces';

export const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

function getElementById<T extends IData>(
  dataCollection: T[],
  elementId: string
) {
  dataCollection.find(({ id }) => id === elementId);
}

export const formatPrice = (
  basePrice: number,
  priceMultiplier: number = null
) => {
  const calculatedPrice: number =
    (priceMultiplier ? basePrice * priceMultiplier : basePrice) / 100;

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(calculatedPrice);
};
