
import { Product, OrderStatus, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aether Pods Pro',
    price: 299,
    description: 'Next-generation neural audio experience with active spatial dampening.',
    image: 'https://picsum.photos/seed/pods/600/600',
    category: 'Audio',
    stock: 25
  },
  {
    id: '2',
    name: 'Luminal Watch X',
    price: 499,
    description: 'Holographic display wearable with integrated health biometric sensors.',
    image: 'https://picsum.photos/seed/watch/600/600',
    category: 'Wearables',
    stock: 12
  },
  {
    id: '3',
    name: 'Zenith VR Deck',
    price: 899,
    description: 'High-fidelity virtual reality interface for total digital immersion.',
    image: 'https://picsum.photos/seed/vr/600/600',
    category: 'Gaming',
    stock: 8
  },
  {
    id: '4',
    name: 'Quantum Lens 2.0',
    price: 150,
    description: 'Augmented reality glasses that blend your world with infinite data.',
    image: 'https://picsum.photos/seed/lens/600/600',
    category: 'Wearables',
    stock: 45
  },
  {
    id: '5',
    name: 'Titanium Slate',
    price: 1299,
    description: 'Ultra-thin computational surface with liquid crystal retina display.',
    image: 'https://picsum.photos/seed/slate/600/600',
    category: 'Computing',
    stock: 5
  },
  {
    id: '6',
    name: 'Nova Keyboard',
    price: 199,
    description: 'Mechanical precision with programmable magnetic switches.',
    image: 'https://picsum.photos/seed/kb/600/600',
    category: 'Computing',
    stock: 20
  }
];

export const CATEGORIES = ['All', 'Audio', 'Wearables', 'Gaming', 'Computing'];
