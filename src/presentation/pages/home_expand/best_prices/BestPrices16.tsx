import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/types";
 
type NavProp = NativeStackNavigationProp<HomeStackParamList, "best_price_detail">;
 
export default function BestPrices16() {
  const navigation = useNavigation<NavProp>();
  useEffect(() => {
    navigation.replace("best_price_detail", { id: 16 });
  }, []);
  return null;
}
 