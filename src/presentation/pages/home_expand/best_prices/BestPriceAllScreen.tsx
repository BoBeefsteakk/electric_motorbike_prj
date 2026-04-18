import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../../../context/themeContext";
import API_URL from "../../../../data/api/apis";
import BEST_PRICE_DATA from "../../../../data/bestPrice";
import { darkTheme, lightTheme } from "../../../../theme/colors";
import { HomeStackParamList } from "../../../navigation/types";
import AppImage from "../../../components/AppImage";
import { ApiErrorState } from "../../../components/ApiFeedback";
import EmptyState from "../../../components/EmptyState";

type NavProp = NativeStackNavigationProp<HomeStackParamList, "best_price_all">;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const { width } = Dimensions.get("window");
const CARD_W = (width - 48) / 2;
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

const CATEGORY_COLOR: Record<string, string> = {
  pho_thong: "#FF8C00",
  trung_cap: "#2D6BE4",
  cao_cap: "#9B51E0",
};
const CATEGORY_LABEL: Record<string, string> = {
  pho_thong: "Phổ Thông",
  trung_cap: "Trung Cấp",
  cao_cap: "Cao Cấp",
};

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
      ]),
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          width: CARD_W,
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
          styles.imageBox,
          { backgroundColor: dark ? "#111827" : "#EBEBEB" },
        ]}
      />
      <View style={styles.cardBody}>
        <View
          style={{
            height: 14,
            width: "80%",
            backgroundColor: dark ? "#334155" : "#EBEBEB",
            borderRadius: 6,
            marginBottom: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "50%",
            backgroundColor: dark ? "#1E293B" : "#F2F2F2",
            borderRadius: 6,
            marginBottom: 14,
          }}
        />
        <View
          style={{
            height: 16,
            width: "65%",
            backgroundColor: dark ? "#334155" : "#EBEBEB",
            borderRadius: 6,
          }}
        />
      </View>
    </Animated.View>
  );
};

const Stars = ({ rating, dark }: { rating: number; dark: boolean }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array(full)
        .fill(0)
        .map((_, i) => (
          <FontAwesome
            key={`f${i}`}
            name="star"
            size={10}
            color="#F5A623"
            style={i > 0 ? { marginLeft: 2 } : {}}
          />
        ))}
      {half === 1 && (
        <FontAwesome
          name="star-half-empty"
          size={10}
          color="#F5A623"
          style={{ marginLeft: 2 }}
        />
      )}
      {Array(empty)
        .fill(0)
        .map((_, i) => (
          <FontAwesome
            key={`e${i}`}
            name="star-o"
            size={10}
            color={dark ? "#475569" : "#DDD"}
            style={{ marginLeft: 2 }}
          />
        ))}
      <Text
        style={{
          fontSize: 11,
          color: dark ? "#94A3B8" : "#999",
          marginLeft: 4,
          fontFamily: SERIF_FONT,
        }}
      >
        {rating.toFixed(1)}
      </Text>
    </View>
  );
};

export default function BestPriceAllScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/products`);

      if (!res.ok) {
        throw new Error(`fetch products failed: ${res.status}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setProducts([]);
      setError("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const FILTERS = [
    { key: "all", label: "Tất Cả" },
    { key: "pho_thong", label: "Phổ Thông" },
    { key: "trung_cap", label: "Trung Cấp" },
    { key: "cao_cap", label: "Cao Cấp" },
  ];

  const renderCard = useCallback(
    ({ item }: { item: Product }) => {
      const rating = BEST_PRICE_DATA[item.id]?.rating ?? 4.5;
      const accent = CATEGORY_COLOR[item.category] ?? "#FF8C00";
      const catLabel = CATEGORY_LABEL[item.category];

      return (
        <TouchableOpacity
          style={[
            styles.card,
            {
              width: CARD_W,
              backgroundColor: isDark ? colors.card : "#fff",
              shadowOpacity: isDark ? 0 : 0.07,
              elevation: isDark ? 0 : 3,
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? "#334155" : "transparent",
            },
          ]}
          activeOpacity={0.88}
          onPress={() =>
            navigation.navigate("best_price_detail", { id: item.id })
          }
        >
          <View style={styles.imageBox}>
            <AppImage
              uri={`${API_URL}/images/${encodeImagePath(item.image)}`}
              style={styles.image}
              resizeMode="cover"
              dark={isDark}
              fallbackEmoji="🏍️"
              fallbackLabel="Ảnh xe máy chưa sẵn sàng"
            />
            {catLabel && (
              <View
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isDark ? "#1F2937" : accent + "22",
                    borderColor: isDark ? "#475569" : accent + "55",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catText,
                    { color: isDark ? "#E5E7EB" : accent },
                  ]}
                >
                  {catLabel}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardBody}>
            <Text
              style={[styles.cardName, { color: colors.text }]}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <Stars rating={rating} dark={isDark} />

            <View
              style={[
                styles.divider,
                { backgroundColor: isDark ? "#334155" : "#F0F0F0" },
              ]}
            />

            <View style={styles.footer}>
              <View>
                <Text
                  style={[
                    styles.fromLabel,
                    { color: isDark ? "#94A3B8" : "#BBB" },
                  ]}
                >
                  Giá từ
                </Text>
                <Text style={[styles.price, { color: accent }]}>
                  {Number(item.price).toLocaleString("vi-VN")}đ
                </Text>
              </View>

              <View style={[styles.plusBtn, { backgroundColor: accent }]}>
                <FontAwesome name="plus" size={12} color="#fff" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, colors, isDark],
  );

  const ListHeader = () => (
    <>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={(i) => i.key}
        contentContainerStyle={styles.filterBar}
        renderItem={({ item }) => {
          const active = item.key === filter;
          return (
            <TouchableOpacity
              style={[
                styles.filterBtn,
                {
                  backgroundColor: active
                    ? isDark
                      ? "#E5E7EB"
                      : "#111"
                    : isDark
                      ? "#1F2937"
                      : "#EFEFEF",
                  borderWidth: isDark ? 1 : 0,
                  borderColor: isDark ? "#334155" : "transparent",
                },
              ]}
              onPress={() => setFilter(item.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: active
                      ? isDark
                        ? "#111827"
                        : "#fff"
                      : isDark
                        ? "#CBD5E1"
                        : "#777",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.countRow}>
        <Text
          style={[styles.countText, { color: isDark ? "#94A3B8" : "#AAA" }]}
        >
          {filtered.length} mẫu xe
        </Text>
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.safe,
        { paddingTop: insets.top, backgroundColor: pageBg },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: pageBg,
            borderBottomColor: isDark ? "#243041" : "#EBEBEB",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? "#1F2937" : "#F5F5F5" },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-left"
            size={15}
            color={isDark ? "#E5E7EB" : "#111"}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Sản Phẩm Bán Chạy
        </Text>

        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.skeletonGrid}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} dark={isDark} />
          ))}
        </View>
      ) : error && products.length === 0 ? (
        <ApiErrorState
          dark={isDark}
          title="Không tải được dữ liệu"
          description="Danh sách xe máy bán chạy hiện chưa thể tải. Vui lòng thử lại."
          onRetry={fetchProducts}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search-outline"
          dark={isDark}
          title="Không có sản phẩm phù hợp"
          description="Thử đổi bộ lọc để xem thêm các mẫu xe máy khác."
          actionLabel="Xem tất cả"
          onPressAction={() => setFilter("all")}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#C47A4A"
              colors={["#C47A4A"]}
            />
          }
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 32 },
          ]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={renderCard}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={8}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4ECE4" },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  filterBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
    fontFamily: SERIF_FONT,
  },

  countRow: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6 },
  countText: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "500",
    fontFamily: SERIF_FONT,
  },

  list: { paddingHorizontal: 16 },
  row: { justifyContent: "space-between", marginBottom: 16 },

  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageBox: { height: 140, overflow: "hidden" },
  image: { width: "100%", height: "100%" },

  catPill: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  catText: { fontSize: 10, fontWeight: "700", fontFamily: SERIF_FONT },

  cardBody: { padding: 12 },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    lineHeight: 21,
    minHeight: 42,
    marginBottom: 4,
    fontFamily: SERIF_FONT,
  },
  divider: { height: 0.5, backgroundColor: "#F0F0F0", marginVertical: 8 },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  fromLabel: {
    fontSize: 10,
    color: "#BBB",
    marginBottom: 2,
    fontFamily: SERIF_FONT,
  },
  price: { fontSize: 14, fontWeight: "800", fontFamily: SERIF_FONT },
  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
