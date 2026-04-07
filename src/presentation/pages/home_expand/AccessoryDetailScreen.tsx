import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
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

interface Accessory {
  id: number;
  name: string;
  price: number;
  image: string;
}

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

export default function AccessoryDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const { id }     = route.params;
  const insets     = useSafeAreaInsets();

  const [item, setItem]             = useState<Accessory | null>(null);
  const [loading, setLoading]       = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch(`${API_URL}/api/accessories/${id}`)
      .then((r) => r.json())
      .then(setItem)
      .catch((e) => console.log("fetch accessory error:", e))
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
    if (!item || addingToCart) return;
    setAddingToCart(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:    "user_test_123",
          productId: `acc_${item.id}`,
          name:      item.name,
          price:     item.price,
          image:     `${API_URL}/${encodeImagePath(item.image)}`,
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
      <ActivityIndicator size="large" color="#E84393" />
    </View>
  );

  if (!item) return (
    <View style={[styles.center, { paddingTop: insets.top }]}>
      <FontAwesome name="exclamation-circle" size={40} color="#DDD" />
      <Text style={styles.notFound}>Không tìm thấy sản phẩm</Text>
    </View>
  );

  const accent = "#E84393";

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
          <TouchableOpacity style={styles.iconBtn} onPress={() => Share.share({ message: `Xem phụ kiện ${item.name} trên VinFast App!` })}>
            <FontAwesome name="share-alt" size={15} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleWishlist}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <FontAwesome name={wishlisted ? "heart" : "heart-o"} size={15} color={wishlisted ? "#E74C3C" : "#111"} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }} bounces={false}>
        {/* Ảnh */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `${API_URL}/${encodeImagePath(item.image)}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.catBadge, { backgroundColor: accent }]}>
            <Text style={styles.catBadgeText}>Phụ Kiện Chính Hãng</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>
            Phụ kiện chính hãng VinFast — được sản xuất và kiểm định đạt tiêu chuẩn chất lượng quốc tế, bảo hành 12 tháng, tương thích hoàn toàn với các dòng xe VinFast.
          </Text>

          {/* Quick info */}
          <View style={styles.quickInfo}>
            {[
              { icon: "check-circle", label: "Chính hãng",  val: "100%" },
              { icon: "shield",       label: "Bảo hành",    val: "12 tháng" },
              { icon: "star",         label: "Chất lượng",  val: "Cao cấp" },
              { icon: "truck",        label: "Giao hàng",   val: "Toàn quốc" },
            ].map((s, i) => (
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
              "Nguyên liệu cao cấp, độ bền vượt trội",
              "Thiết kế tương thích hoàn hảo với xe VinFast",
              "Dễ lắp đặt, không cần can thiệp kỹ thuật phức tạp",
              "Bảo hành chính hãng 12 tháng toàn quốc",
            ].map((text, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: accent }]} />
                <Text style={styles.bulletText}>{text}</Text>
              </View>
            ))}
          </View>

          {/* Specs */}
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.cardTitle}>⚙ Thông tin sản phẩm</Text>
            {[
              { label: "Thương hiệu",  value: "VinFast" },
              { label: "Xuất xứ",     value: "Việt Nam" },
              { label: "Bảo hành",    value: "12 tháng" },
              { label: "Tình trạng",  value: "Mới 100%" },
              { label: "Đổi trả",     value: "30 ngày" },
            ].map((s, i, arr) => (
              <View key={i} style={[styles.specRow, i < arr.length - 1 && styles.specRowBorder]}>
                <Text style={styles.specLabel}>{s.label}</Text>
                <Text style={[styles.specValue, { color: accent }]}>{s.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Giá bán</Text>
          <Text style={[styles.price, { color: accent }]}>
            {Number(item.price).toLocaleString("vi-VN")}đ
          </Text>
          <Text style={styles.priceSub}>Đã bao gồm VAT</Text>
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
                <Text style={styles.buyText}>THÊM VÀO GIỎ</Text>
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
  catBadge: { position: "absolute", bottom: 14, left: 16, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  catBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  content: { paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8, marginTop: 20, color: "#111" },
  desc:  { fontSize: 14, color: "#666", lineHeight: 22, marginBottom: 20 },

  quickInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  quickItem: {
    width: "23%", paddingVertical: 12, borderRadius: 14,
    backgroundColor: "#F8F8F8", alignItems: "center", borderTopWidth: 3, gap: 4,
  },
  quickValue: { fontWeight: "800", fontSize: 11, marginTop: 2, textAlign: "center" },
  quickLabel: { fontSize: 10, color: "#888", textAlign: "center" },

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
  price:      { fontSize: 20, fontWeight: "800" },
  priceSub:   { fontSize: 11, color: "#BBB", marginTop: 2 },
  buyBtn: {
    marginLeft: 16, flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 22, paddingVertical: 14, borderRadius: 18,
  },
  buyText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
});