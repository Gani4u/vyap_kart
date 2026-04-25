import { Banner } from '../types/models';

export const banners: Banner[] = [
  {
    id: 'b1',
    title: '24 Hour Delivery in Ilkal',
    subtitle: 'Fast delivery for daily essentials in 587125',
    image: 'https://placehold.co/1200x400/png?text=24+Hour+Delivery+Ilkal',
    targetType: 'offer',
    targetId: 'delivery-offer',
    isActive: true,
  },
  {
    id: 'b2',
    title: 'Groceries at Better Prices',
    subtitle: 'Top fast-moving products available now',
    image: 'https://placehold.co/1200x400/png?text=Groceries+Deals',
    targetType: 'category',
    targetId: 'c1',
    isActive: true,
  },
  {
    id: 'b3',
    title: 'Snacks and Daily Needs',
    subtitle: 'Stock up your home essentials',
    image: 'https://placehold.co/1200x400/png?text=Snacks+and+Daily+Needs',
    targetType: 'category',
    targetId: 'c6',
    isActive: true,
  },
];