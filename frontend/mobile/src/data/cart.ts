import { Cart } from '../types/models';

export const carts: Cart[] = [
  {
    id: 'cart-u2',
    userId: 'u2',
    items: [
      {
        id: 'ci1',
        productId: 'p1',
        quantity: 1,
        priceSnapshot: 379,
      },
      {
        id: 'ci2',
        productId: 'p10',
        quantity: 2,
        priceSnapshot: 36,
      },
    ],
  },
  {
    id: 'cart-u3',
    userId: 'u3',
    items: [],
  },
];