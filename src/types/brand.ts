export type Brand = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

export type BrandApiResponse = {
  data: Brand[];
  metadata: {
    currentPage: number;
    numberOfPages: number;
  };
};

export type BrandDetailsApiResponse = {
  data: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
};
