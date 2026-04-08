import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { CategoryType } from "../../../../data/categoryProducts";
import BEST_PRICE_DATA from "../../../../data/bestPrice";
import API_URL from "../../../../data/api/apis";
import { HomeStackParamList } from "../../../navigation/types";
import { useTheme } from "../../../../context/themeContext";
import { darkTheme, lightTheme } from "../../../../theme/colors";

/* ── Type API ── */
interface ApiProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
}

const CATEGORY_LABEL: Record<CategoryType, string> = {
  pho_thong: "Phổ Thông",
  trung_cap: "Trung Cấp",
  cao_cap: "Cao Cấp",
  o_to: "Ô Tô",
  phu_kien: "Phụ Kiện",
};

const CATEGORY_SUBTITLE: Record<CategoryType, string> = {
  pho_thong: "Tiết kiệm · Dễ lái · Đô thị",
  trung_cap: "Hiệu năng · Phong cách · Bền bỉ",
  cao_cap: "Sang trọng · Công nghệ · Đỉnh cao",
  o_to: "Không gian · An toàn · Gia đình",
  phu_kien: "Chính hãng · Bảo vệ · Phong cách",
};

const CATEGORY_COLOR: Record<CategoryType, string> = {
  pho_thong: "#FF8C00",
  trung_cap: "#2D6BE4",
  cao_cap: "#9B51E0",
  o_to: "#0CAF60",
  phu_kien: "#E84393",
};

const DB_CATEGORY_MAP: Record<string, CategoryType> = {
  pho_thong: "pho_thong",
  trung_cap: "trung_cap",
  cao_cap: "cao_cap",
};

interface Props {
  category: CategoryType;
}

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

/* ── Skeleton Card ── */
const SkeletonCard = ({ theme }: { theme: "light" | "dark" }) => {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
          shadowOpacity: theme === "dark" ? 0 : 0.06,
          elevation: theme === "dark" ? 0 : 3,
          borderWidth: theme === "dark" ? 1 : 0,
          borderColor: theme === "dark" ? "#334155" : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.imageBox,
          { backgroundColor: theme === "dark" ? "#334155" : "#EBEBEB" },
        ]}
      />
      <View style={styles.cardContent}>
        <View
          style={{
            height: 14,
            width: "80%",
            backgroundColor: theme === "dark" ? "#334155" : "#EBEBEB",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            height: 12,
            width: "50%",
            backgroundColor: theme === "dark" ? "#293548" : "#F2F2F2",
            borderRadius: 6,
            marginBottom: 14,
          }}
        />
        <View
          style={{
            height: 16,
            width: "60%",
            backgroundColor: theme === "dark" ? "#334155" : "#EBEBEB",
            borderRadius: 6,
          }}
        />
      </View>
    </Animated.View>
  );
};

// Encode từng segment của path, giữ nguyên dấu /
const encodeImagePath = (path: string) =>
  path.split("/").map(encodeURIComponent).join("/");

/* ── RatingStars component ── */
const RatingStars = React.memo(
  ({ rating, theme }: { rating: number; theme: "light" | "dark" }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
      <View style={styles.ratingRow}>
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <FontAwesome
              key={`f${i}`}
              name="star"
              size={11}
              color="#F5A623"
              style={i > 0 ? { marginLeft: 2 } : {}}
            />
          ))}

        {half === 1 && (
          <FontAwesome
            name="star-half-empty"
            size={11}
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
              size={11}
              color={theme === "dark" ? "#475569" : "#DDD"}
              style={{ marginLeft: 2 }}
            />
          ))}

        <Text
          style={[
            styles.ratingText,
            { color: theme === "dark" ? "#94A3B8" : "#999" },
          ]}
        >
          {rating.toFixed(1)}
        </Text>
      </View>
    );
  }
);

/* ================= SCREEN ================= */

export default function CategoryBaseScreen({ category }: Props) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const accentColor = CATEGORY_COLOR[category];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      const filtered = data.filter(
        (p: any) => DB_CATEGORY_MAP[p.category] === category
      );
      setProducts(filtered);
    } catch (e) {
      console.log("Lỗi fetch category products:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = useCallback(
    (item: ApiProduct) =>
      navigation.navigate("best_price_detail", { id: item.id }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: ApiProduct }) => (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme === "dark" ? colors.card : "#fff",
            shadowOpacity: theme === "dark" ? 0 : 0.06,
            elevation: theme === "dark" ? 0 : 3,
            borderWidth: theme === "dark" ? 1 : 0,
            borderColor: theme === "dark" ? "#334155" : "transparent",
          },
        ]}
        activeOpacity={0.88}
        onPress={() => handlePress(item)}
      >
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `${API_URL}/images/${encodeImagePath(item.image)}` }}
            style={styles.image}
            fadeDuration={200}
            onError={(e) =>
              console.log("img err", item.id, e.nativeEvent.error)
            }
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>

          <RatingStars
            rating={BEST_PRICE_DATA[item.id]?.rating ?? 4.5}
            theme={theme}
          />

          <View
            style={[
              styles.divider,
              { backgroundColor: theme === "dark" ? "#334155" : "#F0F0F0" },
            ]}
          />

          <View style={styles.cardFooter}>
            <View>
              <Text
                style={[
                  styles.priceLabel,
                  { color: theme === "dark" ? "#94A3B8" : "#BBB" },
                ]}
              >
                Giá từ
              </Text>
              <Text style={[styles.price, { color: accentColor }]}>
                {Number(item.price).toLocaleString("vi-VN")} đ
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.detailBtn, { backgroundColor: accentColor }]}
              onPress={() => handlePress(item)}
              activeOpacity={0.8}
            >
              <FontAwesome name="plus" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handlePress, accentColor, theme, colors]
  );

  const ListHeader = () => (
    <View style={[styles.listHeaderBox, { borderLeftColor: accentColor }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {CATEGORY_LABEL[category]}
      </Text>
      <Text
        style={[
          styles.sectionSubtitle,
          { color: theme === "dark" ? "#94A3B8" : "#999" },
        ]}
      >
        {CATEGORY_SUBTITLE[category]}
      </Text>
      <Text
        style={[
          styles.sectionCount,
          { color: theme === "dark" ? "#64748B" : "#BBB" },
        ]}
      >
        {products.length} mẫu xe
      </Text>
    </View>
  );

  const renderEmpty = () =>
    !loading ? (
      <View style={styles.emptyBox}>
        <FontAwesome
          name="inbox"
          size={52}
          color={theme === "dark" ? "#475569" : "#DDD"}
        />
        <Text
          style={[
            styles.emptyText,
            { color: theme === "dark" ? "#94A3B8" : "#CCC" },
          ]}
        >
          Chưa có sản phẩm trong danh mục này
        </Text>
      </View>
    ) : null;

  const renderSkeleton = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={[styles.columnWrapper, { marginBottom: 16 }]}>
          <SkeletonCard theme={theme} />
          <SkeletonCard theme={theme} />
        </View>
      ))}
    </View>
  );

  const HEADER_H = insets.top + 56;

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? colors.background : "#fff"}
        translucent
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            height: HEADER_H,
            backgroundColor: colors.background,
            borderBottomColor: theme === "dark" ? "#243041" : "#EBEBEB",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme === "dark" ? "#1F2937" : "#F5F5F5",
            },
          ]}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-left"
            size={15}
            color={theme === "dark" ? "#FFF" : "#111"}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {CATEGORY_LABEL[category]}
          </Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 12,
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
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },

  listHeaderBox: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 14,
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF8C00",
    borderRadius: 2,
  },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 3,
    marginBottom: 6,
  },
  sectionCount: { fontSize: 12, color: "#BBB", fontWeight: "500" },

  listContent: { paddingHorizontal: 16 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 16 },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageBox: {
    height: 130,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },

  cardContent: { padding: 12 },
  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    lineHeight: 23,
    marginBottom: 3,
    minHeight: 46,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  ratingText: { fontSize: 13, color: "#999", marginLeft: 4, fontWeight: "500" },
  divider: {
    height: 0.5,
    backgroundColor: "#F0F0F0",
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: "#BBB",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: { fontSize: 16, fontWeight: "800" },
  detailBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyBox: { paddingTop: 80, alignItems: "center", gap: 14 },
  emptyText: {
    fontSize: 14,
    color: "#CCC",
    textAlign: "center",
    lineHeight: 22,
  },
});