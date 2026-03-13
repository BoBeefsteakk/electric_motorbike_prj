import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API_URL from "../../../../data/api/apis";
import { HomeStackParamList } from "../../../navigation/types";
import BEST_PRICE_DATA from "../../../../data/bestPrice";

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

type RouteProps = RouteProp<HomeStackParamList, "best_price_detail">;
interface ProductFromDB {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  pho_thong: "#FF8C00",
  trung_cap: "#2D6BE4",
  cao_cap: "#9B51E0",
};

export default function BestPriceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState<ProductFromDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [wishlisted, setWishlisted] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const { width: screenWidth } = useWindowDimensions();
  const swipeBack = Gesture.Pan()
    .activeOffsetX([5, 999])
    .failOffsetY([-15, 15])
    .onEnd((e) => {
      if (e.translationX > 50) navigation.goBack();
    })
    .runOnJS(true);

  const staticData = BEST_PRICE_DATA[id];
  const accentColor = product
    ? (CATEGORY_COLOR[product.category] ?? "#FF8C00")
    : "#FF8C00";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (staticData?.colors?.length > 0)
          setSelectedColor(staticData.colors[0].id);
      } catch (e) {
        console.log("Lỗi fetch product:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selectedVariant = useMemo(
    () => staticData?.colors?.find((c) => c.id === selectedColor),
    [selectedColor, staticData],
  );

  const handleWishlist = () => {
    setWishlisted((v) => !v);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleShare = () => {
    Share.share({ message: `Xem xe ${product?.name} trên VinFast App!` });
  };

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  if (!product || !staticData) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <FontAwesome name="exclamation-circle" size={40} color="#DDD" />
        <Text style={{ color: "#999", marginTop: 12, fontSize: 15 }}>
          Không tìm thấy sản phẩm
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={swipeBack}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />

          {/* HEADER */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { backgroundColor: "#E8E8E8" },
              ]}
            >
              <FontAwesome name="chevron-left" size={15} color="#111" />
            </Pressable>
            <Text style={styles.headerTitle}>Chi Tiết</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <FontAwesome name="share-alt" size={15} color="#111" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleWishlist}
                activeOpacity={0.7}
              >
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <FontAwesome
                    name={wishlisted ? "heart" : "heart-o"}
                    size={15}
                    color={wishlisted ? "#E74C3C" : "#111"}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 220 }}
            scrollEventThrottle={16}
            bounces={false}
          >
            {/* IMAGE */}
            <View style={styles.imageBox}>
              <Image
                source={{
                  uri: `${API_URL}/images/${encodeImagePath(product.image)}`,
                }}
                style={styles.image}
              />
            </View>

            <View style={styles.content}>
              {/* Title + rating */}
              <Text style={styles.title}>{product.name}</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <FontAwesome
                    key={s}
                    name={
                      s <= Math.floor(staticData.rating)
                        ? "star"
                        : s - 0.5 <= staticData.rating
                          ? "star-half-empty"
                          : "star-o"
                    }
                    size={14}
                    color="#F5A623"
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text style={styles.ratingNum}>{staticData.rating}</Text>
                <Text style={styles.ratingCount}>
                  ({staticData.ratingCount} đánh giá)
                </Text>
              </View>

              <Text style={styles.desc}>{staticData.desc}</Text>

              {/* Quick info */}
              <View style={styles.quickInfo}>
                {staticData.quickInfo.map((item: any, i: number) => (
                  <View
                    key={i}
                    style={[styles.quickItem, { borderTopColor: accentColor }]}
                  >
                    <Text style={[styles.quickValue, { color: accentColor }]}>
                      {item.value}
                    </Text>
                    <Text style={styles.quickLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>

              {/* Highlights */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>✦ Ưu điểm nổi bật</Text>
                {staticData.highlights.map((text: string, i: number) => (
                  <View key={i} style={styles.bulletRow}>
                    <View
                      style={[
                        styles.bulletDot,
                        { backgroundColor: accentColor },
                      ]}
                    />
                    <Text style={styles.bulletText}>{text}</Text>
                  </View>
                ))}
              </View>

              {/* Specs */}
              <View style={[styles.card, { marginTop: 16 }]}>
                <Text style={styles.cardTitle}>⚙ Thông số chính</Text>
                {staticData.specs.map((item: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.specRow,
                      i < staticData.specs.length - 1 && styles.specRowBorder,
                    ]}
                  >
                    <Text style={styles.specLabel}>{item.label}</Text>
                    <Text style={[styles.specValue, { color: accentColor }]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>Giá bán</Text>
              <Text style={[styles.price, { color: accentColor }]}>
                {formatPrice(selectedVariant?.price ?? product.price)}
              </Text>
              <View style={styles.footerColorRow}>
                {staticData.colors.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.colorSwatch,
                      selectedColor === item.id && {
                        borderColor: accentColor,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedColor(item.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.colorFill,
                        { backgroundColor: item.color },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.buyBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.85}
            >
              <FontAwesome name="tag" size={14} color="#fff" />
              <Text style={styles.buyText}>ĐĂNG KÝ MUA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

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
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  imageBox: { height: 280, overflow: "hidden" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },

  content: { paddingHorizontal: 16 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 20,
    color: "#111",
  },

  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  ratingNum: { fontSize: 14, fontWeight: "700", color: "#333", marginLeft: 8 },
  ratingCount: { fontSize: 13, color: "#999", marginLeft: 4 },

  desc: { fontSize: 14, color: "#666", lineHeight: 22, marginBottom: 20 },

  quickInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickItem: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    borderTopWidth: 3,
  },
  quickValue: { fontWeight: "800", fontSize: 15 },
  quickLabel: { marginTop: 5, fontSize: 12, color: "#888" },

  card: { backgroundColor: "#F8F8F8", borderRadius: 16, padding: 16 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },
  bulletText: { fontSize: 14, color: "#555", lineHeight: 22, flex: 1 },

  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  specRowBorder: { borderBottomWidth: 0.5, borderBottomColor: "#EBEBEB" },
  specLabel: { color: "#777", fontSize: 14 },
  specValue: { fontWeight: "700", fontSize: 14 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  priceLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  price: { fontSize: 20, fontWeight: "800" },
  footerColorRow: { flexDirection: "row", marginTop: 8, gap: 8 },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  colorFill: { width: 20, height: 20, borderRadius: 5 },
  buyBtn: {
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
  },
  buyText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
});
