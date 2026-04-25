import { DeliveryZone } from '../types/models';

export const zones: DeliveryZone[] = [
  {
    id: 'z1',
    name: 'Ilkal Main Zone',
    city: 'Ilkal',
    pincode: '587125',
    areas: [
      'Bus Stand Road',
      'Shivaji Circle',
      'Market Road',
      'Mahantesh Nagar',
      'College Road',
      'Station Area',
    ],
    isActive: true,
  },
  {
    id: 'z2',
    name: 'Outside Ilkal Test Zone',
    city: 'Nearby Town',
    pincode: '587124',
    areas: ['Old Market'],
    isActive: false,
  },
];