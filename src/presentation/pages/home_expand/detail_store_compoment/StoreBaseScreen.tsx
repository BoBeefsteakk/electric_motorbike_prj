import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HomeStackParamList } from "../../../navigation/types";

/* ================= CONFIG ================= */

const TOP_OFFSET =
  Platform.OS === "android"
    ? (StatusBar.currentHeight ?? 0) + 8
    : 48;

/* ================= TYPES ================= */

type ProductType = "Phổ thông" | "Trung cấp" | "Cao cấp";

interface Product {
  id: number;
  name: string;
  price: string;
  type: ProductType;
  image: any;
}

interface Props {
  storeName: string;
  city: string;
  description: string;
  coverImage: any;
  products: Product[];
}

const TABS: ProductType[] = ["Phổ thông", "Trung cấp", "Cao cấp"];

/* ================= COMPONENT ================= */

export default function StoreBaseScreen({
  storeName,
  city,
  description,
  coverImage,
  products,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [activeTab, setActiveTab] = useState<ProductType>("Phổ thông");

  const filteredProducts = useMemo(
    () => products.filter((p) => p.type === activeTab),
    [activeTab, products]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== COVER ===== */}
      <View style={styles.coverWrapper}>
        <Image source={coverImage} style={styles.coverImage} />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      {/* ===== STORE INFO ===== */}
      <View style={styles.infoBox}>
        {/* HÀNG 1 */}
        <View style={styles.metaRow}>
          <Ionicons name="star" size={16} color="#FFA500" />
          <Text style={styles.metaText}>4.7</Text>

          <Text style={styles.dot}>•</Text>

          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.metaText}>{city}</Text>

          <Text style={styles.dot}>•</Text>

          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.metaText}>20 phút</Text>
        </View>

        {/* HÀNG 2 */}
        <Text style={styles.storeName}>{storeName}</Text>

        {/* HÀNG 3 */}
        <Text style={styles.description}>
          {description} Cửa hàng cung cấp đầy đủ các dòng xe điện VinFast từ phổ
          thông đến cao cấp, bảo hành chính hãng, hỗ trợ trả góp linh hoạt, đội
          ngũ tư vấn chuyên nghiệp và dịch vụ hậu mãi uy tín.
        </Text>
      </View>

      {/* ===== TABS ===== */}
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, active && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ===== PRODUCT LIST ===== */}
      <View style={styles.productList}>
        {filteredProducts.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ===== COVER ===== */
  coverWrapper: {
    position: "relative",
    marginBottom: -24,
  },
  coverImage: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    position: "absolute",
    top: TOP_OFFSET,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 22,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  /* ===== STORE INFO ===== */
  infoBox: {
    padding: 16,
    paddingTop: 32,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 13,
    color: "#2a2a2a",
    marginLeft: 4,
    fontWeight: "700"
  },
  dot: {
    marginHorizontal: 10,
    color: "#bbb",
  },

  storeName: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },

  /* ===== TABS ===== */
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 14,
    marginBottom: 6,
  },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
  },
  tabActive: {
    backgroundColor: "#ff8a00",
    shadowColor: "#ff8a00",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },

  /* ===== PRODUCTS ===== */
  productList: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: 130,
    borderRadius: 14,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  productPrice: {
    marginTop: 6,
    fontSize: 14,
    color: "#ff8a00",
    fontWeight: "700",
  },
});
