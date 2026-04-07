// ================================================================
// data/bestPrice.ts
// Fix cứng: rating, desc, quickInfo, highlights, specs, colors
// Động (fetch từ DB): name, price, image
// ================================================================

export interface QuickInfo {
  value: string;
  label: string;
}

export interface ColorVariant {
  id: number;
  name: string;
  color: string;
  price: number;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface BestPriceStaticData {
  rating: number;
  ratingCount: number;
  desc: string;
  quickInfo: QuickInfo[];
  highlights: string[];
  specs: SpecItem[];
  colors: ColorVariant[];
}

// Key = id trong bảng motorbike
const BEST_PRICE_DATA: Record<number, BestPriceStaticData> = {
  // ─── PHỔ THÔNG ───────────────────────────────────────────────

  // 1. VinFast Evo 200 Lite
  1: {
    rating: 4.5,
    ratingCount: 312,
    desc: "VinFast Evo 200 Lite là lựa chọn lý tưởng cho người mới bắt đầu, thiết kế nhỏ gọn, dễ điều khiển và tiết kiệm chi phí vận hành.",
    quickInfo: [
      { value: "170km", label: "1 lần sạc" },
      { value: "60km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Thiết kế nhỏ gọn, dễ dắt xe trong không gian hẹp",
      "Chi phí sạc điện thấp, tiết kiệm so với xe xăng",
      "Phù hợp cho học sinh, sinh viên di chuyển nội thành",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "60 km/h" },
      { label: "Quãng đường/lần sạc", value: "170 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "78 kg" },
      { label: "Tải trọng tối đa", value: "150 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Đen", color: "#1A1A2E", price: 22000000 },
      { id: 3, name: "Đỏ", color: "#E63946", price: 22500000 },
    ],
  },

  // 2. VinFast Evo 200
  2: {
    rating: 4.6,
    ratingCount: 428,
    desc: "VinFast Evo 200 nâng cấp từ phiên bản Lite với tầm hoạt động cao hơn và cải tiến về hiệu năng, phù hợp di chuyển hằng ngày trong đô thị.",
    quickInfo: [
      { value: "185km", label: "1 lần sạc" },
      { value: "65km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Tầm hoạt động ấn tượng lên đến 185km",
      "Hệ thống phanh ABS tiêu chuẩn an toàn cao",
      "Màn hình LCD hiển thị đầy đủ thông tin",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "65 km/h" },
      { label: "Quãng đường/lần sạc", value: "185 km" },
      { label: "Thời gian sạc đầy", value: "4.5 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "82 kg" },
      { label: "Tải trọng tối đa", value: "150 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Xanh lá", color: "#2D6A4F", price: 22000000 },
      { id: 3, name: "Cam", color: "#F4A261", price: 22500000 },
    ],
  },

  // 3. VinFast Evo Grand Lite
  3: {
    rating: 4.5,
    ratingCount: 256,
    desc: "VinFast Evo Grand Lite mang phong cách sporty trẻ trung với khung xe cứng cáp, thích hợp cho những ai yêu thích vẻ ngoài năng động.",
    quickInfo: [
      { value: "175km", label: "1 lần sạc" },
      { value: "62km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Khung xe gia cường, chắc chắn hơn phiên bản thường",
      "Đèn LED toàn bộ, tiết kiệm điện và sáng hơn",
      "Cốp xe rộng rãi, chứa được mũ bảo hiểm đủ đầu",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "62 km/h" },
      { label: "Quãng đường/lần sạc", value: "175 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "80 kg" },
      { label: "Tải trọng tối đa", value: "150 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Đen", color: "#000000", price: 22000000 },
      { id: 3, name: "Xanh dương", color: "#457B9D", price: 22500000 },
    ],
  },

  // 4. VinFast Evo Grand
  4: {
    rating: 4.6,
    ratingCount: 389,
    desc: "VinFast Evo Grand là phiên bản đầy đủ tính năng trong dòng Evo, nổi bật với thiết kế thanh lịch và trang bị kết nối thông minh.",
    quickInfo: [
      { value: "190km", label: "1 lần sạc" },
      { value: "65km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Kết nối Bluetooth với ứng dụng VinFast",
      "Chống trộm thông minh qua điện thoại",
      "Thiết kế thanh lịch phù hợp nhiều lứa tuổi",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "65 km/h" },
      { label: "Quãng đường/lần sạc", value: "190 km" },
      { label: "Thời gian sạc đầy", value: "4.5 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "83 kg" },
      { label: "Tải trọng tối đa", value: "150 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Hồng be", color: "#C9ADA7", price: 22000000 },
      { id: 3, name: "Đen", color: "#1A1A2E", price: 22500000 },
    ],
  },

  // 5. VinFast Evo Lite Neo
  5: {
    rating: 4.4,
    ratingCount: 198,
    desc: "VinFast Evo Lite Neo phiên bản thế hệ mới với cải tiến về pin và hệ thống điều khiển, mang lại trải nghiệm lái êm ái hơn.",
    quickInfo: [
      { value: "180km", label: "1 lần sạc" },
      { value: "63km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Pin thế hệ mới sạc nhanh hơn 20%",
      "Hệ thống giảm xóc cải tiến, êm ái hơn",
      "Trọng lượng nhẹ, dễ dắt xe",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "63 km/h" },
      { label: "Quãng đường/lần sạc", value: "180 km" },
      { label: "Thời gian sạc đầy", value: "3.5 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "76 kg" },
      { label: "Tải trọng tối đa", value: "150 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Xanh nhạt", color: "#A8DADC", price: 22000000 },
      { id: 3, name: "Vàng", color: "#E9C46A", price: 22500000 },
    ],
  },

  // 6. VinFast Evo Neo
  6: {
    rating: 4.6,
    ratingCount: 341,
    desc: "VinFast Evo Neo thế hệ mới với tầm hoạt động mở rộng và thiết kế hiện đại hơn, là lựa chọn đáng giá trong tầm giá phổ thông.",
    quickInfo: [
      { value: "195km", label: "1 lần sạc" },
      { value: "65km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Tầm hoạt động vượt trội trong phân khúc phổ thông",
      "Màn hình TFT màu hiển thị thông tin trực quan",
      "Cổng sạc USB tích hợp tiện lợi",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "65 km/h" },
      { label: "Quãng đường/lần sạc", value: "195 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "81 kg" },
      { label: "Tải trọng tối đa", value: "150 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Xanh đậm", color: "#264653", price: 22000000 },
      { id: 3, name: "Cam đỏ", color: "#E76F51", price: 22500000 },
    ],
  },

  // 7. VinFast Evo
  7: {
    rating: 4.7,
    ratingCount: 512,
    desc: "VinFast Evo là mẫu xe bán chạy nhất dòng phổ thông, cân bằng hoàn hảo giữa giá cả, tầm hoạt động và thiết kế hiện đại.",
    quickInfo: [
      { value: "200km", label: "1 lần sạc" },
      { value: "68km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Mẫu xe bán chạy nhất phân khúc phổ thông",
      "Bảo hành pin 8 năm hoặc 160.000 km",
      "Hệ thống chống bó cứng phanh ABS",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "68 km/h" },
      { label: "Quãng đường/lần sạc", value: "200 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "84 kg" },
      { label: "Tải trọng tối đa", value: "160 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 22000000 },
      { id: 2, name: "Đen", color: "#1A1A2E", price: 22000000 },
      { id: 3, name: "Đỏ", color: "#C1121F", price: 22500000 },
      { id: 4, name: "Xanh rêu", color: "#606C38", price: 22500000 },
    ],
  },

  // ─── TRUNG CẤP ───────────────────────────────────────────────

  8: {
    rating: 4.8,
    ratingCount: 267,
    desc: "VinFast Feliz 2025 phiên bản nâng cấp với thiết kế hoàn toàn mới, động cơ mạnh mẽ hơn và hệ thống kết nối thông minh thế hệ mới.",
    quickInfo: [
      { value: "210km", label: "1 lần sạc" },
      { value: "79km/h", label: "Tối đa" },
      { value: "LFP+", label: "Pin cao cấp" },
    ],
    highlights: [
      "Thiết kế hoàn toàn mới cho năm 2025",
      "Động cơ nâng cấp, tăng tốc mượt mà hơn",
      "Kết nối 4G, cập nhật phần mềm OTA",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "79 km/h" },
      { label: "Quãng đường/lần sạc", value: "210 km" },
      { label: "Thời gian sạc đầy", value: "3.5 giờ" },
      { label: "Loại pin", value: "LFP+" },
      { label: "Trọng lượng", value: "92 kg" },
      { label: "Tải trọng tối đa", value: "160 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 30000000 },
      { id: 2, name: "Đen", color: "#1A1A2E", price: 30000000 },
      { id: 3, name: "Đỏ", color: "#E63946", price: 30500000 },
      { id: 4, name: "Xanh nhạt", color: "#A8DADC", price: 30500000 },
    ],
  },

  9: {
    rating: 4.7,
    ratingCount: 445,
    desc: "VinFast Feliz II mang phong cách lịch lãm, phù hợp cho dân văn phòng và những ai yêu thích vẻ ngoài sang trọng trong tầm giá hợp lý.",
    quickInfo: [
      { value: "205km", label: "1 lần sạc" },
      { value: "76km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Thiết kế sang trọng, phù hợp môi trường công sở",
      "Yên xe rộng, thoải mái cho hành trình dài",
      "Hệ thống đèn LED định hướng thông minh",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "76 km/h" },
      { label: "Quãng đường/lần sạc", value: "205 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "90 kg" },
      { label: "Tải trọng tối đa", value: "160 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 30000000 },
      { id: 2, name: "Tím xám", color: "#6D6875", price: 30000000 },
      { id: 3, name: "Đen", color: "#1A1A2E", price: 30500000 },
    ],
  },

  10: {
    rating: 4.6,
    ratingCount: 334,
    desc: "VinFast Feliz Lite phiên bản nhẹ nhàng trong dòng Feliz, tối ưu cho di chuyển đô thị hàng ngày với mức giá cạnh tranh.",
    quickInfo: [
      { value: "195km", label: "1 lần sạc" },
      { value: "74km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Trọng lượng nhẹ nhất trong dòng Feliz",
      "Tiêu thụ điện năng hiệu quả",
      "Phù hợp cho cả nam và nữ",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "74 km/h" },
      { label: "Quãng đường/lần sạc", value: "195 km" },
      { label: "Thời gian sạc đầy", value: "3.5 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "86 kg" },
      { label: "Tải trọng tối đa", value: "155 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 30000000 },
      { id: 2, name: "Hồng cam", color: "#FFB4A2", price: 30000000 },
      { id: 3, name: "Xám be", color: "#B7B7A4", price: 30500000 },
    ],
  },

  11: {
    rating: 4.7,
    ratingCount: 289,
    desc: "VinFast Feliz Neo thế hệ mới với công nghệ pin cải tiến và hệ thống lái thông minh, mang lại cảm giác lái tự tin trên mọi địa hình đô thị.",
    quickInfo: [
      { value: "208km", label: "1 lần sạc" },
      { value: "77km/h", label: "Tối đa" },
      { value: "LFP+", label: "Pin cao cấp" },
    ],
    highlights: [
      "Pin LFP+ thế hệ mới, tuổi thọ lên đến 10 năm",
      "Chế độ lái thông minh tự điều chỉnh theo địa hình",
      "Ứng dụng VinFast theo dõi hành trình realtime",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "77 km/h" },
      { label: "Quãng đường/lần sạc", value: "208 km" },
      { label: "Thời gian sạc đầy", value: "3 giờ" },
      { label: "Loại pin", value: "LFP+" },
      { label: "Trọng lượng", value: "89 kg" },
      { label: "Tải trọng tối đa", value: "160 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 30000000 },
      { id: 2, name: "Xanh dương", color: "#457B9D", price: 30000000 },
      { id: 3, name: "Đen", color: "#1A1A2E", price: 30500000 },
      { id: 4, name: "Xanh lá", color: "#2D6A4F", price: 30500000 },
    ],
  },

  12: {
    rating: 4.8,
    ratingCount: 230,
    desc: "VinFast Feliz S là mẫu xe máy điện hiện đại, phù hợp di chuyển hằng ngày trong đô thị với thiết kế thể thao và hiệu năng vượt trội.",
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
      { label: "Tốc độ tối đa", value: "78 km/h" },
      { label: "Quãng đường/lần sạc", value: "198 km" },
      { label: "Thời gian sạc đầy", value: "3.5 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "88 kg" },
      { label: "Tải trọng tối đa", value: "160 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 30000000 },
      { id: 2, name: "Nâu đồng", color: "#C47A4A", price: 30000000 },
      { id: 3, name: "Đen", color: "#1A1A2E", price: 30500000 },
    ],
  },

  13: {
    rating: 4.6,
    ratingCount: 178,
    desc: "VinFast Flazz nổi bật với thiết kế retro độc đáo kết hợp công nghệ hiện đại, phù hợp cho những ai yêu thích phong cách cá tính.",
    quickInfo: [
      { value: "185km", label: "1 lần sạc" },
      { value: "70km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Thiết kế retro độc đáo, nổi bật trên đường phố",
      "Khung xe nhôm nhẹ, bền bỉ",
      "Phù hợp cả nam lẫn nữ yêu thích phong cách vintage",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "70 km/h" },
      { label: "Quãng đường/lần sạc", value: "185 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "85 kg" },
      { label: "Tải trọng tối đa", value: "155 kg" },
    ],
    colors: [
      { id: 1, name: "Kem", color: "#F5CBA7", price: 25000000 },
      { id: 2, name: "Đen", color: "#1A1A2E", price: 25000000 },
      { id: 3, name: "Xanh nhạt", color: "#A9CCE3", price: 25500000 },
    ],
  },

  14: {
    rating: 4.7,
    ratingCount: 356,
    desc: "VinFast Klara Neo phiên bản nâng cấp với tầm hoạt động ấn tượng và thiết kế hiện đại, xứng đáng là lựa chọn hàng đầu phân khúc trung cấp.",
    quickInfo: [
      { value: "215km", label: "1 lần sạc" },
      { value: "80km/h", label: "Tối đa" },
      { value: "LFP+", label: "Pin cao cấp" },
    ],
    highlights: [
      "Tầm hoạt động top đầu phân khúc trung cấp",
      "Hệ thống định vị GPS tích hợp",
      "Khóa thông minh nhận diện chủ xe",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "80 km/h" },
      { label: "Quãng đường/lần sạc", value: "215 km" },
      { label: "Thời gian sạc đầy", value: "3 giờ" },
      { label: "Loại pin", value: "LFP+" },
      { label: "Trọng lượng", value: "93 kg" },
      { label: "Tải trọng tối đa", value: "165 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 39000000 },
      { id: 2, name: "Xanh than", color: "#2C3E50", price: 39000000 },
      { id: 3, name: "Đỏ", color: "#E74C3C", price: 39500000 },
      { id: 4, name: "Xanh lá", color: "#27AE60", price: 39500000 },
    ],
  },

  15: {
    rating: 4.5,
    ratingCount: 223,
    desc: "VinFast Motio thiết kế theo phong cách maxi-scooter, mang lại sự thoải mái tối đa cho hành trình dài với cốp xe siêu rộng.",
    quickInfo: [
      { value: "190km", label: "1 lần sạc" },
      { value: "72km/h", label: "Tối đa" },
      { value: "LFP", label: "Pin an toàn" },
    ],
    highlights: [
      "Cốp xe siêu rộng chứa được 2 mũ fullface",
      "Yên xe rộng thoải mái cho cả người lái và người ngồi sau",
      "Chắn gió lớn bảo vệ người lái tối ưu",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "72 km/h" },
      { label: "Quãng đường/lần sạc", value: "190 km" },
      { label: "Thời gian sạc đầy", value: "4 giờ" },
      { label: "Loại pin", value: "LFP" },
      { label: "Trọng lượng", value: "96 kg" },
      { label: "Tải trọng tối đa", value: "170 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 25000000 },
      { id: 2, name: "Xám", color: "#7F8C8D", price: 25000000 },
      { id: 3, name: "Đen", color: "#1A1A2E", price: 25500000 },
    ],
  },

  // ─── CAO CẤP ─────────────────────────────────────────────────

  16: {
    rating: 4.9,
    ratingCount: 189,
    desc: "VinFast Theon S là đỉnh cao của dòng xe điện VinFast, kết hợp thiết kế sang trọng với công nghệ pin tiên tiến nhất, dành cho những ai không chấp nhận sự tầm thường.",
    quickInfo: [
      { value: "260km", label: "1 lần sạc" },
      { value: "95km/h", label: "Tối đa" },
      { value: "NMC", label: "Pin năng lượng cao" },
    ],
    highlights: [
      "Động cơ PMSM 5000W mạnh mẽ nhất phân khúc",
      "Màn hình TFT 7 inch kết nối toàn diện",
      "Hệ thống treo độc lập cải tiến, êm như ô tô",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "95 km/h" },
      { label: "Quãng đường/lần sạc", value: "260 km" },
      { label: "Thời gian sạc đầy", value: "2.5 giờ" },
      { label: "Loại pin", value: "NMC" },
      { label: "Trọng lượng", value: "108 kg" },
      { label: "Tải trọng tối đa", value: "180 kg" },
    ],
    colors: [
      { id: 1, name: "Xanh than", color: "#2C3E50", price: 69000000 },
      { id: 2, name: "Trắng", color: "#FFFFFF", price: 69000000 },
      { id: 3, name: "Đỏ đô", color: "#8B0000", price: 70000000 },
      { id: 4, name: "Vàng đồng", color: "#B8860B", price: 70000000 },
    ],
  },

  17: {
    rating: 4.8,
    ratingCount: 142,
    desc: "VinFast Vento Neo kết hợp phong cách maxi-scooter cao cấp với công nghệ điện tiên tiến, mang lại trải nghiệm lái đẳng cấp doanh nhân.",
    quickInfo: [
      { value: "240km", label: "1 lần sạc" },
      { value: "90km/h", label: "Tối đa" },
      { value: "NMC", label: "Pin năng lượng cao" },
    ],
    highlights: [
      "Thiết kế maxi-scooter sang trọng đẳng cấp doanh nhân",
      "Hệ thống âm thanh JBL tích hợp",
      "Kết nối Apple CarPlay và Android Auto",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "90 km/h" },
      { label: "Quãng đường/lần sạc", value: "240 km" },
      { label: "Thời gian sạc đầy", value: "3 giờ" },
      { label: "Loại pin", value: "NMC" },
      { label: "Trọng lượng", value: "115 kg" },
      { label: "Tải trọng tối đa", value: "180 kg" },
    ],
    colors: [
      { id: 1, name: "Đen", color: "#1A1A2E", price: 27000000 },
      { id: 2, name: "Trắng", color: "#FFFFFF", price: 27000000 },
      { id: 3, name: "Vàng nâu", color: "#7D6608", price: 27500000 },
    ],
  },

  18: {
    rating: 4.8,
    ratingCount: 167,
    desc: "VinFast Vento S phiên bản Sport với khí động học được tối ưu và hệ thống treo thể thao, mang lại cảm giác lái phấn khích trên mọi cung đường.",
    quickInfo: [
      { value: "235km", label: "1 lần sạc" },
      { value: "92km/h", label: "Tối đa" },
      { value: "NMC", label: "Pin năng lượng cao" },
    ],
    highlights: [
      "Thiết kế khí động học tối ưu giảm lực cản gió",
      "Hệ thống treo thể thao điều chỉnh được",
      "Phanh đĩa CBS thế hệ mới phản hồi tức thì",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "92 km/h" },
      { label: "Quãng đường/lần sạc", value: "235 km" },
      { label: "Thời gian sạc đầy", value: "2.5 giờ" },
      { label: "Loại pin", value: "NMC" },
      { label: "Trọng lượng", value: "105 kg" },
      { label: "Tải trọng tối đa", value: "175 kg" },
    ],
    colors: [
      { id: 1, name: "Đỏ", color: "#C0392B", price: 27000000 },
      { id: 2, name: "Đen", color: "#1A1A2E", price: 27000000 },
      { id: 3, name: "Trắng", color: "#FFFFFF", price: 27500000 },
    ],
  },

  19: {
    rating: 4.7,
    ratingCount: 203,
    desc: "VinFast Vero X là mẫu xe điện off-road đầu tiên của VinFast, được thiết kế để chinh phục mọi địa hình từ đường phố đến đường mòn.",
    quickInfo: [
      { value: "220km", label: "1 lần sạc" },
      { value: "85km/h", label: "Tối đa" },
      { value: "LFP+", label: "Pin bền bỉ" },
    ],
    highlights: [
      "Khung xe gia cường chịu tải off-road",
      "Lốp xe địa hình bám đường tốt",
      "Khoảng sáng gầm xe cao 180mm",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "85 km/h" },
      { label: "Quãng đường/lần sạc", value: "220 km" },
      { label: "Thời gian sạc đầy", value: "3 giờ" },
      { label: "Loại pin", value: "LFP+" },
      { label: "Trọng lượng", value: "102 kg" },
      { label: "Tải trọng tối đa", value: "175 kg" },
    ],
    colors: [
      { id: 1, name: "Xanh lá", color: "#2D6A4F", price: 25000000 },
      { id: 2, name: "Vàng cát", color: "#E9C46A", price: 25000000 },
      { id: 3, name: "Đen", color: "#1A1A2E", price: 25500000 },
    ],
  },

  20: {
    rating: 4.9,
    ratingCount: 98,
    desc: "VinFast Viper là siêu xe máy điện cao cấp nhất, thiết kế thuần thể thao với hiệu năng đỉnh cao dành cho những tay lái đam mê tốc độ.",
    quickInfo: [
      { value: "250km", label: "1 lần sạc" },
      { value: "100km/h", label: "Tối đa" },
      { value: "NMC", label: "Pin năng lượng cao" },
    ],
    highlights: [
      "Tốc độ tối đa 100km/h – nhanh nhất dòng VinFast",
      "Thiết kế full-fairing thuần thể thao",
      "Hệ thống kiểm soát lực kéo TCS chống trượt",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "100 km/h" },
      { label: "Quãng đường/lần sạc", value: "250 km" },
      { label: "Thời gian sạc đầy", value: "2 giờ" },
      { label: "Loại pin", value: "NMC" },
      { label: "Trọng lượng", value: "110 kg" },
      { label: "Tải trọng tối đa", value: "170 kg" },
    ],
    colors: [
      { id: 1, name: "Đỏ", color: "#C0392B", price: 42000000 },
      { id: 2, name: "Đen", color: "#1A1A2E", price: 42000000 },
      { id: 3, name: "Cam", color: "#F39C12", price: 43000000 },
    ],
  },

  21: {
    rating: 4.6,
    ratingCount: 134,
    desc: "VinFast Zgoo thiết kế theo phong cách xe tay ga cao cấp Châu Âu, phù hợp cho những ai tìm kiếm sự sang trọng và tinh tế trong di chuyển hằng ngày.",
    quickInfo: [
      { value: "200km", label: "1 lần sạc" },
      { value: "80km/h", label: "Tối đa" },
      { value: "LFP+", label: "Pin bền bỉ" },
    ],
    highlights: [
      "Phong cách Châu Âu sang trọng, tinh tế",
      "Nội thất cao cấp, yên da thật",
      "Hệ thống đèn Full-LED thông minh tự động",
    ],
    specs: [
      { label: "Tốc độ tối đa", value: "80 km/h" },
      { label: "Quãng đường/lần sạc", value: "200 km" },
      { label: "Thời gian sạc đầy", value: "3 giờ" },
      { label: "Loại pin", value: "LFP+" },
      { label: "Trọng lượng", value: "98 kg" },
      { label: "Tải trọng tối đa", value: "170 kg" },
    ],
    colors: [
      { id: 1, name: "Trắng", color: "#FFFFFF", price: 25000000 },
      { id: 2, name: "Xanh than", color: "#2C3E50", price: 25000000 },
      { id: 3, name: "Tím", color: "#8E44AD", price: 25500000 },
    ],
  },
};

export default BEST_PRICE_DATA;
