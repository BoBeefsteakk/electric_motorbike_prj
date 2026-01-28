import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BEST_PRICE_DATA from "../../../../data/bestPrice";
import { HomeStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "best_price_all"
>;

export default function BestPriceAllScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sản phẩm bán chạy</Text>

        <View style={{ width: 20 }} />
      </View>

      {/* LIST */}
      <FlatList
        data={Object.values(BEST_PRICE_DATA)}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
                navigation.navigate("best_price_detail", {
                id: item.id,
                })
            }
            >
            <Image source={item.image} style={styles.image} />

            <Text style={styles.title} numberOfLines={2}>
                {item.title}
            </Text>

            <Text style={styles.price}>
                {item.colors[0].price.toLocaleString("vi-VN")}đ
            </Text>
            </TouchableOpacity>
        )}
        />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  list: {
    padding: 16,
  },

  card: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    padding: 12,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C0392B",
  },
});
