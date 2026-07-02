export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface OrderItem {
  label: string;
  amount: number;
}

export interface Order {
  id: string;
  product?: {
    name: string;
  };
  createdAt: string;
  totalAmount: number;
  currency: string;
  status: string;
  subscription?: {
    status: string;
    endedAt?: string;
  };
  items: OrderItem[];
}

export interface OrdersResponse {
  result: {
    items: Order[];
  };
}
