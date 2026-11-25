export type CartItem = {
  id: string;
  productId: string;
  title: string;
  imageCover?: string;
  price: number;
  quantity: number;
};

export type CartDetails = {
  items: CartItem[];
  itemCount: number;
  total: number;
};
