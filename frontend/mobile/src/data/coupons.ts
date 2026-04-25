import { Coupon } from '../types/models';

export const coupons: Coupon[] = [
  {
    id: 'cp1',
    code: 'ILKAL50',
    type: 'flat',
    value: 50,
    minOrderAmount: 500,
    expiryDate: '2026-12-31T23:59:59.000Z',
    usageLimit: 100,
    isActive: true,
  },
  {
    id: 'cp2',
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 300,
    expiryDate: '2026-12-31T23:59:59.000Z',
    usageLimit: 500,
    isActive: true,
  },
  {
    id: 'cp3',
    code: 'EXPIRED20',
    type: 'flat',
    value: 20,
    minOrderAmount: 200,
    expiryDate: '2024-12-31T23:59:59.000Z',
    usageLimit: 50,
    isActive: false,
  },
];