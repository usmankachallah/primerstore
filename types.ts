
export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface ProductVariantOption {
  id: string;
  name: string;
  priceModifier?: number;
  stockModifier?: number;
}

export interface ProductVariant {
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  isNew?: boolean;
  arModel?: string;
  techSpecs?: Record<string, string>;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  customerName: string;
  address: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  savedAddresses: string[];
  isAdmin: boolean;
}

export type View = 'home' | 'shop' | 'cart' | 'checkout' | 'profile' | 'admin' | 'order-confirmation' | 'auth' | 'admin-auth' | 'about' | 'contact' | 'settings' | 'services' | 'faq' | 'support-ticket' | 'roadmap' | 'sync-terms' | 'biometric-policy';
