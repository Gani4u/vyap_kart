import { User } from '../types/models';

export const users: User[] = [
  {
    id: 'u1',
    name: 'Vyapkart Admin',
    mobile: '9999999999',
    email: 'admin@vyapkart.com',
    role: 'admin',
    createdAt: '2025-01-01T09:00:00.000Z',
  },
  {
    id: 'u2',
    name: 'Ravi Patil',
    mobile: '9876543210',
    email: 'ravi@example.com',
    role: 'customer',
    createdAt: '2025-01-03T11:30:00.000Z',
  },
  {
    id: 'u3',
    name: 'Shreya Kulkarni',
    mobile: '9123456780',
    email: 'shreya@example.com',
    role: 'customer',
    createdAt: '2025-01-05T14:15:00.000Z',
  },
];