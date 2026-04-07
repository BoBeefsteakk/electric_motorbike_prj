import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
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
import API_URL from "../../../data/api/apis";

interface Car {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  dong_co_dien:    "Xe Điện",
  dong_co_xang:    "Xe Xăng",
  dong_xe_dich_vu: "Dịch Vụ",
};
const CATEGORY_COLOR: Record<string, string> = {
  dong_co_dien:    "#2563EB",
  dong_co_xang:    "#DC2626",
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
  { icon: "shield", label: "An toàn",  val: "5 sao"   },
  { icon: "cog",    label: "Hộp số",   val: "Tự động" },
  { icon: "users",  label: "Chỗ ngồi", val: "5 chỗ"   },
  { icon: "wrench", label: "Bảo hành", val: "3 năm"   },
];

export default function CarDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const { id }     = route.params;
  const insets     = useSafeAreaInsets();

  const [car, setCar]               = useState<Car | null>(null);
  const [loading, setLoading]       = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch(`${API_URL}/api/cars/${id}`)
      .then((r) => r.json())
      .then(setCar)
      .catch((e) => console.log("fetch car error:", e))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWishlist = () => {
    setWishlisted((v) => !v);
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1,   duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleAddToCart = async () => {
    if (!car || addingToCart) return;
    setAddingToCart(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:    "user_test_123",
          productId: `car_${car.id}`,
          name:      car.name,
          price:     car.price,
          image:     buildUri(car.image) ?? "",
          quantity:  1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (Platform.OS === "android") ToastAndroid.show("Đã thêm vào giỏ hàng!", ToastAndroid.SHORT);
        else Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
      } else {
        Alert.alert("Lỗi", data.message || "Không thể thêm vào giỏ hàng");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <View style={[styles.center, { paddingTop: insets.top }]}>
      <ActivityIndicator size="large" color="#C8902A" />
    </View>
  );

  if (!car) return (
    <View style={[styles.center, { paddingTop: insets.top }]}>
      <FontAwesome name="exclamation-circle" size={40} color="#DDD" />
      <Text style={styles.notFound}>Không tìm thấy xe</Text>
    </View>
  );

  const accent   = CATEGORY_COLOR[car.category] ?? "#C8902A";
  const catLabel = CATEGORY_LABEL[car.category] ?? "Ô Tô";
  const uri      = buildUri(car.image);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <FontAwesome name="chevron-left" size={15} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Chi Tiết</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => Share.share({ message: `Xem xe ${car.name} trên VinFast App!` })}>
            <FontAwesome name="share-alt" size={15} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleWishlist}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <FontAwesome name={wishlisted ? "heart" : "heart-o"} size={15} color={wishlisted ? "#E74C3C" : "#111"} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 220 }} bounces={false}>
        {/* Ảnh */}
        <View style={styles.imageBox}>
          {uri
            ? <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            : <View style={[styles.image, styles.imageFallback]}>
                <Text style={{ fontSize: 60 }}>🚗</Text>
              </View>
          }
          {/* Category badge */}
          <View style={[styles.catBadge, { backgroundColor: accent }]}>
            <Text style={styles.catBadgeText}>{catLabel}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Tên */}
          <Text style={styles.title}>{car.name}</Text>

          {/* Mô tả */}
          <Text style={styles.desc}>
            {car.name} là mẫu xe thuộc dòng {catLabel.toLowerCase()} của VinFast, thiết kế hiện đại, trang bị công nghệ tiên tiến và cam kết an toàn tiêu chuẩn quốc tế.
          </Text>

          {/* Quick specs */}
          <View style={styles.quickInfo}>
            {SPECS.map((s, i) => (
              <View key={i} style={[styles.quickItem, { borderTopColor: accent }]}>
                <FontAwesome name={s.icon as any} size={16} color={accent} />
                <Text style={[styles.quickValue, { color: accent }]}>{s.val}</Text>
                <Text style={styles.quickLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Highlights */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✦ Điểm nổi bật</Text>
            {[
              "Thiết kế sang trọng, hiện đại mang phong cách quốc tế",
              "Hệ thống an toàn chủ động tiêu chuẩn 5 sao",
              "Công nghệ kết nối thông minh tích hợp",
              "Chế độ bảo hành và dịch vụ sau bán hàng toàn quốc",
            ].map((text, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: accent }]} />
                <Text style={styles.bulletText}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Specs table */}
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.cardTitle}>⚙ Thông số chính</Text>
            {[
              { label: "Loại động cơ",    value: car.category === "dong_co_dien" ? "Điện" : "Xăng" },
              { label: "Hộp số",          value: "Tự động"  },
              { label: "Số chỗ ngồi",     value: "5 chỗ"    },
              { label: "Bảo hành",        value: "3 năm / 100.000 km" },
              { label: "Tiêu chuẩn khí",  value: "Euro 5"   },
              { label: "Xuất xứ",         value: "Việt Nam" },
            ].map((item, i, arr) => (
              <View key={i} style={[styles.specRow, i < arr.length - 1 && styles.specRowBorder]}>
                <Text style={styles.specLabel}>{item.label}</Text>
                <Text style={[styles.specValue, { color: accent }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Giá bán</Text>
          <Text style={[styles.price, { color: accent }]}>{formatPrice(car.price)}</Text>
          <Text style={styles.priceSub}>Giá tham khảo · Liên hệ để biết thêm</Text>
        </View>
        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: accent, opacity: addingToCart ? 0.6 : 1 }]}
          activeOpacity={0.85}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart
            ? <ActivityIndicator size="small" color="#fff" />
            : <>
                <FontAwesome name="shopping-cart" size={14} color="#fff" />
                <Text style={styles.buyText}>ĐẶT MUA</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { color: "#999", marginTop: 12, fontSize: 15 },

  header: {
    height: 56, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderBottomWidth: 0.5, borderBottomColor: "#EEE", backgroundColor: "#FFF",
  },
  headerTitle: { position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 16, fontWeight: "700", color: "#111" },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },

  imageBox: { height: 280, overflow: "hidden", position: "relative" },
  image:    { width: "100%", height: "100%" },
  imageFallback: { backgroundColor: "#F0ECE8", justifyContent: "center", alignItems: "center" },
  catBadge: { position: "absolute", bottom: 14, left: 16, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  catBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  content: { paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8, marginTop: 20, color: "#111" },
  desc:  { fontSize: 14, color: "#666", lineHeight: 22, marginBottom: 20 },

  quickInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  quickItem: {
    width: "23%", paddingVertical: 12, borderRadius: 14,
    backgroundColor: "#F8F8F8", alignItems: "center", borderTopWidth: 3, gap: 4,
  },
  quickValue: { fontWeight: "800", fontSize: 13, marginTop: 2 },
  quickLabel: { fontSize: 10, color: "#888" },

  card:      { backgroundColor: "#F8F8F8", borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 12 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 6, marginRight: 10 },
  bulletText:{ fontSize: 14, color: "#555", lineHeight: 22, flex: 1 },

  specRow:       { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  specRowBorder: { borderBottomWidth: 0.5, borderBottomColor: "#EBEBEB" },
  specLabel:     { color: "#777", fontSize: 14 },
  specValue:     { fontWeight: "700", fontSize: 14 },

  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingTop: 14,
    flexDirection: "row", alignItems: "center",
    borderTopWidth: 0.5, borderTopColor: "#EEE", backgroundColor: "#FFF",
  },
  priceLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  price:      { fontSize: 22, fontWeight: "800" },
  priceSub:   { fontSize: 11, color: "#BBB", marginTop: 2 },
  buyBtn: {
    marginLeft: 16, flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 22, paddingVertical: 14, borderRadius: 18,
  },
  buyText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
});