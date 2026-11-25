export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
  images: string[];
  category?: {
    name: string;
  };
  brand?: {
    id?: string;
    name: string;
  };
  ratingsAverage?: number;
  ratingsQuantity?: number;
};

export type ProductApiResponse = {
  data: Product[];
  metadata: {
    currentPage: number;
    numberOfPages: number;
  };
};
