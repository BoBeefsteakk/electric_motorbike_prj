import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";
import { useTheme } from "../../../../context/themeContext";
import API_URL from "../../../../data/api/apis";
import BEST_PRICE_DATA from "../../../../data/bestPrice";
import { darkTheme, lightTheme } from "../../../../theme/colors";
import { HomeStackParamList } from "../../../navigation/types";
import { CartToastRef } from "../../cart";
import AppImage from "../../../components/AppImage";
import { ApiErrorState, ApiSkeleton } from "../../../components/ApiFeedback";

const AUTH_USER_KEY = "AUTH_USER";
const encodeImagePath = (path: string) =>
  path.split("/").map(encodeURIComponent).join("/");
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type RouteProps = RouteProp<HomeStackParamList, "best_price_detail">;

interface ProductFromDB {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function BestPriceDetailScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState<ProductFromDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const staticData = BEST_PRICE_DATA[id as number];

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/products/${id}`);

      if (!res.ok) {
        throw new Error(`fetch product failed: ${res.status}`);
      }

      const data = await res.json();

      if (data && typeof data === "object" && data.id) {
        setProduct(data);
        if (staticData?.colors?.length > 0) {
          setSelectedColor(staticData.colors[0].id);
        }
      } else {
        setProduct(null);
      }
    } catch (e) {
      console.log("Lỗi fetch product:", e);
      setProduct(null);
      setError("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [id, staticData]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const selectedVariant = useMemo(
    () => staticData?.colors?.find((c: any) => c?.id === selectedColor),
    [selectedColor, staticData],
  );

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;

    setAddingToCart(true);

    try {
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.account || "user_test_123";

      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: String(product.id),
          name: product.name,
          price: selectedVariant?.price ?? product.price,
          image: encodeImagePath(product.image),
          quantity: 1,
          colorId: selectedVariant?.id ?? null,
          colorName: selectedVariant?.name ?? "Chưa chọn",
          colorValue: selectedVariant?.color ?? null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        CartToastRef.current?.show(`Đã thêm "${product.name}" vào giỏ hàng`);
        DeviceEventEmitter.emit("cartUpdated");
      } else {
        Alert.alert("Lỗi", data.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (e) {
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: pageBg,
          },
        ]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={pageBg}
        />
        <View
          style={[
            styles.header,
            {
              borderBottomColor: isDark ? "#334155" : "#EEE",
              backgroundColor: pageBg,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="chevron-left"
              size={18}
              color={isDark ? "#E5E7EB" : "#111"}
            />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Chi Tiết
          </Text>

          <View style={styles.headerBtn} />
        </View>

        <ApiSkeleton dark={isDark} variant="detail" count={2} />
      </View>
    );
  }

  if (error && !product) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: pageBg,
          },
        ]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={pageBg}
        />

        <View
          style={[
            styles.header,
            {
              borderBottomColor: isDark ? "#334155" : "#EEE",
              backgroundColor: pageBg,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="chevron-left"
              size={18}
              color={isDark ? "#E5E7EB" : "#111"}
            />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Chi Tiết
          </Text>

          <View style={styles.headerBtn} />
        </View>

        <ApiErrorState
          dark={isDark}
          title="Không tải được dữ liệu"
          description="Thông tin xe máy hiện chưa thể tải. Vui lòng thử lại."
          onRetry={fetchProduct}
        />
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
            backgroundColor: pageBg,
          },
        ]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={pageBg}
        />
        <Ionicons
          name="alert-circle-outline"
          size={52}
          color={isDark ? "#475569" : "#DDD"}
        />
        <Text
          style={{
            marginTop: 12,
            color: isDark ? "#94A3B8" : "#AAA",
            fontSize: 15,
            fontFamily: SERIF_FONT,
          }}
        >
          Không tìm thấy sản phẩm
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: pageBg,
        },
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
            borderBottomColor: isDark ? "#334155" : "#EEE",
            backgroundColor: pageBg,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={styles.headerBtn}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-left"
            size={18}
            color={isDark ? "#E5E7EB" : "#111"}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Chi Tiết
        </Text>

        <TouchableOpacity
          style={styles.headerBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="heart-o"
            size={20}
            color={isDark ? "#E5E7EB" : "#111"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <View
          style={[
            styles.imageBox,
            { backgroundColor: isDark ? "#1F2937" : "#F5EAE1" },
          ]}
        >
          <AppImage
            uri={`${API_URL}/images/${encodeImagePath(product.image)}`}
            style={styles.image}
            resizeMode="cover"
            dark={isDark}
            fallbackEmoji="🏍️"
            fallbackLabel="Ảnh xe máy chưa sẵn sàng"
          />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <FontAwesome
                key={s}
                name={s <= Math.round(staticData.rating) ? "star" : "star-o"}
                size={14}
                color="#F5A623"
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={[styles.rating, { color: colors.text }]}>
              {staticData.rating}
            </Text>
            <Text
              style={[
                styles.ratingCount,
                { color: isDark ? "#94A3B8" : "#AAA" },
              ]}
            >
              ({staticData.ratingCount} đánh giá)
            </Text>
          </View>

          <Text style={[styles.desc, { color: isDark ? "#CBD5E1" : "#666" }]}>
            {staticData.desc}
          </Text>

          <View style={styles.quickInfo}>
            {staticData.quickInfo.map((item: any, i: number) => (
              <View
                key={i}
                style={[
                  styles.quickItem,
                  {
                    backgroundColor: isDark ? "#1F2937" : "#FFF8F2",
                    borderColor: isDark ? "#334155" : "#E8D7CB",
                  },
                ]}
              >
                <Text style={[styles.quickValue, { color: colors.text }]}>
                  {item.value}
                </Text>
                <Text
                  style={[
                    styles.quickLabel,
                    { color: isDark ? "#94A3B8" : "#999" },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionBox}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Ưu điểm nổi bật
            </Text>
            {staticData.highlights.map((text: string, i: number) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text
                  style={[
                    styles.bulletText,
                    { color: isDark ? "#CBD5E1" : "#555" },
                  ]}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionBox}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Thông số chính
            </Text>
            <View
              style={[
                styles.specTable,
                {
                  backgroundColor: isDark ? "#181311" : "#FFFDF9",
                  borderColor: isDark ? "#3B2F29" : "#E8D7CB",
                },
              ]}
            >
              <View
                style={[
                  styles.specHeaderRow,
                  {
                    backgroundColor: isDark ? "#221B18" : "#F8EEE6",
                    borderBottomColor: isDark ? "#3B2F29" : "#E8D7CB",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.specHeaderText,
                    { color: isDark ? "#E5E7EB" : "#6B4F3C" },
                  ]}
                >
                  Thông số
                </Text>
                <Text
                  style={[
                    styles.specHeaderText,
                    { color: isDark ? "#E5E7EB" : "#6B4F3C" },
                  ]}
                >
                  Giá trị
                </Text>
              </View>

              {staticData.specs.map((item: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.specRow,
                    {
                      backgroundColor:
                        i % 2 === 0
                          ? isDark
                            ? "#1F2937"
                            : "#FFF8F2"
                          : isDark
                            ? "#181311"
                            : "#FFFDF9",
                      borderBottomWidth:
                        i === staticData.specs.length - 1 ? 0 : 1,
                      borderBottomColor: isDark ? "#2F3B4A" : "#F0E2D6",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.specLabel,
                      { color: isDark ? "#94A3B8" : "#7C6557" },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 12,
            borderTopColor: isDark ? "#334155" : "#EEE",
            backgroundColor: pageBg,
            shadowOpacity: isDark ? 0 : 0.06,
            elevation: isDark ? 0 : 12,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.priceLabel, { color: isDark ? "#94A3B8" : "#AAA" }]}
          >
            Giá bán
          </Text>
          <Text style={styles.price}>
            {formatPrice(selectedVariant?.price ?? product.price)}
          </Text>

          <View style={styles.colorRow}>
            {(staticData.colors ?? [])
              .filter((c: any) => c != null)
              .map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.colorItem,
                    {
                      borderColor:
                        selectedColor === item.id
                          ? "#C47A4A"
                          : isDark
                            ? "#475569"
                            : "#EEE",
                    },
                    selectedColor === item.id && styles.colorItemActive,
                  ]}
                  onPress={() => setSelectedColor(item.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[styles.colorFill, { backgroundColor: item.color }]}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.buyBtn, addingToCart && { opacity: 0.6 }]}
          activeOpacity={0.85}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.buyText}>ĐẶT MUA</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4ECE4" },

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
  headerBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  imageBox: { height: 280, backgroundColor: "#F5F5F5" },
  image: { width: "100%", height: "100%" },

  content: { paddingHorizontal: 16, paddingTop: 20 },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
    fontFamily: SERIF_FONT,
  },

  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  rating: {
    marginLeft: 8,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 12,
    color: "#AAA",
    fontFamily: SERIF_FONT,
  },

  desc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: SERIF_FONT,
  },

  quickInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickItem: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  quickValue: {
    fontWeight: "800",
    fontSize: 15,
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  quickLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#999",
    fontFamily: SERIF_FONT,
  },

  sectionBox: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
    fontFamily: SERIF_FONT,
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
    backgroundColor: "#C47A4A",
    marginTop: 7,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    flex: 1,
    fontFamily: SERIF_FONT,
  },

  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  specTable: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  specHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  specHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },
  specLabel: {
    color: "#888",
    fontSize: 13,
    fontFamily: SERIF_FONT,
    width: "48%",
  },
  specValue: {
    fontWeight: "700",
    color: "#111",
    fontSize: 13,
    fontFamily: SERIF_FONT,
    width: "48%",
    textAlign: "right",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  priceLabel: { fontSize: 11, color: "#AAA", fontFamily: SERIF_FONT },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#C0392B",
    marginBottom: 6,
    fontFamily: SERIF_FONT,
  },

  colorRow: { flexDirection: "row", gap: 8 },
  colorItem: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  colorItemActive: { borderColor: "#C47A4A", borderWidth: 2.5 },
  colorFill: { width: 20, height: 20, borderRadius: 6 },

  buyBtn: {
    marginLeft: 16,
    backgroundColor: "#C47A4A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
  },
  buyText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: SERIF_FONT,
  },
});
