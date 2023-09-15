import * as express from 'express';
import { Request, Response } from 'express';
import { ICard, IPage, ISize, ITemplate } from './interfaces';
import { fetchData, getElementById, formatPrice } from './utils';
import { CARDS_URL, TEMPLATES_URL, SIZES_URL } from './constants';

export const app = express();

app.set('json spaces', 2);

app.get('/cards', async (req: Request, res: Response) => {
  try {
    // respond with a list of cards
    const cardsCollection: ICard[] = await fetchData(CARDS_URL);
    const templatesCollection: ITemplate[] = await fetchData(TEMPLATES_URL);

    const cards = cardsCollection.map(({ id, title, pages }: ICard) => {
      const newId: string = `/cards/${id}`;
      const templateId: string = pages[0]['templateId']; // first element of pages array is front-cover-*
      const { imageUrl }: ITemplate = getElementById(
        templatesCollection,
        templateId
      );

      return { title, url: newId, imageUrl };
    });

    return res.send(cards);
  } catch (error) {
    return res.status(400).send(`Error: ${error.message}`);
  }
});

app.get('/cards/:cardId/:sizeId?', async (req: Request, res: Response) => {
  try {
    // respond with card by id
    let price: string;
    const { cardId, sizeId } = req.params;

    const cardsCollection: ICard[] = await fetchData(CARDS_URL);
    const templatesCollection: ITemplate[] = await fetchData(TEMPLATES_URL);
    const sizesCollection: ISize[] = await fetchData(SIZES_URL);

    const { title, pages, sizes, basePrice }: ICard = getElementById(
      cardsCollection,
      cardId
    );

    const templateId = pages[0]['templateId'];
    const { imageUrl }: ITemplate = getElementById(
      templatesCollection,
      templateId
    );

    // if sizeId exist multiply price, otherwise return base price
    if (sizeId) {
      const { priceMultiplier }: ISize = getElementById(
        sizesCollection,
        sizeId
      );
      price = formatPrice(basePrice, priceMultiplier);
    } else {
      price = formatPrice(basePrice);
    }

    const availableSizesWithTitle = sizes.map((availableSize: string) => {
      // OPTIONAL BELOW: is param :sizeId ie /gt included in sizes? if not => { availableSizes: null }
      // const hasSize = sizes.includes(sizeId);
      // if (!hasSize) return null;
      const { id, title }: ISize = getElementById(
        sizesCollection,
        availableSize
      );
      return { id, title };
    });

    const pagesWithSizeUrl = pages.map((extendedPage: IPage) => {
      const { title, templateId }: IPage = extendedPage;
      const { width, height, imageUrl }: ITemplate = getElementById(
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
