import React from "react";
import StoreBaseScreen from "./StoreBaseScreen";

const IMG = require("../../../../../pic/home/store1.jpg");

export default function Store4Screen() {
  return (
    <StoreBaseScreen
      storeName="VIN3S VĨNH THÀNH 2"
      city="Đình Công, Hà Nội"
      description="Đại lý VinFast chính hãng"
      coverImage={IMG}
      products={[
        // PHỔ THÔNG
        { id: 1, name: "VinFast Evo 200", price: "22.000.000đ", type: "Phổ thông", image: IMG },
        { id: 2, name: "VinFast Evo Lite", price: "18.500.000đ", type: "Phổ thông", image: IMG },
        { id: 3, name: "VinFast Klara S", price: "36.900.000đ", type: "Phổ thông", image: IMG },

        // TRUNG CẤP
        { id: 4, name: "VinFast Feliz S", price: "30.500.000đ", type: "Trung cấp", image: IMG },
        { id: 5, name: "VinFast Vento S", price: "50.000.000đ", type: "Trung cấp", image: IMG },
        { id: 6, name: "VinFast Klara Pro", price: "45.000.000đ", type: "Trung cấp", image: IMG },

        // CAO CẤP
        { id: 7, name: "VinFast Theon S", price: "63.000.000đ", type: "Cao cấp", image: IMG },
        { id: 8, name: "VinFast Theon Pro", price: "69.000.000đ", type: "Cao cấp", image: IMG },
        { id: 9, name: "VinFast Premium X", price: "75.000.000đ", type: "Cao cấp", image: IMG },
      ]}
    />
  );
}
