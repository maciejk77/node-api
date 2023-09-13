import * as express from 'express';
import { Card } from './interfaces';
import { title } from 'process';

export const app = express();

const BASE_URL = 'https://moonpig.github.io/tech-test-node-backend';
const CARDS_URL = `${BASE_URL}/cards.json`;
const TEMPLATES = `${BASE_URL}/templates.json`;
const SIZES_URL = `${BASE_URL}/sizes.json`;

app.set('json spaces', 2);

app.get('/cards', async (req, res) => {
  // respond with a list of cards
  const cardsResponse = await fetch(CARDS_URL);
  const cardsData = await cardsResponse.json();

  const templateResponse = await fetch(TEMPLATES);
  const templateData = await templateResponse.json();

  const cards = await cardsData.reduce(
    (cards: Card[], { id, title, pages }) => {
      const newId = `/cards/${id}`;

      const templateId = pages[0]['templateId']; // first element of pages array is front-cover-*
      const imageUrl = templateData.find(
        ({ id }) => id === templateId
      ).imageUrl;

      return [...cards, { title, url: newId, imageUrl }];
    },
    []
  );

  return res.send(cards);
});

app.get('/cards/:cardId/:sizeId?', async (req, res) => {
  // respond with card by id
  const cardsResponse = await fetch(CARDS_URL);
  const cardsData = await cardsResponse.json();

  const templateResponse = await fetch(TEMPLATES);
  const templateData = await templateResponse.json();

  const sizesResponse = await fetch(SIZES_URL);
  const sizesData = await sizesResponse.json();

  const { cardId, sizeId } = req.params;
  const { title, pages, sizes, basePrice } = await cardsData.find(
    ({ id }) => id === cardId
  );

  // const pageTitles = pages.map(({ title }) => title);

  const availableSizesWithTitle = sizes.reduce(
    (availableSizes, availableSize) => {
      // OPTIONAL BELOW: is param :sizeId ie /gt included in sizes? if ie /gtx => undefined size => { availableSizes: null }
      // const hasSize = sizes.includes(sizeId);
      // if (!hasSize) return null;

      const { id, title } = sizesData.find(({ id }) => id === availableSize);
      return [...availableSizes, { id, title }];
    },
    []
  );

  const templateId = pages[0]['templateId'];
  const { imageUrl } = templateData.find(({ id }) => id === templateId);

  const { priceMultiplier } = sizesData.find(({ id }) => id === sizeId);
  const price = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format((basePrice * priceMultiplier) / 100);

  const pagesWithSizeUrl = pages.reduce((extendedPages, extendedPage) => {
    const { title, templateId } = extendedPage;

    const { width, height, imageUrl } = templateData.find(
      ({ id }) => id === templateId
    );

    return [...extendedPages, { title, width, height, imageUrl }];
  }, []);

  return res.send({
    title,
    size: sizeId,
    availableSizes: availableSizesWithTitle,
    imageUrl,
    price,
    pages: pagesWithSizeUrl,
  });
});
