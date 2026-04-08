import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import API_URL from "../../../../../src/data/api/apis";
import { HomeStackParamList } from "../../../navigation/types";
import { useTheme } from "../../../../context/themeContext";
import { darkTheme, lightTheme } from "../../../../theme/colors";

const { width } = Dimensions.get("window");
const CARD_W = (width - 48) / 2;
const TOP_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 8 : 48;

type ProductType = "Phổ thông" | "Trung cấp" | "Cao cấp";

interface StoreInfo {
  id: number;
  name: string;
  rating: number;
  address: string;
  image: string;
  route?: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const TABS: ProductType[] = ["Phổ thông", "Trung cấp", "Cao cấp"];

const CATEGORY_MAP: Record<string, ProductType> = {
  pho_thong: "Phổ thông",
  trung_cap: "Trung cấp",
  cao_cap: "Cao cấp",
  electric: "Phổ thông",
};

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

const keyById = (item: { id: number }) => String(item.id);

/* ── Skeleton ── */
const SkeletonCard = ({ dark }: { dark: boolean }) => {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.productCard,
        {
          width: CARD_W,
          opacity: anim,
          backgroundColor: dark ? "#1F2937" : "#fff",
          shadowOpacity: dark ? 0 : 0.07,
          elevation: dark ? 0 : 3,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#334155" : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.productImageBox,
          { backgroundColor: dark ? "#334155" : "#EBEBEB" },
        ]}
      />
      <View style={{ padding: 12 }}>
        <View
          style={{
            height: 13,
            width: "80%",
            backgroundColor: dark ? "#334155" : "#EBEBEB",
            borderRadius: 5,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            height: 13,
            width: "55%",
            backgroundColor: dark ? "#293548" : "#F2F2F2",
            borderRadius: 5,
          }}
        />
      </View>
    </Animated.View>
  );
};

export default function StoreBaseScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<any>();
  const { storeId, description } = route.params || {};
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<ProductType>("Phổ thông");
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [160, 220],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [storeRes, productRes] = await Promise.all([
          fetch(`${API_URL}/api/stores/${storeId}`),
          fetch(`${API_URL}/api/products`),
        ]);

        setStore(await storeRes.json());
        setProducts(await productRes.json());
      } catch (e) {
        console.log("Lỗi fetch store:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  const filteredProducts = useMemo(
    () => products.filter((p) => CATEGORY_MAP[p.category] === activeTab),
    [activeTab, products]
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={[
          styles.productCard,
          {
            backgroundColor: colors.card,
            shadowOpacity: isDark ? 0 : 0.07,
            elevation: isDark ? 0 : 3,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#334155" : "transparent",
          },
        ]}
        activeOpacity={0.88}
        onPress={() => navigation.navigate("best_price_detail", { id: item.id })}
      >
        <View style={styles.productImageBox}>
          <Image
            source={{ uri: `${API_URL}/images/${encodeImagePath(item.image)}` }}
            style={styles.productImage}
          />
        </View>

        <View style={styles.productBody}>
          <Text
            style={[styles.productName, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>
              {Number(item.price).toLocaleString("vi-VN")}đ
            </Text>
            <View
              style={[
                styles.detailBtn,
                { backgroundColor: isDark ? "#2563EB" : "#FF8C00" },
              ]}
            >
              <Ionicons name="arrow-forward" size={13} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation, colors, isDark]
  );

  if (loading) {
    return (
      <View style={[styles.loadingBox, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.skeletonHeader,
            {
              height: 260,
              backgroundColor: isDark ? "#1F2937" : "#EBEBEB",
              width: "100%",
            },
          ]}
        />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 16,
            gap: 16,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} dark={isDark} />
          ))}
        </View>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={[styles.loadingBox, { backgroundColor: colors.background }]}>
        <Text style={{ color: isDark ? "#94A3B8" : "#999", fontSize: 15 }}>
          Không tìm thấy cửa hàng
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <Animated.View
        style={[
          styles.floatingHeader,
          {
            opacity: headerOpacity,
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomColor: isDark ? "#243041" : "#EBEBEB",
          },
        ]}
      >
        <Text style={[styles.floatingTitle, { color: colors.text }]} numberOfLines={1}>
          {store.name}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: `${API_URL}${store.image}` }}
            style={styles.coverImage}
          />
          <View
            style={[
              styles.coverOverlay,
              { backgroundColor: isDark ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.25)" },
            ]}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { top: TOP_OFFSET }]}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>

          <View style={styles.coverNameBox}>
            <Text style={styles.coverName}>{store.name}</Text>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              shadowOpacity: isDark ? 0 : 0.06,
              elevation: isDark ? 0 : 3,
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? "#334155" : "transparent",
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 14 }}
            contentContainerStyle={styles.chipsRow}
          >
            <View
              style={[
                styles.chip,
                { backgroundColor: isDark ? "#0F172A" : "#F7F8FA" },
              ]}
            >
              <Ionicons name="star" size={13} color="#F5A623" />
              <Text style={[styles.chipText, { color: colors.text }]}>
                {store.rating}
              </Text>
            </View>

            <View
              style={[
                styles.chip,
                { backgroundColor: isDark ? "#0F172A" : "#F7F8FA" },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={13}
                color={isDark ? "#CBD5E1" : "#555"}
              />
              <Text style={[styles.chipText, { color: colors.text }]}>
                8:00 – 20:00
              </Text>
            </View>

            <View
              style={[
                styles.chip,
                { backgroundColor: isDark ? "#0F172A" : "#F7F8FA" },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={13}
                color={isDark ? "#CBD5E1" : "#555"}
              />
              <Text style={[styles.chipText, { color: colors.text }]}>
                {store.address}
              </Text>
            </View>
          </ScrollView>

          <Text
            style={[
              styles.description,
              { color: isDark ? "#94A3B8" : "#666" },
            ]}
          >
            {description ||
              store.description ||
              "Cửa hàng cung cấp đầy đủ các dòng xe điện VinFast từ phổ thông đến cao cấp, bảo hành chính hãng, hỗ trợ trả góp linh hoạt, đội ngũ tư vấn chuyên nghiệp và dịch vụ hậu mãi uy tín."}
          </Text>
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  {
                    backgroundColor: active
                      ? "#FF8C00"
                      : isDark
                      ? "#1F2937"
                      : "#EFEFEF",
                    borderWidth: isDark && !active ? 1 : 0,
                    borderColor: isDark && !active ? "#334155" : "transparent",
                  },
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: active ? "#fff" : isDark ? "#CBD5E1" : "#777",
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text
          style={[
            styles.productCount,
            { color: isDark ? "#94A3B8" : "#AAA" },
          ]}
        >
          {filteredProducts.length} mẫu xe
        </Text>

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="cube-outline"
              size={48}
              color={isDark ? "#475569" : "#DDD"}
            />
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#94A3B8" : "#CCC" },
              ]}
            >
              Không có sản phẩm
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={keyById}
            renderItem={renderProduct}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        )}

        <View style={{ height: insets.bottom + 32 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  loadingBox: { flex: 1, backgroundColor: "#F7F8FA" },

  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
    alignItems: "center",
  },
  floatingTitle: { fontSize: 16, fontWeight: "700", color: "#111" },

  coverWrapper: { position: "relative", marginBottom: -24 },
  coverImage: { width: "100%", height: 260, resizeMode: "cover" },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  coverNameBox: { position: "absolute", bottom: 16, left: 16, right: 16 },
  coverName: { fontSize: 30, fontWeight: "800", color: "#fff" },

  backBtn: {
    position: "absolute",
    left: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  skeletonHeader: { borderRadius: 0 },

  infoCard: {
    marginHorizontal: 16,
    marginTop: 36,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F7F8FA",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, color: "#444", fontWeight: "600" },

  description: { fontSize: 14, color: "#666", lineHeight: 22 },

  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 20,
    marginBottom: 4,
    justifyContent: "center",
  },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "#EFEFEF",
  },
  tabActive: { backgroundColor: "#FF8C00" },
  tabText: { fontSize: 13, color: "#777", fontWeight: "600" },
  tabTextActive: { color: "#fff" },

  productCount: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "500",
    paddingHorizontal: 20,
    marginBottom: 4,
    marginTop: 6,
  },

  productList: { paddingHorizontal: 16 },

  productCard: {
    width: CARD_W,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  productImageBox: { height: 130, overflow: "hidden" },
  productImage: { width: "100%", height: "100%", resizeMode: "cover" },

  productBody: { padding: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    lineHeight: 20,
    marginBottom: 8,
    minHeight: 40,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: { fontSize: 13, fontWeight: "800", color: "#FF8C00" },
  detailBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBox: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: "#CCC" },
});