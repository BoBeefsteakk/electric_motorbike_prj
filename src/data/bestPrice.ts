export type BestPriceItem = {
  id: number;
  title: string;
  image: any;
  rating: number;
  ratingCount: number;
  desc: string;

  quickInfo: {
    value: string;
    label: string;
  }[];

  highlights: string[];

  specs: {
    label: string;
    value: string;
  }[];

  colors: {
    id: number;
    label: string;
    color: string;
    price: number;
  }[];
};


export const BEST_PRICE_DATA: Record<number, BestPriceItem> = {
  1: {
    id: 1,
    title: "VinFast Feliz S",
    image: require("../../pic/home/bs1.png"),
    rating: 4.8,
    ratingCount: 230,
    desc:
      "VinFast Feliz S là mẫu xe máy điện hiện đại, phù hợp di chuyển hằng ngày trong đô thị.",

    quickInfo: [
      { value: "198km", label: "1 lần sạc" },
      { value: "78km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],

    highlights: [
      "Vận hành êm ái, không tiếng ồn",
      "Tiết kiệm chi phí nhiên liệu",
      "Thiết kế trẻ trung, hiện đại",
    ],

    specs: [
      { label: "Bảo hành", value: "5 năm" },
      { label: "Thời gian sạc", value: "~6 giờ" },
    ],

    colors: [
      { id: 1, label: "Đỏ", color: "#C0392B", price: 29900000 },
      { id: 2, label: "Xanh đậm", color: "#2C3E50", price: 30500000 },
      { id: 3, label: "Nâu đồng", color: "#B97745", price: 31200000 },
    ],
  },

  2: {
    id: 2,
    title: "VinFast Klara S",
    image: require("../../pic/home/bs2.png"),
    rating: 4.7,
    ratingCount: 180,
    desc:
      "Mẫu xe cân bằng giữa hiệu năng và giá thành, phù hợp người dùng phổ thông.",

    quickInfo: [
      { value: "190km", label: "1 lần sạc" },
      { value: "70km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],

    highlights: [
      "Giá thành hợp lý",
      "Thiết kế thanh lịch",
      "Vận hành ổn định",
    ],

    specs: [
      { label: "Bảo hành", value: "5 năm" },
      { label: "Thời gian sạc", value: "~6.5 giờ" },
    ],

    colors: [
      { id: 1, label: "Trắng", color: "#ECF0F1", price: 36900000 },
      { id: 2, label: "Đen", color: "#2C3E50", price: 37500000 },
    ],
  },

  3: {
    id: 3,
    title: "VinFast Evo 200",
    image: require("../../pic/home/bs3.png"),
    rating: 4.9,
    ratingCount: 260,
    desc:
      "Thiết kế thể thao, động cơ mạnh mẽ, phù hợp người trẻ năng động.",

    quickInfo: [
      { value: "205km", label: "1 lần sạc" },
      { value: "90km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],

    highlights: [
      "Động cơ mạnh",
      "Thiết kế thể thao",
      "Phù hợp di chuyển xa",
    ],

    specs: [
      { label: "Bảo hành", value: "5 năm" },
      { label: "Thời gian sạc", value: "~5.5 giờ" },
    ],

    colors: [
      { id: 1, label: "Đen", color: "#111", price: 56350000 },
      { id: 2, label: "Xanh", color: "#2980B9", price: 56900000 },
    ],
  },
};

export default BEST_PRICE_DATA;
