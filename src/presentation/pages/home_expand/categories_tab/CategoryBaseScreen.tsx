import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
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
  pho_thong: "#C96442",
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
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

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
      ]),
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          backgroundColor: theme === "dark" ? "#1E1A18" : "#FFFBF7",
          shadowOpacity: theme === "dark" ? 0 : 0.08,
          elevation: theme === "dark" ? 0 : 3,
          borderWidth: 1,
          borderColor: theme === "dark" ? "#4A3930" : "#E8D7CB",
        },
      ]}
    >
      <View
        style={[
          styles.imageBox,
          { backgroundColor: theme === "dark" ? "#332923" : "#EEDFD2" },
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

const encodeImagePath = (path: string) =>
  path.split("/").map(encodeURIComponent).join("/");

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
            { color: theme === "dark" ? "#BDAA9B" : "#8B7163" },
          ]}
        >
          {rating.toFixed(1)}
        </Text>
      </View>
    );
  },
);

export default function CategoryBaseScreen({ category }: Props) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const accentColor = CATEGORY_COLOR[category];
  const pageBg = theme === "dark" ? "#120F0D" : "#F4ECE4";
  const cardBg = theme === "dark" ? "#1E1A18" : "#FFFBF7";
  const cardBorder = theme === "dark" ? "#4A3930" : "#E8D7CB";
  const softBg = theme === "dark" ? "#2A211D" : "#F2E5DC";
  const muted = theme === "dark" ? "#BDAA9B" : "#8B7163";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      const filtered = data.filter(
        (p: any) => DB_CATEGORY_MAP[p.category] === category,
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
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ApiProduct }) => (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            shadowOpacity: theme === "dark" ? 0 : 0.08,
            elevation: theme === "dark" ? 0 : 3,
            borderWidth: 1,
            borderColor: cardBorder,
          },
        ]}
        activeOpacity={0.88}
        onPress={() => handlePress(item)}
      >
        <View style={[styles.imageBox, { backgroundColor: softBg }]}>
          <Image
            source={{ uri: `${API_URL}/images/${encodeImagePath(item.image)}` }}
            style={styles.image}
            fadeDuration={200}
            onError={(e) => console.log("img err", item.id, e.nativeEvent.error)}
          />
        </View>

        <View style={styles.cardContent}>
          <Text
            style={[styles.productName, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <RatingStars
            rating={BEST_PRICE_DATA[item.id]?.rating ?? 4.5}
            theme={theme}
          />

          <View
            style={[
              styles.divider,
              { backgroundColor: theme === "dark" ? "#4A3930" : "#E8D7CB" },
            ]}
          />

          <View style={styles.cardFooter}>
            <View>
              <Text style={[styles.priceLabel, { color: muted }]}>Giá từ</Text>
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
    [handlePress, accentColor, theme, colors, cardBg, cardBorder, softBg, muted],
  );

  const ListHeader = () => (
    <View style={[styles.listHeaderBox, { borderLeftColor: accentColor }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {CATEGORY_LABEL[category]}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: muted }]}>
        {CATEGORY_SUBTITLE[category]}
      </Text>
      <Text
        style={[
          styles.sectionCount,
          { color: theme === "dark" ? "#8E786B" : "#A38A7B" },
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
          color={theme === "dark" ? "#6E5A4E" : "#D8C7BA"}
        />
        <Text style={[styles.emptyText, { color: muted }]}>
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
    <View style={[styles.safe, { backgroundColor: pageBg }]}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={pageBg}
        translucent
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            height: HEADER_H,
            backgroundColor: pageBg,
            borderBottomColor: theme === "dark" ? "#3B2F29" : "#E5D8CC",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            {
              backgroundColor: theme === "dark" ? "#1F2937" : "#F5EAE1",
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
          removeClippedSubviews
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4ECE4" },

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
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  listHeaderBox: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 14,
    paddingLeft: 12,
    paddingTop: 12,
    paddingRight: 14,
    paddingBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF8C00",
    borderRadius: 14,
    backgroundColor: "#FFF7F0",
    borderWidth: 1,
    borderTopColor: "#E8D7CB",
    borderRightColor: "#E8D7CB",
    borderBottomColor: "#E8D7CB",
    shadowColor: "#C58A67",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 3,
    marginBottom: 6,
    fontFamily: SERIF_FONT,
  },
  sectionCount: {
    fontSize: 12,
    color: "#BBB",
    fontWeight: "500",
    fontFamily: SERIF_FONT,
  },

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
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    lineHeight: 19,
    marginBottom: 2,
    minHeight: 20,
    fontFamily: SERIF_FONT,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
    fontWeight: "500",
    fontFamily: SERIF_FONT,
  },
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
    fontFamily: SERIF_FONT,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: { fontSize: 15, fontWeight: "800", fontFamily: SERIF_FONT },
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
    fontFamily: SERIF_FONT,
  },
});
