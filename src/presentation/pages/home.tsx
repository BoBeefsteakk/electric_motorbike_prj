import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  Platform,
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
import { useTheme } from "../../context/themeContext";
import { lightTheme, darkTheme } from "../../theme/colors";

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
  description?: string; 
};

type ProductItem = { id: number; name: string; price: string; image: string };

const { width } = Dimensions.get("window");
const CARD_W = (width - 40 - 24) / 3;

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");
const keyById = (item: { id: number }) => String(item.id);
const FEATURED_IDS = [7, 12, 16, 19, 21];

const CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: "Special Voucher",
    type: "special",
    route: "category_special",
    color: "#F97316",
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

/* ── Toast notification ── */
const Toast = ({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.delay(1800),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity]);

  return (
    <Animated.View style={[styles.toast, { opacity }]} pointerEvents="none">
      <FontAwesome name="check-circle" size={16} color="#fff" />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

/* ── Skeleton card ── */
const SkeletonCard = ({
  width: w,
  height: h,
  dark,
}: {
  width: number;
  height: number;
  dark: boolean;
}) => {
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
      style={{
        width: w,
        height: h,
        borderRadius: 16,
        backgroundColor: dark ? "#1F2937" : "#EBEBEB",
        marginRight: 14,
        opacity: anim,
      }}
    />
  );
};

/* ======================= SCREEN ======================= */
const HomeScreen = () => {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";

  const navigation = useNavigation<HomeNavProp>();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("Cao cấp");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [stores, setStores] = useState<PlaceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(false);
    setTimeout(() => setToastVisible(true), 50);
  };

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
      setStores(await res.json());
    } catch (e) {
      console.log("Lỗi fetch stores:", e);
    } finally {
      setStoresLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      const featured = FEATURED_IDS.map((id) =>
        data.find((p: ProductItem) => p.id === id)
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
      showToast("Đăng ký tư vấn thành công!");
      setFullName("");
      setPhone("");
      setEmail("");
    } catch {
      Alert.alert("Lỗi", "Không thể kết nối server");
    } finally {
      setSubmitLoading(false);
    }
  }, [fullName, phone, email, selectedTab]);

  /* ── render helpers ── */
  const renderCategoryCard = useCallback(
    (cat: CategoryItem) => {
      const isSpecial = cat.type === "special";

      return (
        <TouchableOpacity
          key={cat.id}
          activeOpacity={0.8}
          style={[
            isSpecial ? styles.specialCard : styles.categoryCard,
            {
              backgroundColor: isDark ? "#1F2937" : cat.color,
              borderColor: isDark
                ? "#334155"
                : isSpecial
                ? "rgba(255,255,255,0.25)"
                : "#E5E7EB",
            },
          ]}
          onPress={() => navigation.navigate(cat.route as never)}
        >
          {isSpecial ? (
            <>
              <Text
                style={[
                  styles.specialTitle,
                  { color: isDark ? "#E5E7EB" : "#FFF" },
                ]}
                numberOfLines={2}
              >
                {cat.name}
              </Text>
              <View style={styles.discountBadges}>
                {[
                  { c: "#5DADE2", t: "-50%" },
                  { c: "#58D68D", t: "-25%" },
                  { c: "#F8B4D9", t: "-15%" },
                ].map((b) => (
                  <View
                    key={b.t}
                    style={[styles.badge, { backgroundColor: b.c }]}
                  >
                    <Text style={styles.badgeText}>{b.t}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Image source={cat.image} style={styles.categoryIcon} />
              <Text
                style={[
                  styles.categoryName,
                  { color: isDark ? "#E5E7EB" : "#333" },
                ]}
              >
                {cat.name}
              </Text>
            </>
          )}
        </TouchableOpacity>
      );
    },
    [navigation, isDark]
  );

  const renderStoreItem = useCallback(
  ({ item }: { item: PlaceItem }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.placeCard,
        {
          backgroundColor: colors.card,
          shadowOpacity: isDark ? 0 : 0.09,
          elevation: isDark ? 0 : 3,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? "#334155" : "transparent",
        },
      ]}
          onPress={() =>
          navigation.navigate("store_detail", {
            storeId: item.id,
            description: item.description,
          })
        }
      >
        <Image
          source={{ uri: `${API_URL}${item.image}` }}
          style={styles.placeImage}
        />
        <View style={styles.placeBody}>
          <Text
            style={[styles.placeName, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={styles.placeInfoRow}>
            <FontAwesome name="star" size={11} color="#F5A623" />
            <Text
              style={[
                styles.ratingText,
                { color: isDark ? "#CBD5E1" : "#555" },
              ]}
            >
              {item.rating}
            </Text>
            <Text
              style={[
                styles.dot,
                { color: isDark ? "#475569" : "#DDD" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.placeAddress,
                { color: isDark ? "#94A3B8" : "#999" },
              ]}
              numberOfLines={1}
            >
              {item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation, colors, isDark]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: ProductItem }) => (
      <TouchableOpacity
        style={[
          styles.priceCard,
          {
            backgroundColor: colors.card,
            shadowOpacity: isDark ? 0 : 0.09,
            elevation: isDark ? 0 : 4,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#334155" : "transparent",
          },
        ]}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("best_price_detail", { id: item.id })
        }
      >
        <View style={styles.priceImageBox}>
          <Image
            source={{ uri: `${API_URL}/images/${encodeImagePath(item.image)}` }}
            style={styles.priceImage}
          />
        </View>
        <View style={styles.priceContent}>
          <Text
            style={[styles.priceName, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <View style={styles.priceRatingRow}>
            <FontAwesome name="star" size={11} color="#F5A623" />
            <Text
              style={[
                styles.priceRatingText,
                { color: isDark ? "#94A3B8" : "#999" },
              ]}
            >
              {(BEST_PRICE_DATA[item.id]?.rating ?? 4.5).toFixed(1)}
            </Text>
          </View>
          <View
            style={[
              styles.priceDivider,
              { backgroundColor: isDark ? "#334155" : "#F0F0F0" },
            ]}
          />
          <View style={styles.priceFooter}>
            <View>
              <Text
                style={[
                  styles.priceFromLabel,
                  { color: isDark ? "#94A3B8" : "#BBB" },
                ]}
              >
                Giá từ
              </Text>
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
    [navigation, colors, isDark]
  );

  const renderNewsItem = useCallback(
    ({ item }: { item: (typeof NEWS)[0] }) => (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.newsCard,
          {
            backgroundColor: colors.card,
            shadowOpacity: isDark ? 0 : 0.09,
            elevation: isDark ? 0 : 3,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#334155" : "transparent",
          },
        ]}
        onPress={() => navigation.navigate(item.route as any)}
      >
        <Image source={item.image} style={styles.newsImage} />
        <View style={styles.newsBody}>
          <View
            style={[
              styles.newsBadge,
              { backgroundColor: isDark ? "#3B2A14" : "#FFF0E0" },
            ]}
          >
            <Text style={styles.newsBadgeText}>Tin tức</Text>
          </View>
          <Text
            style={[
              styles.newsTitle,
              { color: isDark ? "#E5E7EB" : "#222" },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation, colors, isDark]
  );

  const SectionHeader = ({
    title,
    onPress,
  }: {
    title: string;
    onPress?: () => void;
  }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionAccent} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      {onPress && (
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.seeAllRow}
          onPress={onPress}
        >
          <Text style={styles.seeAllText}>Xem thêm</Text>
          <FontAwesome
            name="chevron-right"
            size={11}
            color="#FF8C00"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#000" : colors.background}
      />
      <Toast message={toastMsg} visible={toastVisible} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        <View style={[styles.headerDark, { backgroundColor: "#000" }]}>
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

        <View style={styles.categorySection}>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {CATEGORIES.slice(0, 3).map(renderCategoryCard)}
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {CATEGORIES.slice(3, 6).map(renderCategoryCard)}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Cửa Hàng"
            onPress={() => navigation.navigate("home_store_list")}
          />
          {storesLoading ? (
            <View style={styles.skeletonRow}>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} width={180} height={155} dark={isDark} />
              ))}
            </View>
          ) : (
            <FlatList
              horizontal
              data={stores}
              keyExtractor={keyById}
              renderItem={renderStoreItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
              removeClippedSubviews
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Bán Chạy"
            onPress={() => navigation.navigate("best_price_all")}
          />
          {productsLoading ? (
            <View style={styles.skeletonRow}>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} width={160} height={230} dark={isDark} />
              ))}
            </View>
          ) : (
            <FlatList
              horizontal
              data={products}
              keyExtractor={keyById}
              renderItem={renderProductItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
              removeClippedSubviews
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Tin Tức" />
          <FlatList
            horizontal
            data={NEWS}
            keyExtractor={keyById}
            renderItem={renderNewsItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
            removeClippedSubviews
            initialNumToRender={3}
          />
        </View>

        <View
          style={[
            styles.consultSection,
            { backgroundColor: isDark ? "#0B1220" : "#0F1B1D" },
          ]}
        >
          <Text style={styles.consultHeading}>ĐĂNG KÝ TƯ VẤN</Text>
          <View
            style={[
              styles.consultDivider,
              { backgroundColor: isDark ? "#243041" : "#2A3A3D" },
            ]}
          />
          <Text style={styles.consultSubtitle}>
            Đăng ký ngay hôm nay để nhận thông tin chính thức và tư vấn từ
            VinFast
          </Text>

          {[
            {
              value: fullName,
              setter: setFullName,
              placeholder: "Họ và tên *",
              keyboard: "default",
            },
            {
              value: phone,
              setter: setPhone,
              placeholder: "Số điện thoại *",
              keyboard: "phone-pad",
            },
            {
              value: email,
              setter: setEmail,
              placeholder: "Email *",
              keyboard: "email-address",
            },
          ].map((f) => (
            <View
              key={f.placeholder}
              style={[
                styles.inputBox,
                { backgroundColor: isDark ? "#111827" : "#fff" },
              ]}
            >
              <TextInput
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor={isDark ? "#64748B" : "#999"}
                keyboardType={f.keyboard as any}
                style={[styles.textInput, { color: isDark ? "#E5E7EB" : "#111" }]}
              />
            </View>
          ))}

          <Text style={styles.consultLabel}>Dòng xe quan tâm</Text>
          <View
            style={[
              styles.tabRow,
              {
                backgroundColor: isDark ? "#111827" : "#121212",
                borderColor: isDark ? "#334155" : "#2A3A3D",
              },
            ]}
          >
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
                    {
                      color:
                        selectedTab === item
                          ? "#FFF"
                          : isDark
                          ? "#94A3B8"
                          : "#888",
                    },
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

          {[
            "Bạn có phải là CBNV tập đoàn Vingroup không?",
            "Tôi đồng ý cho phép Công ty TNHH Kinh doanh Thương mại Dịch vụ VinFast xử lý dữ liệu cá nhân của tôi...",
          ].map((txt) => (
            <View key={txt} style={styles.checkboxRow}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: isDark ? "#475569" : "#646464" },
                ]}
              />
              <Text
                style={[
                  styles.checkboxText,
                  { color: isDark ? "#94A3B8" : "#AAA" },
                ]}
              >
                {txt}
              </Text>
            </View>
          ))}

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  toast: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#22C55E",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  toastText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  headerDark: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
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

  categorySection: { paddingHorizontal: 20, marginTop: 20 },
  categoryCard: {
    width: CARD_W,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  specialCard: {
    width: CARD_W,
    aspectRatio: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  specialTitle: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
    textAlign: "center",
    minHeight: 28,
  },
  discountBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badge: {
    width: "48%",
    paddingVertical: 5,
    marginBottom: 5,
    borderRadius: 14,
    alignItems: "center",
  },
  badgeText: { color: "#FFF", fontSize: 9, fontWeight: "700" },
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

  section: { paddingLeft: 20, marginTop: 28, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#FF8C00",
  },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: "#111" },
  seeAllRow: { flexDirection: "row", alignItems: "center" },
  seeAllText: { fontSize: 13, color: "#FF8C00", fontWeight: "600" },

  skeletonRow: { flexDirection: "row", paddingVertical: 10 },

  placeCard: {
    width: 180,
    marginRight: 14,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  placeImage: { width: "100%", height: 110, resizeMode: "cover" },
  placeBody: { padding: 10 },
  placeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  placeInfoRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#555", marginLeft: 4 },
  dot: { marginHorizontal: 5, color: "#DDD", fontSize: 12 },
  placeAddress: { fontSize: 12, color: "#999", flex: 1 },

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
  priceImageBox: { height: 130, overflow: "hidden" },
  priceImage: { width: "100%", height: "100%", resizeMode: "cover" },
  priceContent: { padding: 12 },
  priceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    lineHeight: 21,
    minHeight: 42,
    marginBottom: 2,
  },
  priceRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  priceRatingText: {
    fontSize: 12,
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
  priceFromLabel: { fontSize: 11, color: "#BBB", marginBottom: 2 },
  priceText: { fontSize: 14, fontWeight: "800", color: "#FF8C00" },
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
    marginRight: 14,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  newsImage: { width: "100%", height: 110, resizeMode: "cover" },
  newsBody: { padding: 12 },
  newsBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E0",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  newsBadgeText: { fontSize: 10, fontWeight: "700", color: "#FF8C00" },
  newsTitle: { fontSize: 13, fontWeight: "500", lineHeight: 18, color: "#222" },

  consultSection: {
    backgroundColor: "#0F1B1D",
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginTop: 40,
  },
  consultHeading: {
    fontSize: 24,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  textInput: { color: "#111", fontSize: 14 },
  consultLabel: {
    fontWeight: "700",
    color: "#DDD",
    fontSize: 16,
    marginTop: 8,
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
  tabItem: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#2F80ED" },
  tabText: { fontSize: 13, color: "#888", fontWeight: "500" },
  tabTextActive: { color: "#FFF", fontWeight: "600" },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
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
    borderRadius: 3,
  },
  checkboxText: { color: "#AAA", fontSize: 13, flex: 1, lineHeight: 18 },
  submitBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});