import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/themeContext";
import API_URL from "../../data/api/apis";
import BEST_PRICE_DATA from "../../data/bestPrice";
import { darkTheme, lightTheme } from "../../theme/colors";
import { HomeStackParamList } from "../navigation/types";

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, "home_main">;

type CategoryItem = {
  id: number;
  name: string;
  type?: string | null;
  color: string;
  route: keyof HomeStackParamList;
  image?: string | null;
};

type PlaceItem = {
  id: number;
  name: string;
  rating: number;
  address: string;
  image: string;
  description?: string;
};

type ProductItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

type NewsItem = {
  id: number;
  title: string;
  image: string;
  route: keyof HomeStackParamList;
};

type BannerItem = {
  id: number;
  image: string;
};

const WELCOME_KEY = "WELCOME_MESSAGE";
const { width } = Dimensions.get("window");
const CARD_W = (width - 40 - 24) / 3;
const BANNER_W = width - 32;
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

const keyById = (item: { id: number }) => String(item.id);

const categoryImageMap: Record<string, any> = {
  "home/phothong.png": require("../../../pic/home/phothong.png"),
  "home/trungcap.png": require("../../../pic/home/trungcap.png"),
  "home/caocap.png": require("../../../pic/home/caocap.png"),
  "home/oto.png": require("../../../pic/home/oto.png"),
  "home/phukien.png": require("../../../pic/home/phukien.png"),
};

const HOME_BANNERS: BannerItem[] = [
  { id: 1, image: "voucher/voucher1.jpg" },
  { id: 2, image: "voucher/voucher2.jpg" },
  { id: 3, image: "voucher/voucher3.jpg" },
  { id: 4, image: "voucher/voucher4.jpg" },
];

const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
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

const HomeScreen = () => {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const homePageBg = isDark ? "#120F0D" : "#F4ECE4";
  const homeAccent = isDark ? "#D78A6B" : "#C96442";
  const homeCardBg = isDark ? "#1E1A18" : "#FFFBF7";
  const homeBorder = isDark ? "#4A3930" : "#E8D7CB";
  const homeMuted = isDark ? "#BDAA9B" : "#8B7163";
  const homeShadow = isDark ? "#000000" : "#8F5A43";

  const navigation = useNavigation<HomeNavProp>();
  const bannerListRef = useRef<FlatList<BannerItem>>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("Cao cấp");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isVingroupStaff, setIsVingroupStaff] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const [stores, setStores] = useState<PlaceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [storesLoading, setStoresLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(false);
    setTimeout(() => setToastVisible(true), 50);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.log("Lỗi fetch categories:", e);
    } finally {
      setCategoriesLoading(false);
    }
  };

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
      const res = await fetch(`${API_URL}/api/products/featured`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.log("Lỗi fetch featured products:", e);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/news`);
      const data = await res.json();
      setNews(data);
    } catch (e) {
      console.log("Lỗi fetch news:", e);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchStores();
      fetchProducts();
      fetchNews();
      fetchCategories();
    });

    return () => task.cancel();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadWelcome = async () => {
        try {
          const msg = await AsyncStorage.getItem(WELCOME_KEY);
          if (msg && mounted) {
            showToast(msg);
            await AsyncStorage.removeItem(WELCOME_KEY);
          }
        } catch (e) {
          console.log("load welcome error:", e);
        }
      };

      loadWelcome();

      return () => {
        mounted = false;
      };
    }, [showToast])
  );

  useEffect(() => {
    if (HOME_BANNERS.length <= 1) return;

    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => {
        const nextIndex = (prev + 1) % HOME_BANNERS.length;
        bannerListRef.current?.scrollToOffset({
          offset: nextIndex * BANNER_W,
          animated: true,
        });
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const handleConsultSubmit = useCallback(async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!acceptedPrivacy) {
      Alert.alert("Thông báo", "Bạn cần đồng ý xử lý dữ liệu cá nhân");
      return;
    }

    try {
      setSubmitLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 300));

      showToast("Đăng ký tư vấn thành công!");
      setFullName("");
      setPhone("");
      setEmail("");
      setSelectedTab("Cao cấp");
      setIsVingroupStaff(false);
      setAcceptedPrivacy(false);
    } catch {
      Alert.alert("Lỗi", "Không thể xử lý đăng ký");
    } finally {
      setSubmitLoading(false);
    }
  }, [acceptedPrivacy, fullName, phone, email, showToast]);

  const handleBannerScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / BANNER_W);
      setActiveBannerIndex(nextIndex);
    },
    []
  );

  const renderCategoryCard = useCallback(
    (cat: CategoryItem) => {
      const isSpecial = cat.type === "special";
      const localImage = cat.image ? categoryImageMap[cat.image] : undefined;

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
              {localImage && (
                <Image source={localImage} style={styles.categoryIcon} />
              )}
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
    [isDark, navigation]
  );

  const renderStoreItem = useCallback(
    ({ item }: { item: PlaceItem }) => (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.placeCard,
          {
            backgroundColor: homeCardBg,
            shadowColor: homeShadow,
            shadowOpacity: isDark ? 0 : 0.1,
            elevation: isDark ? 0 : 4,
            borderWidth: 1,
            borderColor: homeBorder,
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
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <View style={styles.placeInfoRow}>
            <FontAwesome name="star" size={11} color={homeAccent} />
            <Text style={[styles.ratingText, { color: homeMuted }]}>
              {item.rating}
            </Text>
            <Text style={[styles.dot, { color: homeBorder }]}>•</Text>
            <Text
              style={[styles.placeAddress, { color: homeMuted }]}
              numberOfLines={1}
            >
              {item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [
      colors,
      homeAccent,
      homeBorder,
      homeCardBg,
      homeMuted,
      homeShadow,
      isDark,
      navigation,
    ]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: ProductItem }) => (
      <TouchableOpacity
        style={[
          styles.priceCard,
          {
            backgroundColor: homeCardBg,
            shadowColor: homeShadow,
            shadowOpacity: isDark ? 0 : 0.11,
            elevation: isDark ? 0 : 4,
            borderWidth: 1,
            borderColor: homeBorder,
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
            <FontAwesome name="star" size={11} color={homeAccent} />
            <Text style={[styles.priceRatingText, { color: homeMuted }]}>
              {(BEST_PRICE_DATA[item.id]?.rating ?? 4.5).toFixed(1)}
            </Text>
          </View>
          <View
            style={[styles.priceDivider, { backgroundColor: homeBorder }]}
          />
          <View style={styles.priceFooter}>
            <View>
              <Text style={[styles.priceFromLabel, { color: homeMuted }]}>
                Giá từ
              </Text>
              <Text style={[styles.priceText, { color: homeAccent }]}>
                {Number(item.price).toLocaleString("vi-VN")}đ
              </Text>
            </View>
            <View
              style={[styles.priceArrowBtn, { backgroundColor: homeAccent }]}
            >
              <FontAwesome name="plus" size={11} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [
      colors,
      homeAccent,
      homeBorder,
      homeCardBg,
      homeMuted,
      homeShadow,
      isDark,
      navigation,
    ]
  );

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.newsCard,
          {
            backgroundColor: homeCardBg,
            shadowColor: homeShadow,
            shadowOpacity: isDark ? 0 : 0.1,
            elevation: isDark ? 0 : 4,
            borderWidth: 1,
            borderColor: homeBorder,
          },
        ]}
        onPress={() => navigation.navigate(item.route as never)}
      >
        <Image
          source={{ uri: `${API_URL}/images/${item.image}` }}
          style={styles.newsImage}
        />
        <View style={styles.newsBody}>
          <View
            style={[
              styles.newsBadge,
              {
                backgroundColor: isDark ? "#2A201B" : "#F5E7DE",
                borderColor: homeBorder,
              },
            ]}
          >
            <Text style={[styles.newsBadgeText, { color: homeAccent }]}>
              Tin tức
            </Text>
          </View>
          <Text
            style={[styles.newsTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [
      colors,
      homeAccent,
      homeBorder,
      homeCardBg,
      homeShadow,
      isDark,
      navigation,
    ]
  );

  const renderBannerItem = useCallback(
    ({ item }: { item: BannerItem }) => (
      <Pressable style={styles.bannerSlide}>
        {({ pressed }) => (
          <>
            <Image
              source={{ uri: `${API_URL}/images/${item.image}` }}
              style={styles.bannerImage}
            />
            {pressed ? <View style={styles.bannerPressOverlay} /> : null}
          </>
        )}
      </Pressable>
    ),
    []
  );

  const SectionHeader = ({
    title,
    onPress,
    titleStyle,
    accentColor = "#FF8C00",
    actionColor = "#FF8C00",
  }: {
    title: string;
    onPress?: () => void;
    titleStyle?: any;
    accentColor?: string;
    actionColor?: string;
  }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View
          style={[styles.sectionAccent, { backgroundColor: accentColor }]}
        />
        <Text style={[styles.sectionTitle, { color: colors.text }, titleStyle]}>
          {title}
        </Text>
      </View>
      {onPress && (
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.seeAllRow}
          onPress={onPress}
        >
          <Text style={[styles.seeAllText, { color: actionColor }]}>
            Xem thêm
          </Text>
          <FontAwesome
            name="chevron-right"
            size={11}
            color={actionColor}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: homePageBg }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={homePageBg}
      />
      <Toast message={toastMsg} visible={toastVisible} />

      <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews>
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
              onPress={() => navigation.navigate("notifications")}
            >
              <FontAwesome name="bell" size={22} color="#fff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bannerWrapper}>
          <FlatList
            ref={bannerListRef}
            data={HOME_BANNERS}
            keyExtractor={keyById}
            renderItem={renderBannerItem}
            style={styles.bannerList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_W}
            decelerationRate="fast"
            bounces={false}
            onMomentumScrollEnd={handleBannerScrollEnd}
            getItemLayout={(_, index) => ({
              length: BANNER_W,
              offset: BANNER_W * index,
              index,
            })}
          />

          <View style={styles.bannerDots}>
            {HOME_BANNERS.map((banner, index) => {
              const active = index === activeBannerIndex;
              return (
                <View
                  key={banner.id}
                  style={[
                    styles.bannerDot,
                    active && styles.bannerDotActive,
                    {
                      backgroundColor: active
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.45)",
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.categorySection}>
          {categoriesLoading ? (
            <>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                {[0, 1, 2].map((i) => (
                  <SkeletonCard
                    key={i}
                    width={CARD_W}
                    height={CARD_W}
                    dark={isDark}
                  />
                ))}
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                {[3, 4, 5].map((i) => (
                  <SkeletonCard
                    key={i}
                    width={CARD_W}
                    height={CARD_W}
                    dark={isDark}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                {categories.slice(0, 3).map(renderCategoryCard)}
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                {categories.slice(3, 6).map(renderCategoryCard)}
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Cửa Hàng"
            titleStyle={styles.editorialSectionTitle}
            accentColor={homeAccent}
            actionColor={homeAccent}
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
            titleStyle={styles.editorialSectionTitle}
            accentColor={homeAccent}
            actionColor={homeAccent}
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
          <SectionHeader
            title="Tin Tức"
            titleStyle={styles.editorialSectionTitle}
            accentColor={homeAccent}
          />
          {newsLoading ? (
            <View style={styles.skeletonRow}>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} width={200} height={160} dark={isDark} />
              ))}
            </View>
          ) : (
            <FlatList
              horizontal
              data={news}
              keyExtractor={keyById}
              renderItem={renderNewsItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, paddingVertical: 10 }}
              removeClippedSubviews
              initialNumToRender={3}
            />
          )}
        </View>

        <View
          style={[
            styles.consultSection,
            { backgroundColor: isDark ? "#1A1512" : "#2B211D" },
          ]}
        >
          <Text style={styles.consultHeading}>ĐĂNG KÝ TƯ VẤN</Text>

          <View
            style={[
              styles.consultDivider,
              { backgroundColor: isDark ? "#3D312B" : "#5A463C" },
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
                { backgroundColor: isDark ? "#241D19" : "#FFF8F3" },
              ]}
            >
              <TextInput
                value={f.value}
                onChangeText={f.setter}
                placeholder={f.placeholder}
                placeholderTextColor={isDark ? "#A48E81" : "#9B7E6E"}
                keyboardType={
                  f.keyboard as "default" | "phone-pad" | "email-address"
                }
                style={[
                  styles.textInput,
                  { color: isDark ? "#F5E8DE" : "#2B211D" },
                ]}
              />
            </View>
          ))}

          <Text style={styles.consultLabel}>Dòng xe quan tâm</Text>

          <View
            style={[
              styles.tabRow,
              {
                backgroundColor: isDark ? "#241D19" : "#FFF8F3",
                borderColor: isDark ? homeBorder : "#DCC8BB",
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
                            ? "#CDB8AA"
                            : "#8B7163",
                    },
                    selectedTab === item && styles.tabTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.radioRow}
            onPress={() => setIsVingroupStaff((prev) => !prev)}
          >
            <View
              style={[
                styles.radioOuter,
                { borderColor: isVingroupStaff ? homeAccent : "#90766A" },
              ]}
            >
              {isVingroupStaff && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>
              Bạn có phải là CBNV tập đoàn Vingroup không?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.checkboxRow}
            onPress={() => setAcceptedPrivacy((prev) => !prev)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: acceptedPrivacy
                    ? homeAccent
                    : isDark
                      ? "#6E5A4E"
                      : "#90766A",
                  backgroundColor: acceptedPrivacy ? homeAccent : "transparent",
                },
              ]}
            >
              {acceptedPrivacy && (
                <FontAwesome name="check" size={10} color="#fff" />
              )}
            </View>
            <Text
              style={[
                styles.checkboxText,
                { color: isDark ? "#CDB8AA" : "#D9C6B8" },
              ]}
            >
              Tôi đồng ý cho phép Công ty TNHH Kinh doanh Thương mại Dịch vụ
              VinFast xử lý dữ liệu cá nhân của tôi...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, { opacity: submitLoading ? 0.7 : 1 }]}
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
    paddingHorizontal: 6,
    paddingBottom: 80,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  headerImage: { width: 150, height: 80 },
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
    width: BANNER_W,
    alignSelf: "center",
    marginHorizontal: 16,
    marginTop: -86,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  bannerList: {
    width: BANNER_W,
  },
  bannerSlide: {
    width: BANNER_W,
    height: 160,
  },
  bannerImage: { width: "100%", height: 160, resizeMode: "cover" },
  bannerPressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  bannerDots: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  bannerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  bannerDotActive: {
    width: 18,
  },

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
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  placeImage: { width: "100%", height: 118, resizeMode: "cover" },
  placeBody: { padding: 12 },
  placeName: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
    fontFamily: SERIF_FONT,
    lineHeight: 21,
  },
  placeInfoRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, fontWeight: "700", color: "#555", marginLeft: 4 },
  dot: { marginHorizontal: 5, color: "#DDD", fontSize: 12 },
  placeAddress: { fontSize: 12, color: "#999", flex: 1 },

  priceCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#FFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },
  priceImageBox: { height: 136, overflow: "hidden" },
  priceImage: { width: "100%", height: "100%", resizeMode: "cover" },
  priceContent: { padding: 14 },
  priceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    lineHeight: 15,
    minHeight: 25,
    marginBottom: 1,
    fontFamily: SERIF_FONT,
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
  priceDivider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 10 },
  priceFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceFromLabel: { fontSize: 11, color: "#BBB", marginBottom: 2 },
  priceText: { fontSize: 15, fontWeight: "800", color: "#FF8C00" },
  priceArrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
  },

  editorialSectionTitle: {
    fontFamily: SERIF_FONT,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  newsCard: {
    width: 200,
    marginRight: 14,
    backgroundColor: "#FFF",
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  newsImage: { width: "100%", height: 118, resizeMode: "cover" },
  newsBody: { padding: 14 },
  newsBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E0",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  newsBadgeText: { fontSize: 10, fontWeight: "700", color: "#FF8C00" },
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    color: "#222",
    fontFamily: SERIF_FONT,
  },

  consultSection: {
    backgroundColor: "#2B211D",
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginTop: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#4B3A33",
  },
  consultHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F1DDD0",
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: SERIF_FONT,
  },
  consultDivider: { height: 1, backgroundColor: "#5A463C", marginVertical: 16 },
  consultSubtitle: {
    fontSize: 14,
    color: "#D9C6B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  inputBox: {
    backgroundColor: "#FFF8F3",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DCC8BB",
  },
  textInput: { color: "#2B211D", fontSize: 14 },
  consultLabel: {
    fontWeight: "700",
    color: "#F1DDD0",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#FFF8F3",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DCC8BB",
  },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#C96442" },
  tabText: { fontSize: 13, color: "#8B7163", fontWeight: "600" },
  tabTextActive: { color: "#FFF", fontWeight: "600" },

  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C96442",
  },
  radioText: { color: "#F1DDD0", fontSize: 14, flex: 1 },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    marginRight: 10,
    marginTop: 3,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxText: { color: "#D9C6B8", fontSize: 13, flex: 1, lineHeight: 18 },

  submitBtn: {
    backgroundColor: "#C96442",
    paddingVertical: 15,
    borderRadius: 14,
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
