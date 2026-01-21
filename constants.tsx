
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aether Pods Pro',
    price: 299,
    description: 'Next-generation neural audio experience with active spatial dampening.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
    category: 'Audio',
    stock: 25,
    arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    techSpecs: {
      "Polygon Count": "42.5k Tris",
      "Texture Res": "4K PBR",
      "Mesh Density": "High",
      "Physics Link": "Neural Stream v2",
      "File Size": "8.4 MB"
    },
    variants: [
      {
        name: 'Chassis Finish',
        options: [
          { id: 'v1-obsidian', name: 'Obsidian Black', priceModifier: 0 },
          { id: 'v1-titanium', name: 'Titanium Silver', priceModifier: 20 },
          { id: 'v1-neon', name: 'Neon Pulse (Limited)', priceModifier: 50, stockModifier: -20 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Luminal Watch X',
    price: 499,
    description: 'Holographic display wearable with integrated health biometric sensors.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    category: 'Wearables',
    stock: 12
  },
  {
    id: '3',
    name: 'Zenith VR Deck',
    price: 899,
    description: 'High-fidelity virtual reality interface for total digital immersion.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop',
    category: 'Gaming',
    stock: 8,
    arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    techSpecs: {
      "Polygon Count": "128k Tris",
      "Texture Res": "8K Neural Latency",
      "AR Mode": "WebXR Native",
      "Weight": "420g Synthetic",
      "Refresh Rate": "240Hz Virtual"
    }
  },
  {
    id: '4',
    name: 'Quantum Lens 2.0',
    price: 150,
    description: 'Augmented reality glasses that blend your world with infinite data.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
    category: 'Wearables',
    stock: 45,
    isNew: true
  },
  {
    id: '5',
    name: 'Titanium Slate',
    price: 1299,
    description: 'Ultra-thin computational surface with liquid crystal retina display.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop',
    category: 'Computing',
    stock: 5
  },
  {
    id: '6',
    name: 'Nova Keyboard',
    price: 199,
    description: 'Mechanical precision with programmable magnetic switches.',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
    category: 'Computing',
    stock: 20
  },
  {
    id: '7',
    name: 'Onyx Controller',
    price: 79,
    description: 'Ergonomic input device with haptic neural feedback.',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35802446?q=80&w=1000&auto=format&fit=crop',
    category: 'Gaming',
    stock: 15,
    isNew: true
  },
  {
    id: '8',
    name: 'Flux SSD 4TB',
    price: 349,
    description: 'Light-speed data storage with quantum error correction.',
    image: 'https://images.unsplash.com/photo-1597872200370-499df5d44d7d?q=80&w=1000&auto=format&fit=crop',
    category: 'Computing',
    stock: 30,
    isNew: true,
    variants: [
      {
        name: 'Storage Density',
        options: [
          { id: 'v8-4tb', name: '4 Terabytes', priceModifier: 0 },
          { id: 'v8-8tb', name: '8 Terabytes', priceModifier: 250, stockModifier: -10 },
          { id: 'v8-16tb', name: '16 Terabytes (Quantum Core)', priceModifier: 600, stockModifier: -25 }
        ]
      }
    ]
  }
];

export const CATEGORIES = ['All', 'Audio', 'Wearables', 'Gaming', 'Computing'];
