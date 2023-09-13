import * as express from 'express';

export const app = express();
const CARDS_URL = 'https://moonpig.github.io/tech-test-node-backend/cards.json';

app.set('json spaces', 2);

app.get('/cards', async (req, res) => {
  // respond with a list of cards
  const cardsResponse = await fetch(CARDS_URL);
  const cardsData = await cardsResponse.json();

  const cards = await cardsData.reduce((cards, { id, title }) => {
    const newId = `/cards/${id}`;

    return [...cards, { title, url: newId }];
  }, []);

  return res.send(cards);
});

app.get('/cards/:cardId/:sizeId?', () => {
  // respond with card by id
});
