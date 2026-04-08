import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { HomeStackParamList } from "../../../navigation/types";

type NavProp = NativeStackNavigationProp<HomeStackParamList, "best_price_detail">;

/**
 * Factory tạo component redirect tới best_price_detail theo id.
 *
 * Thay thế toàn bộ BestPrices1.tsx → BestPricesN.tsx.
 *
 * Cách dùng trong AppNavigation (hoặc HomeNavigation):
 *
 *   import { makeBestPriceRedirect } from "./BestPriceRedirect";
 *
 *   // Tạo sẵn một lần ở ngoài component để tránh re-create mỗi render:
 *   const BestPrices1  = makeBestPriceRedirect(1);
 *   const BestPrices2  = makeBestPriceRedirect(2);
 *   // ... hoặc dùng vòng lặp để tạo hàng loạt (xem ví dụ bên dưới)
 *
 * Ví dụ dùng vòng lặp để đăng ký tất cả routes cùng lúc:
 *
 *   const BEST_PRICE_IDS = Array.from({ length: 21 }, (_, i) => i + 1);
 *   // Tạo map một lần ở ngoài để tránh re-create
 *   const BestPriceRedirects = Object.fromEntries(
 *     BEST_PRICE_IDS.map(id => [`best_prices_${id}`, makeBestPriceRedirect(id)])
 *   );
 *
 *   // Trong navigator:
 *   {BEST_PRICE_IDS.map(id => (
 *     <HomeStack.Screen
 *       key={`best_prices_${id}`}
 *       name={`best_prices_${id}` as any}
 *       component={BestPriceRedirects[`best_prices_${id}`]}
 *     />
 *   ))}
 */
export function makeBestPriceRedirect(id: number) {
  function BestPriceRedirect() {
    const navigation = useNavigation<NavProp>();

    useEffect(() => {
      navigation.replace("best_price_detail", { id });
    }, []);

    return null;
  }

  // Đặt displayName để debug dễ hơn trong React DevTools
  BestPriceRedirect.displayName = `BestPriceRedirect_${id}`;

  return BestPriceRedirect;
}

// Export sẵn các instance nếu muốn dùng kiểu named import
// (không cần thiết nếu đã dùng vòng lặp ở trên)
export const BestPrices1  = makeBestPriceRedirect(1);
export const BestPrices2  = makeBestPriceRedirect(2);
export const BestPrices3  = makeBestPriceRedirect(3);
export const BestPrices4  = makeBestPriceRedirect(4);
export const BestPrices5  = makeBestPriceRedirect(5);
export const BestPrices6  = makeBestPriceRedirect(6);
export const BestPrices7  = makeBestPriceRedirect(7);
export const BestPrices8  = makeBestPriceRedirect(8);
export const BestPrices9  = makeBestPriceRedirect(9);
export const BestPrices10 = makeBestPriceRedirect(10);
export const BestPrices11 = makeBestPriceRedirect(11);
export const BestPrices12 = makeBestPriceRedirect(12);
export const BestPrices13 = makeBestPriceRedirect(13);
export const BestPrices14 = makeBestPriceRedirect(14);
export const BestPrices15 = makeBestPriceRedirect(15);
export const BestPrices16 = makeBestPriceRedirect(16);
export const BestPrices17 = makeBestPriceRedirect(17);
export const BestPrices18 = makeBestPriceRedirect(18);
export const BestPrices19 = makeBestPriceRedirect(19);
export const BestPrices20 = makeBestPriceRedirect(20);
export const BestPrices21 = makeBestPriceRedirect(21);