
export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  arModel?: string;
}

export interface CartItem extends Product {
  quantity: number;
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

export type View = 'home' | 'shop' | 'cart' | 'checkout' | 'profile' | 'admin' | 'order-confirmation' | 'auth' | 'admin-auth' | 'about' | 'contact' | 'settings' | 'services';
