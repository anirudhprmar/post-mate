export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface Order {
  id: string;
  product: string;
  createdAt: string;
  totalAmount: number;
  currency: string;
  status: string;
  subscription?: {
    status: string;
    endedAt?: string;
  };
  invoiceURL: string;
}

export interface OrdersResponse {
  result: {
    items: Order[];
  };
}
