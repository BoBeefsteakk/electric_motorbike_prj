import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../context/themeContext";
import API_URL from "../../../data/api/apis";
import { darkTheme, lightTheme } from "../../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";
import { CartToastRef } from "../cart";
import { ApiErrorState, ApiSkeleton } from "../../components/ApiFeedback";
import AppImage from "../../components/AppImage";

const AUTH_USER_KEY = "AUTH_USER";
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

interface Car {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  dong_co_dien: "Xe Điện",
  dong_co_xang: "Xe Xăng",
  dong_xe_dich_vu: "Dịch Vụ",
};

const CATEGORY_COLOR: Record<string, string> = {
  dong_co_dien: "#2563EB",
  dong_co_xang: "#DC2626",
  dong_xe_dich_vu: "#7C3AED",
};

const formatPrice = (p: number) =>
  p >= 1_000_000_000
    ? `${(p / 1_000_000_000).toFixed(2)} tỷ`
    : `${(p / 1_000_000).toFixed(0)} triệu`;

const buildUri = (image: string | null) => {
  if (!image) return null;
  let path = image.trim();
  if (path.startsWith("images/")) path = path.slice(7);
  return `${API_URL}/images/${path.replace(/ /g, "%20")}`;
};

const SPECS = [
  { icon: "shield", label: "An toàn", val: "5 sao" },
  { icon: "cog", label: "Hộp số", val: "Tự động" },
  { icon: "users", label: "Chỗ ngồi", val: "5 chỗ" },
  { icon: "wrench", label: "Bảo hành", val: "3 năm" },
];

export default function CarDetailScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const pageBg = theme === "dark" ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const heartScale = useRef(new Animated.Value(1)).current;

  const fetchCar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/cars/${id}`);

      if (!res.ok) {
        throw new Error(`fetch car failed: ${res.status}`);
      }

      const data = await res.json();

      if (data && typeof data === "object" && data.id) {
        setCar(data);
      } else {
        setCar(null);
      }
    } catch (e) {
      console.log("fetch car error:", e);
      setCar(null);
      setError("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  const handleGoBack = () => {
    if (isClosing) return;
    setIsClosing(true);
    requestAnimationFrame(() => {
      navigation.goBack();
    });
  };

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

  const handleAddToCart = async () => {
    if (!car || addingToCart) return;

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
          productId: `car_${car.id}`,
          name: car.name,
          price: car.price,
          image: buildUri(car.image) ?? "",
          quantity: 1,
          colorId: 0,
          colorName: "Mặc định",
          colorValue: null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        DeviceEventEmitter.emit("cartUpdated");
        CartToastRef.current?.show(`Đã thêm "${car.name}" vào giỏ hàng`);
      } else {
        Alert.alert("Lỗi", data.message || "Không thể thêm vào giỏ hàng");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: pageBg },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: pageBg,
              borderBottomColor: theme === "dark" ? "#243041" : "#EEE",
            },
          ]}
        >
          <View style={styles.headerSideLeft}>
            <TouchableOpacity
              onPress={handleGoBack}
              disabled={isClosing}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              style={[styles.headerBtn, isClosing && styles.headerBtnPressed]}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="chevron-left"
                size={18}
                color={theme === "dark" ? "#FFF" : "#111"}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.headerTitle,
              { color: theme === "dark" ? "#FFF" : "#111" },
            ]}
          >
            Chi Tiết
          </Text>

          <View style={styles.headerSideRight} />
        </View>

        <ApiSkeleton dark={theme === "dark"} variant="detail" count={2} />
      </View>
    );
  }

  if (error && !car) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: pageBg },
        ]}
      >
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          translucent
          backgroundColor="transparent"
        />

        <View
          style={[
            styles.header,
            {
              backgroundColor: pageBg,
              borderBottomColor: theme === "dark" ? "#243041" : "#EEE",
            },
          ]}
        >
          <View style={styles.headerSideLeft}>
            <TouchableOpacity
              onPress={handleGoBack}
              disabled={isClosing}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              style={[styles.headerBtn, isClosing && styles.headerBtnPressed]}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="chevron-left"
                size={18}
                color={theme === "dark" ? "#FFF" : "#111"}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.headerTitle,
              { color: theme === "dark" ? "#FFF" : "#111" },
            ]}
          >
            Chi Tiết
          </Text>

          <View style={styles.headerSideRight} />
        </View>

        <ApiErrorState
          dark={theme === "dark"}
          title="Không tải được dữ liệu"
          description="Thông tin xe hiện chưa thể tải. Vui lòng thử lại."
          onRetry={fetchCar}
        />
      </View>
    );
  }

  if (!car) {
    return (
      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
            backgroundColor: pageBg,
          },
        ]}
      >
        <FontAwesome
          name="exclamation-circle"
          size={40}
          color={theme === "dark" ? "#64748B" : "#DDD"}
        />
        <Text
          style={[
            styles.notFound,
            { color: theme === "dark" ? "#94A3B8" : "#999" },
          ]}
        >
          Không tìm thấy xe
        </Text>
      </View>
    );
  }

  const accent = CATEGORY_COLOR[car.category] ?? "#C8902A";
  const catLabel = CATEGORY_LABEL[car.category] ?? "Ô Tô";
  const uri = buildUri(car.image);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: pageBg },
      ]}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: pageBg,
            borderBottomColor: theme === "dark" ? "#243041" : "#EEE",
          },
        ]}
      >
        <View style={styles.headerSideLeft}>
          <TouchableOpacity
            onPress={handleGoBack}
            disabled={isClosing}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={[styles.headerBtn, isClosing && styles.headerBtnPressed]}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="chevron-left"
              size={18}
              color={theme === "dark" ? "#FFF" : "#111"}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "#FFF" : "#111" },
          ]}
        >
          Chi Tiết
        </Text>

        <View style={styles.headerSideRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() =>
              Share.share({
                message: `Xem xe ${car.name} trên VinFast App!`,
              })
            }
            activeOpacity={0.7}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <FontAwesome
              name="share-alt"
              size={18}
              color={theme === "dark" ? "#FFF" : "#111"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleWishlist}
            activeOpacity={0.7}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <FontAwesome
                name={wishlisted ? "heart" : "heart-o"}
                size={18}
                color={
                  wishlisted ? "#E74C3C" : theme === "dark" ? "#FFF" : "#111"
                }
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 220 }}
        bounces={false}
      >
        <View style={styles.imageBox}>
          <AppImage
            uri={uri}
            style={styles.image}
            resizeMode="cover"
            dark={theme === "dark"}
            fallbackEmoji="🚗"
            fallbackLabel="Ảnh xe chưa sẵn sàng"
          />

          <View style={[styles.catBadge, { backgroundColor: accent }]}>
            <Text style={styles.catBadgeText}>{catLabel}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{car.name}</Text>

          <Text
            style={[
              styles.desc,
              { color: theme === "dark" ? "#94A3B8" : "#666" },
            ]}
          >
            {car.name} là mẫu xe thuộc dòng {catLabel.toLowerCase()} của
            VinFast, thiết kế hiện đại, trang bị công nghệ tiên tiến và cam kết
            an toàn tiêu chuẩn quốc tế.
          </Text>

          <View style={styles.quickInfo}>
            {SPECS.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.quickItem,
                  {
                    borderTopColor: accent,
                    backgroundColor: theme === "dark" ? colors.card : "#FFFFFF",
                  },
                ]}
              >
                <FontAwesome name={s.icon as any} size={16} color={accent} />
                <Text style={[styles.quickValue, { color: accent }]}>
                  {s.val}
                </Text>
                <Text
                  style={[
                    styles.quickLabel,
                    { color: theme === "dark" ? "#94A3B8" : "#888" },
                  ]}
                >
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme === "dark" ? colors.card : "#FFFFFF",
                borderWidth: theme === "dark" ? 1 : 0,
                borderColor: theme === "dark" ? "#334155" : "transparent",
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              ✦ Điểm nổi bật
            </Text>
            {[
              "Thiết kế sang trọng, hiện đại mang phong cách quốc tế",
              "Hệ thống an toàn chủ động tiêu chuẩn 5 sao",
              "Công nghệ kết nối thông minh tích hợp",
              "Chế độ bảo hành và dịch vụ sau bán hàng toàn quốc",
            ].map((text, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: accent }]} />
                <Text
                  style={[
                    styles.bulletText,
                    { color: theme === "dark" ? "#CBD5E1" : "#555" },
                  ]}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.card,
              {
                marginTop: 16,
                backgroundColor: theme === "dark" ? colors.card : "#FFFFFF",
                borderWidth: theme === "dark" ? 1 : 0,
                borderColor: theme === "dark" ? "#334155" : "transparent",
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              ⚙ Thông số chính
            </Text>
            {[
              {
                label: "Loại động cơ",
                value: car.category === "dong_co_dien" ? "Điện" : "Xăng",
              },
              { label: "Hộp số", value: "Tự động" },
              { label: "Số chỗ ngồi", value: "5 chỗ" },
              { label: "Bảo hành", value: "3 năm / 100.000 km" },
              { label: "Tiêu chuẩn khí", value: "Euro 5" },
              { label: "Xuất xứ", value: "Việt Nam" },
            ].map((item, i, arr) => (
              <View
                key={i}
                style={[
                  styles.specRow,
                  i < arr.length - 1 && {
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme === "dark" ? "#334155" : "#EBEBEB",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.specLabel,
                    { color: theme === "dark" ? "#CBD5E1" : "#777" },
                  ]}
                >
                  {item.label}
                </Text>
                <Text style={[styles.specValue, { color: accent }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: theme === "dark" ? colors.card : "#FFFFFF",
            borderTopColor: theme === "dark" ? "#243041" : "#EEE",
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.priceLabel,
              { color: theme === "dark" ? "#94A3B8" : "#999" },
            ]}
          >
            Giá bán
          </Text>
          <Text style={[styles.price, { color: accent }]}>
            {formatPrice(car.price)}
          </Text>
          <Text
            style={[
              styles.priceSub,
              { color: theme === "dark" ? "#64748B" : "#BBB" },
            ]}
          >
            Giá tham khảo · Liên hệ để biết thêm
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.buyBtn,
            { backgroundColor: accent, opacity: addingToCart ? 0.6 : 1 },
          ]}
          activeOpacity={0.85}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome name="shopping-cart" size={14} color="#fff" />
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: {
    color: "#999",
    marginTop: 12,
    fontSize: 15,
    fontFamily: SERIF_FONT,
  },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
    position: "relative",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  headerSideLeft: {
    width: 44,
    alignItems: "flex-start",
    zIndex: 2,
  },
  headerSideRight: {
    width: 96,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  },
  headerBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBtnPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },

  imageBox: { height: 280, overflow: "hidden", position: "relative" },
  image: { width: "100%", height: "100%" },
  catBadge: {
    position: "absolute",
    bottom: 14,
    left: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  catBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  content: { paddingHorizontal: 16 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 20,
    color: "#111",
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
    marginBottom: 20,
  },
  quickItem: {
    width: "23%",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderTopWidth: 3,
    gap: 4,
  },
  quickValue: {
    fontWeight: "800",
    fontSize: 13,
    marginTop: 2,
    fontFamily: SERIF_FONT,
  },
  quickLabel: { fontSize: 10, color: "#888", fontFamily: SERIF_FONT },

  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
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
    marginTop: 6,
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
    paddingVertical: 10,
  },
  specRowBorder: { borderBottomWidth: 0.5, borderBottomColor: "#EBEBEB" },
  specLabel: { color: "#777", fontSize: 14, fontFamily: SERIF_FONT },
  specValue: { fontWeight: "700", fontSize: 14, fontFamily: SERIF_FONT },

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
    backgroundColor: "#FFFFFF",
  },
  priceLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
    fontFamily: SERIF_FONT,
  },
  price: { fontSize: 22, fontWeight: "800", fontFamily: SERIF_FONT },
  priceSub: {
    fontSize: 11,
    color: "#BBB",
    marginTop: 2,
    fontFamily: SERIF_FONT,
  },
  buyBtn: {
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
  },
  buyText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 13,
    fontFamily: SERIF_FONT,
  },
});
