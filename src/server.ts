import * as express from 'express';
import { Card } from './interfaces';

export const app = express();

const CARDS_URL = 'https://moonpig.github.io/tech-test-node-backend/cards.json';
const IMAGE_URL =
  'https://moonpig.github.io/tech-test-node-backend/templates.json';

app.set('json spaces', 2);

app.get('/cards', async (req, res) => {
  // respond with a list of cards
  const cardsResponse = await fetch(CARDS_URL);
  const cardsData = await cardsResponse.json();

  const imageResponse = await fetch(IMAGE_URL);
  const imageData = await imageResponse.json();

  const cards = await cardsData.reduce(
    (cards: Card[], { id, title, pages }) => {
      const newId = `/cards/${id}`;

      const templateId = pages[0]['templateId']; // first element of pages array is front-cover-*
      const imageUrl = imageData.find(({ id }) => id === templateId).imageUrl;

      return [...cards, { title, url: newId, imageUrl }];
    },
    []
  );

  return res.send(cards);
});

app.get('/cards/:cardId/:sizeId?', () => {
  // respond with card by id
});
