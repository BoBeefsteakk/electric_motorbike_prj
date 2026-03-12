import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API_URL from "../../../../data/api/apis";
import { HomeStackParamList } from "../../../navigation/types";
import BEST_PRICE_DATA from "../../../../data/bestPrice";


// Encode từng segment của path, giữ nguyên dấu /
// "motorbike/VinFast Evo 200 Lite.jpg" → "motorbike/VinFast%20Evo%20200%20Lite.jpg"
const encodeImagePath = (path: string) =>
  path.split("/").map(encodeURIComponent).join("/");

/* ================= TYPES ================= */

type RouteProps = RouteProp<HomeStackParamList, "best_price_detail">;

interface ProductFromDB {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

/* ================= SCREEN ================= */

export default function BestPriceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { id } = route.params;

  const [product, setProduct] = useState<ProductFromDB | null>(null);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<number>(0);

  // Data fix cứng theo id
  const staticData = BEST_PRICE_DATA[id];

  /* ── Fetch name/price/image từ DB ── */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        // Set màu đầu tiên
        if (staticData?.colors?.length > 0) {
          setSelectedColor(staticData.colors[0].id);
        }
      } catch (e) {
        console.log("Lỗi fetch product:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const selectedVariant = useMemo(
    () => staticData?.colors?.find((c) => c.id === selectedColor),
    [selectedColor, staticData]
  );

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + "đ";

  /* ── Loading ── */
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator
          size="large"
          color="#C47A4A"
          style={{ marginTop: 40 }}
        />
      </View>
    );
  }

  /* ── Không tìm thấy ── */
  if (!product || !staticData) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Không tìm thấy sản phẩm
        </Text>
      </View>
    );
  }

  /* ================= UI ================= */

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết</Text>
        <TouchableOpacity>
          <FontAwesome name="heart-o" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* ===== IMAGE (từ DB) ===== */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `${API_URL}/images/${encodeImagePath(product.image)}` }}
            style={styles.image}
          />
        </View>

        {/* ===== CONTENT ===== */}
        <View style={styles.content}>
          {/* Tên (từ DB) */}
          <Text style={styles.title}>{product.name}</Text>

          {/* Rating (fix cứng) */}
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#F5A623" />
            <Text style={styles.rating}>{staticData.rating}</Text>
            <Text style={styles.ratingCount}>({staticData.ratingCount})</Text>
          </View>

          {/* Mô tả (fix cứng) */}
          <Text style={styles.desc}>{staticData.desc}</Text>

          {/* Quick info (fix cứng) */}
          <View style={styles.quickInfo}>
            {staticData.quickInfo.map((item, index) => (
              <View key={index} style={styles.quickItem}>
                <Text style={styles.quickValue}>{item.value}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Ưu điểm nổi bật (fix cứng) */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionTitle}>Ưu điểm nổi bật</Text>
            {staticData.highlights.map((text, index) => (
              <Text key={index} style={styles.bullet}>• {text}</Text>
            ))}
          </View>

          {/* Thông số (fix cứng) */}
          <View style={styles.specBox}>
            <Text style={styles.sectionTitle}>Thông số chính</Text>
            {staticData.specs.map((item, index) => (
              <View key={index} style={styles.specRow}>
                <Text style={styles.specLabel}>{item.label}</Text>
                <Text style={styles.specValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ===== FOOTER ===== */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Giá bán</Text>
          {/* Giá: ưu tiên giá màu đang chọn, fallback về giá DB */}
          <Text style={styles.price}>
            {formatPrice(selectedVariant?.price ?? product.price)}
          </Text>

          {/* Color picker (fix cứng) */}
          <View style={styles.footerColorRow}>
            {staticData.colors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.footerColorItem,
                  selectedColor === item.id && styles.footerColorItemActive,
                ]}
                onPress={() => setSelectedColor(item.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.footerColorFill,
                    { backgroundColor: item.color },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.buyBtn} activeOpacity={0.85}>
          <Text style={styles.buyText}>ĐĂNG KÝ MUA XE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  imageBox: {
    height: 280,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },

  content: { paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6, marginTop: 20 },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: { marginLeft: 6, fontWeight: "600" },
  ratingCount: { marginLeft: 4, fontSize: 12, color: "#999" },

  desc: { fontSize: 14, color: "#555", lineHeight: 22, marginBottom: 18 },

  quickInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  quickItem: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
  },
  quickValue: { fontWeight: "700", fontSize: 15 },
  quickLabel: { marginTop: 4, fontSize: 12, color: "#888" },

  highlightBox: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  bullet: { fontSize: 14, color: "#555", lineHeight: 22 },

  specBox: { marginBottom: 22 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  specLabel: { color: "#777" },
  specValue: { fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  priceLabel: { fontSize: 12, color: "#888" },
  price: { fontSize: 18, fontWeight: "700", color: "#C0392B" },

  footerColorRow: { flexDirection: "row", marginTop: 10 },
  footerColorItem: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  footerColorItemActive: { borderColor: "#C47A4A" },
  footerColorFill: { width: 22, height: 22, borderRadius: 6 },

  buyBtn: {
    marginLeft: 12,
    backgroundColor: "#C47A4A",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
  },
  buyText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
});