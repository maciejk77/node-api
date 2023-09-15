import * as express from 'express';
import { IPage } from './interfaces';
import { fetchData, getElementById, formatPrice } from './utils';
import { CARDS_URL, TEMPLATES_URL, SIZES_URL } from './constants';

export const app = express();

app.set('json spaces', 2);

app.get('/cards', async (req, res) => {
  try {
    // respond with a list of cards
    const cardsCollection = await fetchData(CARDS_URL);
    const templatesCollection = await fetchData(TEMPLATES_URL);

    const cards = await cardsCollection.map(({ id, title, pages }) => {
      const newId = `/cards/${id}`;
      const templateId = pages[0]['templateId']; // first element of pages array is front-cover-*
      const { imageUrl } = getElementById(templatesCollection, templateId);

      return { title, url: newId, imageUrl };
    });

    return res.send(cards);
  } catch (error) {
    return res.status(400).send(`Error: ${error.message}`);
  }
});

app.get('/cards/:cardId/:sizeId?', async (req, res) => {
  try {
    // respond with card by id
    let price: string;
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

    // if sizeId exist multiply price, otherwise return base price
    if (sizeId) {
      const { priceMultiplier } = getElementById(sizesCollection, sizeId);
      price = formatPrice(basePrice, priceMultiplier);
    } else {
      price = formatPrice(basePrice);
    }

    const availableSizesWithTitle = sizes.map((availableSize: string) => {
      // OPTIONAL BELOW: is param :sizeId ie /gt included in sizes? if not => { availableSizes: null }
      // const hasSize = sizes.includes(sizeId);
      // if (!hasSize) return null;
      const { id, title } = getElementById(sizesCollection, availableSize);
      return { id, title };
    });

    const pagesWithSizeUrl = pages.map((extendedPage: IPage) => {
      const { title, templateId } = extendedPage;
      const { width, height, imageUrl } = getElementById(
        templatesCollection,
        templateId
      );

      return { title, width, height, imageUrl };
    });

    return res.send({
      title,
      size: sizeId,
      availableSizes: availableSizesWithTitle,
      imageUrl,
      price,
      pages: pagesWithSizeUrl,
    });
  } catch (error) {
    return res
      .status(400)
      .send(
        `Error: Unable to fetch data, wrong cardId or size in the URL (not matching sm/md/lg/gt)`
      );
  }
});
