/* ================= HOME STACK ================= */

export type HomeStackParamList = {
  home_main: undefined;

  home_banner_detail: undefined;

  category_special: undefined;
  category_pho_thong: undefined;
  category_trung_cap: undefined;
  category_cao_cap: undefined;
  category_o_to: undefined;
  category_phu_kien: undefined;

  home_store_list: undefined;

  store_detail: {
    storeId: number;
    description?: string;
  };
  
  best_price_all: undefined;
  best_price_detail: {
    id: number;
  };

  news1: undefined;
  news2: undefined;
  news3: undefined;

  car_detail: { id: number };
  accessory_detail: { id: number };
  notifications: undefined;
};

/* ================= TAB ================= */

export type TabParamList = {
  home: undefined;
  search: undefined;
  cart: undefined;
  setting: undefined;
};

/* ================= ROOT ================= */

export type RootStackParamList = {
  auth: undefined;
  inapp: undefined;
  checkout: undefined;
  PaymentSuccess: undefined;
  PaymentMethod: undefined;
  DetailScreen: undefined;
  Order: undefined;
  OrderDetail: { orderId: string };
  Warranty: undefined;
  EditProfile: undefined;
  Address: undefined;
};

