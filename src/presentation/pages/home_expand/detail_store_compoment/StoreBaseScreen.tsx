import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_URL from "../../../../../src/data/api/apis";
import { HomeStackParamList } from "../../../navigation/types";

/* ================= CONFIG ================= */

const TOP_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 48;

/* ================= TYPES ================= */

type ProductType = "Phổ thông" | "Trung cấp" | "Cao cấp";

interface StoreInfo {
  id: number;
  name: string;
  rating: number;
  address: string;
  image: string;
  route: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string; // "electric" từ DB — mình map sang tab
}

interface Props {
  storeId: number;
  description?: string; // override nếu muốn, không bắt buộc
}

const TABS: ProductType[] = ["Phổ thông", "Trung cấp", "Cao cấp"];

// Map category DB → tab hiển thị
// Hiện tại DB chỉ có "electric" → hiển thị ở cả 3 tab
// Bạn có thể thêm category mới vào DB và map ở đây
const CATEGORY_MAP: Record<string, ProductType> = {
  pho_thong: "Phổ thông",
  trung_cap: "Trung cấp",
  cao_cap: "Cao cấp",
  electric: "Phổ thông", // fallback cho data hiện tại
};

const keyById = (item: { id: number }) => String(item.id);

/* ================= COMPONENT ================= */

export default function StoreBaseScreen({ storeId, description }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [activeTab, setActiveTab] = useState<ProductType>("Phổ thông");
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch store info + products song song ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, productRes] = await Promise.all([
          fetch(`${API_URL}/api/stores/${storeId}`),
          fetch(`${API_URL}/api/products`),
        ]);
        const storeData = await storeRes.json();
        const productData = await productRes.json();
        setStore(storeData);
        setProducts(productData);
      } catch (e) {
        console.log("Lỗi fetch store detail:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId]);

  /* ── Lọc sản phẩm theo tab đang chọn ── */
  const filteredProducts = useMemo(
    () => products.filter((p) => CATEGORY_MAP[p.category] === activeTab),
    [activeTab, products]
  );

  /* ── Render product card ── */
  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.productCard}>
        <Image
          source={{ uri: `${API_URL}/images/${item.image}` }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {Number(item.price).toLocaleString("vi-VN")}đ
        </Text>
      </View>
    ),
    []
  );

  /* ── Loading state ── */
  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#ff8a00" />
      </View>
    );
  }

  /* ── Fallback nếu không tìm thấy store ── */
  if (!store) {
    return (
      <View style={styles.loadingBox}>
        <Text style={{ color: "#666" }}>Không tìm thấy cửa hàng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== COVER ===== */}
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: `${API_URL}${store.image}` }}
          style={styles.coverImage}
        />
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
        <View style={styles.metaRow}>
          <Ionicons name="star" size={16} color="#FFA500" />
          <Text style={styles.metaText}>{store.rating}</Text>

          <Text style={styles.dot}>•</Text>

          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.metaText} numberOfLines={1}>
            {store.address}
          </Text>

          <Text style={styles.dot}>•</Text>

          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.metaText}>8:00 - 20:00</Text>
        </View>

        <Text style={styles.storeName}>{store.name}</Text>

        <Text style={styles.description}>
          {description ??
            "Cửa hàng cung cấp đầy đủ các dòng xe điện VinFast từ phổ thông đến cao cấp, bảo hành chính hãng, hỗ trợ trả góp linh hoạt, đội ngũ tư vấn chuyên nghiệp và dịch vụ hậu mãi uy tín."}
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
      {filteredProducts.length === 0 ? (
        <Text style={styles.emptyText}>Không có sản phẩm</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={keyById}
          renderItem={renderProduct}
          numColumns={2}
          scrollEnabled={false} // outer ScrollView quản lý scroll
          contentContainerStyle={styles.productList}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* ===== COVER ===== */
  coverWrapper: { position: "relative", marginBottom: -24 },
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
  infoBox: { padding: 16, paddingTop: 32 },
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
    fontWeight: "700",
  },
  dot: { marginHorizontal: 10, color: "#bbb" },
  storeName: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  description: { fontSize: 14, color: "#666", lineHeight: 22 },

  /* ===== TABS ===== */
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 4,
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
  tabText: { fontSize: 13, color: "#666", fontWeight: "600" },
  tabTextActive: { color: "#fff" },

  /* ===== PRODUCTS ===== */
  productList: { padding: 16 },
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
    resizeMode: "contain",
  },
  productName: { fontSize: 14, fontWeight: "600", color: "#222" },
  productPrice: {
    marginTop: 6,
    fontSize: 14,
    color: "#ff8a00",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 30,
    fontSize: 14,
  },
});