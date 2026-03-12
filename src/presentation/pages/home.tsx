import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { HomeStackParamList } from "../navigation/types";
import API_URL from "../../data/api/apis";
import BEST_PRICE_DATA from "../../data/bestPrice";

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, "home_main">;

type CategoryItem = {
  id: number;
  name: string;
  type?: string;
  color: string;
  route: keyof HomeStackParamList;
  image?: any;
};

type PlaceItem = {
  id: number;
  name: string;
  rating: number;
  address: string;
  image: string;
  route: string;
};

type ProductItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40 - 24) / 3;

// ── Khai báo NGOÀI component → không re-create mỗi lần render ──
const CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: "Special Voucher",
    type: "special",
    route: "category_special",
    color: "#FF8A5B",
  },
  {
    id: 2,
    name: "Phổ Thông",
    image: require("../../../pic/home/phothong.png"),
    route: "category_pho_thong",
    color: "#F5E6D3",
  },
  {
    id: 3,
    name: "Trung Cấp",
    image: require("../../../pic/home/trungcap.png"),
    route: "category_trung_cap",
    color: "#FFE5E5",
  },
  {
    id: 4,
    name: "Cao Cấp",
    image: require("../../../pic/home/caocap.png"),
    route: "category_cao_cap",
    color: "#FFF8F0",
  },
  {
    id: 5,
    name: "Ô Tô",
    image: require("../../../pic/home/oto.png"),
    route: "category_o_to",
    color: "#FFF8E7",
  },
  {
    id: 6,
    name: "Phụ Kiện",
    image: require("../../../pic/home/phukien.png"),
    route: "category_phu_kien",
    color: "#F0FFF0",
  },
];

const NEWS = [
  {
    id: 1,
    title: "VinFast O2O triển khai nền tảng mua xe máy điện trực tuyến",
    image: require("../../../pic/home/news1.jpg"),
    route: "news1",
  },
  {
    id: 2,
    title:
      "Vinfast ra mắt 4 mẫu xe máy điện mới, hoàn thiện lắp đặt 4500 trạm đổi pin đầu tiên",
    image: require("../../../pic/home/news2.jpg"),
    route: "news2",
  },
  {
    id: 3,
    title:
      "VinFast triển khai dịch vụ giao xe toàn quốc: Linh hoạt, thuận tiện, tối ưu trải nghiệm",
    image: require("../../../pic/home/news3.jpg"),
    route: "news3",
  },
];

// Encode từng segment của path, giữ nguyên dấu /
// "motorbike/VinFast Evo 200 Lite.jpg" → "motorbike/VinFast%20Evo%20200%20Lite.jpg"
const encodeImagePath = (path: string) =>
  path.split("/").map(encodeURIComponent).join("/");

const keyById = (item: { id: number }) => String(item.id);

/* ======================= SCREEN ======================= */

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("Cao cấp");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [stores, setStores] = useState<PlaceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  /* ── Fetch sau khi animation navigate xong → không block UI ── */
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchStores();
      fetchProducts();
    });
    return () => task.cancel();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stores`);
      const data = await res.json();
      setStores(data);
    } catch (e) {
      console.log("Lỗi fetch stores:", e);
    } finally {
      setStoresLoading(false);
    }
  };

  // Chỉ hiển thị 5 xe đại diện ở mục Bán Chạy
  const FEATURED_IDS = [7, 12, 16, 19, 21];

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      // Lọc đúng id, giữ nguyên thứ tự theo FEATURED_IDS
      const featured = FEATURED_IDS.map((id) =>
        data.find((p: ProductItem) => p.id === id),
      ).filter(Boolean);
      setProducts(featured);
    } catch (e) {
      console.log("Lỗi fetch products:", e);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleConsultSubmit = useCallback(async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      setSubmitLoading(true);
      const res = await fetch(`${API_URL}/api/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email, carType: selectedTab }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Lỗi", data.message || "Đăng ký thất bại");
        return;
      }
      Alert.alert(
        "Thành công",
        "Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm.",
      );
      setFullName("");
      setPhone("");
      setEmail("");
    } catch {
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setSubmitLoading(false);
    }
  }, [fullName, phone, email, selectedTab]);

  /* ── render functions dùng useCallback → không re-create khi re-render ── */

  const renderCategoryCard = useCallback(
    (cat: CategoryItem) => (
      <TouchableOpacity
        key={cat.id}
        activeOpacity={0.8}
        style={[
          cat.type === "special" ? styles.specialCard : styles.categoryCard,
          { backgroundColor: cat.color },
        ]}
        onPress={() => navigation.navigate(cat.route as never)}
      >
        {cat.type === "special" ? (
          <>
            <Text style={styles.specialTitle} numberOfLines={1}>
              {cat.name}
            </Text>
            <View style={styles.discountBadges}>
              <View style={[styles.badge, { backgroundColor: "#5DADE2" }]}>
                <Text style={styles.badgeText}>-50%</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "#58D68D" }]}>
                <Text style={styles.badgeText}>-25%</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: "#F8B4D9" }]}>
                <Text style={styles.badgeText}>-15%</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Image source={cat.image} style={styles.categoryIcon} />
            <Text style={styles.categoryName}>{cat.name}</Text>
          </>
        )}
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderStoreItem = useCallback(
    ({ item }: { item: PlaceItem }) => (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.placeCard}
        onPress={() => navigation.navigate(item.route as any)}
      >
        <Image
          source={{ uri: `${API_URL}${item.image}` }}
          style={styles.placeImage}
        />
        <View style={{ padding: 10 }}>
          <Text style={styles.placeName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.placeInfoRow}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.placeAddress} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderProductItem = useCallback(
    ({ item }: { item: ProductItem }) => (
      <TouchableOpacity
        style={styles.priceCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("best_price_detail", { id: item.id })
        }
      >
        {/* Ảnh */}
        <View style={styles.priceImageBox}>
          <Image
            source={{ uri: `${API_URL}/images/${encodeImagePath(item.image)}` }}
            style={styles.priceImage}
          />
        </View>

        {/* Nội dung */}
        <View style={styles.priceContent}>
          <Text style={styles.priceName} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Rating */}
          <View style={styles.priceRatingRow}>
            <FontAwesome name="star" size={11} color="#F5A623" />
            <Text style={styles.priceRatingText}>
              {(BEST_PRICE_DATA[item.id]?.rating ?? 4.5).toFixed(1)}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.priceDivider} />

          {/* Giá + nút */}
          <View style={styles.priceFooter}>
            <View>
              <Text style={styles.priceFromLabel}>Giá từ</Text>
              <Text style={styles.priceText}>
                {Number(item.price).toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <View style={styles.priceArrowBtn}>
              <FontAwesome name="plus" size={11} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderNewsItem = useCallback(
    ({ item }: { item: (typeof NEWS)[0] }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.newsCard}
        onPress={() => navigation.navigate(item.route as any)}
      >
        <Image source={item.image} style={styles.newsImage} />
        <View style={{ padding: 12 }}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  /* ======================= RENDER ======================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        {/* HEADER */}
        <View style={styles.headerDark}>
          <View style={styles.headerTop}>
            <Image
              source={require("../../../pic/home/vinfast_home_2.png")}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.7}
            >
              <FontAwesome name="bell" size={22} color="#fff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.bannerWrapper}
          onPress={() => navigation.navigate("home_banner_detail")}
        >
          <Image
            source={require("../../../pic/home/banner.png")}
            style={styles.bannerImage}
          />
        </TouchableOpacity>

        {/* CATEGORIES */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {CATEGORIES.slice(0, 3).map(renderCategoryCard)}
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {CATEGORIES.slice(3, 6).map(renderCategoryCard)}
          </View>
        </View>

        {/* ── CỬA HÀNG ── FlatList thay ScrollView */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cửa Hàng</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.seeAllRow}
              onPress={() => navigation.navigate("home_store_list")}
            >
              <Text style={styles.seeAllText}>Xem thêm</Text>
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 4, top: 1.5 }}
              />
            </TouchableOpacity>
          </View>
          {storesLoading ? (
            <ActivityIndicator
              size="small"
              color="#5DADE2"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              horizontal
              data={stores}
              keyExtractor={keyById}
              renderItem={renderStoreItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
              removeClippedSubviews={true}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          )}
        </View>

        {/* ── BÁN CHẠY ── FlatList thay ScrollView */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bán Chạy</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.seeAllRow}
              onPress={() => navigation.navigate("best_price_all")}
            >
              <Text style={styles.seeAllText}>Xem thêm</Text>
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 4, top: 1.5 }}
              />
            </TouchableOpacity>
          </View>
          {productsLoading ? (
            <ActivityIndicator
              size="small"
              color="#5DADE2"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              horizontal
              data={products}
              keyExtractor={keyById}
              renderItem={renderProductItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
              removeClippedSubviews={true}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          )}
        </View>

        {/* ── TIN TỨC ── FlatList thay ScrollView */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tin Tức</Text>
            <TouchableOpacity activeOpacity={0.6} style={styles.seeAllRow}>
              <Text style={styles.seeAllText}>Xem thêm</Text>
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 4, top: 1.5 }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={NEWS}
            keyExtractor={keyById}
            renderItem={renderNewsItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
            removeClippedSubviews={true}
            initialNumToRender={3}
          />
        </View>

        {/* ── ĐĂNG KÝ TƯ VẤN ── */}
        <View style={styles.consultSection}>
          <Text style={styles.consultHeading}>ĐĂNG KÝ TƯ VẤN</Text>
          <View style={styles.consultDivider} />
          <Text style={styles.consultSubtitle}>
            Đăng ký ngay hôm nay để nhận thông tin chính thức và tư vấn từ
            VinFast
          </Text>

          <View style={styles.inputBox}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Họ và tên *"
              placeholderTextColor="#999"
              style={styles.textInputt}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại *"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              style={styles.textInputt}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email *"
              placeholderTextColor="#999"
              keyboardType="email-address"
              style={styles.textInputt}
            />
          </View>

          <Text style={styles.consultLabel}>Dòng xe quan tâm</Text>
          <View style={styles.tabRow}>
            {["Cao cấp", "Trung cấp", "Phổ thông"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.tabItem,
                  selectedTab === item && styles.tabActive,
                ]}
                onPress={() => setSelectedTab(item)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === item && styles.tabTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.radioRow}>
            <View style={styles.radioActive} />
            <Text style={styles.radioText}>Vero X</Text>
          </View>

          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>
              Bạn có phải là CBNV tập đoàn Vingroup không?
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxText}>
              Tôi đồng ý cho phép Công ty TNHH Kinh doanh Thương mại Dịch vụ
              VinFast xử lý dữ liệu cá nhân của tôi...
            </Text>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.8}
            onPress={handleConsultSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>ĐĂNG KÝ</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ======================= STYLE ======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  headerWrapper: { backgroundColor: "#000", paddingBottom: 80 },
  headerDark: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerImage: { width: 140, height: 120 },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },

  bannerWrapper: {
    marginHorizontal: 16,
    marginTop: -90,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  bannerImage: { width: "100%", height: 160, resizeMode: "cover" },
  fixedBanner: {
    position: "absolute",
    top: 90,
    left: 16,
    right: 16,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  section: { paddingLeft: 20, marginTop: 30, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  sectionTitle: { fontSize: 24, fontWeight: "700", color: "#111" },
  seeAllRow: { flexDirection: "row", alignItems: "center" },
  seeAllText: { fontSize: 14, color: "#666", fontWeight: "500" },

  categoryCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  specialCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  specialTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 5,
  },
  discountBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badge: {
    width: "48%",
    paddingVertical: 6,
    marginBottom: 6,
    borderRadius: 14,
    alignItems: "center",
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  categoryIcon: {
    width: 80,
    height: 60,
    resizeMode: "contain",
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },

  placeCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  placeImage: { width: "100%", height: 120, resizeMode: "cover" },
  placeName: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    height: 25,
    color: "#111",
  },
  placeInfoRow: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 12, fontWeight: "700", color: "#333" },
  dot: { marginHorizontal: 4, color: "#999" },
  placeAddress: { fontSize: 12, color: "#666", flex: 1 },

  priceCard: {
    width: 160,
    marginRight: 14,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },
  priceImageBox: {
    height: 130,
    overflow: "hidden",
  },
  priceImage: { width: "100%", height: "100%", resizeMode: "cover" },
  priceContent: { padding: 12 },
  priceName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    lineHeight: 23,
    minHeight: 46,
    marginBottom: 2,
  },
  priceRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priceRatingText: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
    fontWeight: "500",
  },
  priceDivider: { height: 0.5, backgroundColor: "#F0F0F0", marginBottom: 8 },
  priceFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceFromLabel: { fontSize: 12, color: "#BBB", marginBottom: 2 },
  priceText: { fontSize: 15, fontWeight: "800", color: "#FF8C00" },
  priceArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
  },

  newsCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  newsImage: { width: "100%", height: 110, resizeMode: "cover" },
  newsTitle: { fontSize: 14, fontWeight: "400", lineHeight: 18, color: "#222" },

  consultSection: {
    backgroundColor: "#0F1B1D",
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginTop: 50,
  },
  consultHeading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#E6D5C3",
    textAlign: "center",
    letterSpacing: 1,
  },
  consultDivider: { height: 1, backgroundColor: "#2A3A3D", marginVertical: 16 },
  consultSubtitle: {
    fontSize: 14,
    color: "#CFCFCF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  inputPlaceholder: { color: "#888", fontSize: 14 },
  consultLabel: {
    fontWeight: "700",
    color: "#DDD",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 12,
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#121212",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2A3A3D",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: { backgroundColor: "#2F80ED" },
  tabText: { fontSize: 14, color: "#888", fontWeight: "500" },
  tabTextActive: { color: "#FFF", fontWeight: "600" },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  radioActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2F80ED",
    marginRight: 10,
  },
  radioText: { color: "#EEE", fontSize: 14 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#646464",
    marginRight: 10,
    marginTop: 3,
  },
  checkboxText: { color: "#AAA", fontSize: 13, flex: 1, lineHeight: 18 },
  submitBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  textInputt: { color: "black" },
});
