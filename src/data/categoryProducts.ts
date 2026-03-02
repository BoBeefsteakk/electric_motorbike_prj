export type CategoryType =
  | "pho_thong"
  | "trung_cap"
  | "cao_cap"
  | "o_to"
  | "phu_kien";

export interface ProductItem {
  id: number;
  title: string;
  image: any;
  price: number;
  rating: number;
  condition: "New" | "Used";
}

export const CATEGORY_PRODUCTS: Record<CategoryType, ProductItem[]> = {
  pho_thong: [
    {
      id: 1,
      title: "Xe máy phổ thông A",
      image: require("../../pic/home/bs1.png"),
      price: 22000000,
      rating: 4.5,
      condition: "New",
    },
    {
      id: 2,
      title: "Xe máy phổ thông B",
      image: require("../../pic/home/bs1.png"),
      price: 25000000,
      rating: 4.3,
      condition: "New",
    },
    {
      id: 3,
      title: "Xe máy phổ thông C",
      image: require("../../pic/home/bs1.png"),
      price: 28000000,
      rating: 4.7,
      condition: "New",
    },
    {
      id: 4,
      title: "Xe máy phổ thông D",
      image: require("../../pic/home/bs1.png"),
      price: 32000000,
      rating: 4.6           ,
      condition: "New",
    },
    {
      id: 5,
      title: "Xe máy phổ thông E    ",
      image: require("../../pic/home/bs1.png"),
      price: 22000000,
      rating: 4.5,
      condition: "New",
    },
  ],

  trung_cap: [
    {
      id: 6,
      title: "Xe máy trung cấp B",
      image: require("../../pic/home/bs1.png"),
      price: 42000000,
      rating: 4.6,
      condition: "New",
    },
  ],

  cao_cap: [
    {
      id: 7,
      title: "Xe máy cao cấp C",
      image: require("../../pic/home/bs1.png"),
      price: 82000000,
      rating: 4.9,
      condition: "New",
    },
  ],

  o_to: [
    {
      id: 8,
      title: "VinFast VF8",
      image: require("../../pic/home/bs1.png"),
      price: 1200000000,
      rating: 4.8,
      condition: "New",
    },
  ],

  phu_kien: [
    {
      id: 9,
      title: "Mũ bảo hiểm cao cấp",
      image: require("../../pic/home/bs1.png"),
      price: 1500000,
      rating: 4.4,
      condition: "New",
    },
  ],
};
