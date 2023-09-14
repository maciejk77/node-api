import * as express from 'express';
import { ICard, IPage, ISize, IPageTemplate } from './interfaces';
import { fetchData, getElementById, formattedPrice } from './utils';
import { CARDS_URL, TEMPLATES_URL, SIZES_URL } from './constants';

export const app = express();

app.set('json spaces', 2);

app.get('/cards', async (req, res) => {
  // respond with a list of cards
  const cardsCollection = await fetchData(CARDS_URL);
  const templatesCollection = await fetchData(TEMPLATES_URL);

  const cards = await cardsCollection.reduce(
    (cards: ICard[], { id, title, pages }) => {
      const newId = `/cards/${id}`;
      const templateId = pages[0]['templateId']; // first element of pages array is front-cover-*
      const { imageUrl } = getElementById(templatesCollection, templateId);

      return [...cards, { title, url: newId, imageUrl }];
    },
    []
  );

  return res.send(cards);
});

app.get('/cards/:cardId/:sizeId?', async (req, res) => {
  // respond with card by id
  const { cardId, sizeId } = req.params;
  const cardsCollection = await fetchData(CARDS_URL);
  const templatesCollection = await fetchData(TEMPLATES_URL);
  const sizesCollection = await fetchData(SIZES_URL);

  const { title, pages, sizes, basePrice } = getElementById(
    cardsCollection,
    cardId
  );

  const templateId = pages[0]['templateId'];
  const { imageUrl } = getElementById(templatesCollection, templateId);

  const { priceMultiplier } = getElementById(sizesCollection, sizeId);
  const price = formattedPrice(basePrice, priceMultiplier);

  const availableSizesWithTitle = sizes.reduce(
    (availableSizes: ISize[], availableSize: string) => {
      // OPTIONAL BELOW: is param :sizeId ie /gt included in sizes? if not => { availableSizes: null }
      // const hasSize = sizes.includes(sizeId);
      // if (!hasSize) return null;
      const { id, title } = getElementById(sizesCollection, availableSize);

      return [...availableSizes, { id, title }];
    },
    []
  );

  const pagesWithSizeUrl = pages.reduce(
    (extendedPages: IPageTemplate[], extendedPage: IPage) => {
      const { title, templateId } = extendedPage;
      const { width, height, imageUrl } = getElementById(
        templatesCollection,
        templateId
      );

      return [...extendedPages, { title, width, height, imageUrl }];
    },
    []
  );

  return res.send({
    title,
    size: sizeId,
    availableSizes: availableSizesWithTitle,
    imageUrl,
    price,
    pages: pagesWithSizeUrl,
  });
});
