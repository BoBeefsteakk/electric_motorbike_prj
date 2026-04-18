import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import API_URL from "../../../../data/api/apis";
import { useTheme } from "../../../../context/themeContext";
import { darkTheme, lightTheme } from "../../../../theme/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type Car = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  category: string;
};

const TABS = [
  { key: "all", label: "Tất Cả", icon: "🚗", color: "#1A1A1A" },
  { key: "dong_co_dien", label: "Điện", icon: "⚡", color: "#2563EB" },
  { key: "dong_co_xang", label: "Xăng", icon: "⛽", color: "#DC2626" },
  { key: "dong_xe_dich_vu", label: "Dịch Vụ", icon: "🏢", color: "#7C3AED" },
];

const SORT_OPTIONS = [
  { key: "default", label: "Mặc định" },
  { key: "price_asc", label: "Giá tăng dần" },
  { key: "price_desc", label: "Giá giảm dần" },
  { key: "name_asc", label: "Tên A → Z" },
];

const formatPrice = (price: number) => {
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(2)} tỷ`;
  }
  return `${(price / 1_000_000).toFixed(0)} triệu`;
};

const buildUri = (imagePath: string | null): string | null => {
  if (!imagePath || imagePath.trim() === "") return null;
  let path = imagePath.trim();
  if (path.startsWith("images/")) {
    path = path.slice("images/".length);
  }
  const encoded = path.replace(/ /g, "%20");
  return `${API_URL}/images/${encoded}`;
};

const CarCard = React.memo(function CarCard({
  item,
  onPress,
  theme,
  colors,
}: {
  item: Car;
  onPress: (car: Car) => void;
  theme: "light" | "dark";
  colors: typeof lightTheme;
}) {
  const uri = buildUri(item.image);
  const [status, setStatus] = useState<"loading" | "ok" | "error">(
    uri ? "loading" : "error",
  );
  const tab = TABS.find((t) => t.key === item.category);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        crd.wrap,
        {
          backgroundColor: theme === "dark" ? colors.card : "#FFF",
          shadowOpacity: theme === "dark" ? 0 : 0.08,
          elevation: theme === "dark" ? 0 : 4,
          borderWidth: theme === "dark" ? 1 : 0,
          borderColor: theme === "dark" ? "#334155" : "transparent",
        },
      ]}
      onPress={() => onPress(item)}
    >
      <View
        style={[
          crd.imgBox,
          { backgroundColor: theme === "dark" ? "#0F172A" : "#F0ECE8" },
        ]}
      >
        {uri && status !== "error" ? (
          <Image
            source={{ uri, cache: "reload" }}
            style={crd.img}
            resizeMode="cover"
            onLoad={() => setStatus("ok")}
            onError={() => setStatus("error")}
          />
        ) : null}

        {status === "loading" && (
          <View
            style={[
              crd.placeholder,
              { backgroundColor: theme === "dark" ? "#0F172A" : "#F0ECE8" },
            ]}
          >
            <ActivityIndicator color="#C8902A" size="small" />
          </View>
        )}

        {status === "error" && (
          <View
            style={[
              crd.placeholder,
              { backgroundColor: theme === "dark" ? "#0F172A" : "#F0ECE8" },
            ]}
          >
            <Text style={{ fontSize: 30, marginBottom: 4 }}>🚗</Text>
            <Text
              style={[
                crd.fallbackTxt,
                { color: theme === "dark" ? "#94A3B8" : "#BBB" },
              ]}
            >
              Chưa có ảnh
            </Text>
          </View>
        )}

        <View style={[crd.badge, { backgroundColor: tab?.color ?? "#555" }]}>
          <Text style={{ fontSize: 11 }}>{tab?.icon ?? "🚗"}</Text>
        </View>
      </View>

      <View style={crd.body}>
        <Text style={[crd.name, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>

        <View
          style={[
            crd.divider,
            { backgroundColor: theme === "dark" ? "#334155" : "#F0ECE8" },
          ]}
        />

        <View style={crd.footer}>
          <View>
            <Text
              style={[
                crd.priceLabel,
                { color: theme === "dark" ? "#94A3B8" : "#BBB" },
              ]}
            >
              Giá từ
            </Text>
            <Text style={crd.price}>{formatPrice(item.price)}</Text>
          </View>

          <View
            style={[
              crd.pill,
              { backgroundColor: theme === "dark" ? "#2563EB" : "#1A1A1A" },
            ]}
          >
            <Text style={crd.pillTxt}>Chi tiết →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

function DetailModal({
  car,
  visible,
  onClose,
  theme,
  colors,
}: {
  car: Car | null;
  visible: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  colors: typeof lightTheme;
}) {
  if (!car) return null;
  const tab = TABS.find((t) => t.key === car.category);
  const uri = buildUri(car.image);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={dtl.overlay}>
        <View
          style={[
            dtl.sheet,
            { backgroundColor: theme === "dark" ? colors.card : "#FFF" },
          ]}
        >
          <View
            style={[
              dtl.handle,
              { backgroundColor: theme === "dark" ? "#475569" : "#DDD" },
            ]}
          />
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={dtl.heroBox}>
              {uri ? (
                <Image source={{ uri }} style={dtl.heroImg} resizeMode="cover" />
              ) : (
                <View
                  style={[
                    dtl.heroImg,
                    dtl.heroFallback,
                    {
                      backgroundColor: theme === "dark" ? "#0F172A" : "#F0ECE8",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 48 }}>🚗</Text>
                </View>
              )}
              <View
                style={[
                  dtl.heroBadge,
                  { backgroundColor: tab?.color ?? "#555" },
                ]}
              >
                <Text style={dtl.heroBadgeTxt}>
                  {tab?.icon} {tab?.label}
                </Text>
              </View>
            </View>

            <View style={dtl.body}>
              <Text style={[dtl.carName, { color: colors.text }]}>
                {car.name}
              </Text>

              <View
                style={[
                  dtl.priceBox,
                  {
                    backgroundColor: theme === "dark" ? "#0F1E35" : "#FFF8EE",
                  },
                ]}
              >
                <Text
                  style={[
                    dtl.priceLbl,
                    { color: theme === "dark" ? "#94A3B8" : "#888" },
                  ]}
                >
                  Giá bán lẻ đề xuất
                </Text>
                <Text style={dtl.priceVal}>{formatPrice(car.price)}</Text>
              </View>

              <Text style={[dtl.specTitle, { color: colors.text }]}>
                Thông số nổi bật
              </Text>

              <View style={dtl.specRow}>
                {[
                  { icon: "🛡️", label: "An toàn", val: "5 sao" },
                  { icon: "⚙️", label: "Hộp số", val: "Tự động" },
                  { icon: "🪑", label: "Chỗ ngồi", val: "5 chỗ" },
                  { icon: "🗓️", label: "Bảo hành", val: "3 năm" },
                ].map((spec) => (
                  <View
                    key={spec.label}
                    style={[
                      dtl.specItem,
                      {
                        backgroundColor:
                          theme === "dark" ? "#0F172A" : "#F5F3F0",
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 20 }}>{spec.icon}</Text>
                    <Text
                      style={[
                        dtl.specVal,
                        { color: theme === "dark" ? "#FFF" : "#1A1A1A" },
                      ]}
                    >
                      {spec.val}
                    </Text>
                    <Text
                      style={[
                        dtl.specLbl,
                        { color: theme === "dark" ? "#94A3B8" : "#888" },
                      ]}
                    >
                      {spec.label}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={dtl.ctaBtn} onPress={onClose}>
                <Text style={dtl.ctaTxt}>Đăng ký tư vấn ngay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  dtl.closeBtn,
                  {
                    backgroundColor:
                      theme === "dark" ? "#0F172A" : "#F0ECE8",
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    dtl.closeTxt,
                    { color: theme === "dark" ? "#FFF" : "#333" },
                  ]}
                >
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function CategoryOTo() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const pageBg = theme === "dark" ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<NavigationProp<any>>();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sort, setSort] = useState("default");
  const [showSort, setShowSort] = useState(false);
  const [selCar, setSelCar] = useState<Car | null>(null);
  const [modalVis, setModalVis] = useState(false);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setHasError(false);
      const res = await fetch(`${API_URL}/api/cars`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetch cars:", e);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const filtered = useMemo(() => {
    let list =
      activeTab === "all"
        ? cars
        : cars.filter((c) => c.category === activeTab);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    switch (sort) {
      case "price_asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name_asc":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [cars, activeTab, search, sort]);

  const openDetail = useCallback(
    (car: Car) => {
      navigation.navigate("car_detail", { id: car.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Car }) => (
      <CarCard
        item={item}
        onPress={openDetail}
        theme={theme}
        colors={colors}
      />
    ),
    [openDetail, theme, colors],
  );

  return (
    <SafeAreaView style={[sc.safe, { backgroundColor: pageBg }]}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <View style={sc.header}>
        <TouchableOpacity
          style={[
            sc.iconBtn,
            {
              backgroundColor: theme === "dark" ? "#1F2937" : "#F5EAE1",
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              sc.iconBtnTxt,
              { color: theme === "dark" ? "#FFF" : "#1A1A1A" },
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[sc.headerTitle, { color: colors.text }]}>
            Ô Tô VinFast
          </Text>
          <Text
            style={[
              sc.headerSub,
              { color: theme === "dark" ? "#94A3B8" : "#8B7163" },
            ]}
          >
            {loading ? "Đang tải..." : `${filtered.length} mẫu xe`}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            sc.iconBtn,
            {
              backgroundColor: theme === "dark" ? "#1F2937" : "#F5EAE1",
            },
          ]}
          onPress={() => setShowSort(true)}
        >
          <Text
            style={[
              sc.iconBtnTxt,
              { color: theme === "dark" ? "#FFF" : "#1A1A1A" },
            ]}
          >
            ⇅
          </Text>
        </TouchableOpacity>
      </View>

      <View style={sc.searchWrap}>
        <View
          style={[
            sc.searchBox,
            {
              backgroundColor: theme === "dark" ? "#1F2937" : "#FFF8F2",
              borderWidth: 1.2,
              borderColor: theme === "dark" ? "#334155" : "#E7C7B2",
              shadowColor: theme === "dark" ? "#000" : "#C58A67",
              shadowOpacity: theme === "dark" ? 0 : 0.08,
              shadowRadius: theme === "dark" ? 0 : 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: theme === "dark" ? 0 : 3,
            },
          ]}
        >
          <Text style={sc.searchIco}>🔍</Text>
          <TextInput
            style={[sc.searchInput, { color: colors.text }]}
            placeholder="Tìm kiếm mẫu xe..."
            placeholderTextColor={theme === "dark" ? "#64748B" : "#ABABAB"}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text
                style={[
                  sc.clearIco,
                  { color: theme === "dark" ? "#94A3B8" : "#999" },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ height: 44, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sc.tabRow}
          style={{ flex: 1 }}
          bounces={false}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === "all"
                ? cars.length
                : cars.filter((c) => c.category === tab.key).length;

            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                style={[
                  sc.tab,
                  {
                    backgroundColor: isActive
                      ? tab.color
                      : theme === "dark"
                        ? "#1F2937"
                        : "#FFF8F2",
                    borderWidth: isActive ? 0 : 1,
                    borderColor: isActive
                      ? "transparent"
                      : theme === "dark"
                        ? "#334155"
                        : "#E4C7B3",
                    shadowColor: isActive ? "transparent" : "#C58A67",
                    shadowOpacity:
                      isActive || theme === "dark" ? 0 : 0.06,
                    shadowRadius: isActive || theme === "dark" ? 0 : 8,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: isActive || theme === "dark" ? 0 : 2,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={sc.tabIco}>{tab.icon}</Text>
                <Text style={[sc.tabLbl, isActive && sc.tabLblActive]}>
                  {tab.label}
                </Text>
                <View
                  style={[
                    sc.tabBadge,
                    {
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.28)"
                        : theme === "dark"
                          ? "#334155"
                          : "#D8D4CC",
                    },
                  ]}
                >
                  <Text
                    style={[
                      sc.tabBadgeTxt,
                      {
                        color: isActive
                          ? "#FFF"
                          : theme === "dark"
                            ? "#CBD5E1"
                            : "#666",
                      },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={sc.center}>
          <ActivityIndicator size="large" color="#C8902A" />
          <Text
            style={[
              sc.centerTxt,
              { color: theme === "dark" ? "#94A3B8" : "#8B7163" },
            ]}
          >
            Đang tải...
          </Text>
        </View>
      ) : hasError ? (
        <View style={sc.center}>
          <Text style={{ fontSize: 40 }}>😕</Text>
          <Text
            style={[
              sc.centerTxt,
              { color: theme === "dark" ? "#94A3B8" : "#8B7163" },
            ]}
          >
            Không thể tải dữ liệu
          </Text>
          <TouchableOpacity
            style={[
              sc.retryBtn,
              { backgroundColor: theme === "dark" ? "#2563EB" : "#1A1A1A" },
            ]}
            onPress={fetchCars}
          >
            <Text style={sc.retryTxt}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={sc.center}>
          <Text style={{ fontSize: 40 }}>🔎</Text>
          <Text
            style={[
              sc.centerTxt,
              { color: theme === "dark" ? "#94A3B8" : "#8B7163" },
            ]}
          >
            Không tìm thấy xe nào
          </Text>
          <TouchableOpacity
            style={[
              sc.retryBtn,
              { backgroundColor: theme === "dark" ? "#2563EB" : "#1A1A1A" },
            ]}
            onPress={() => {
              setSearch("");
              setActiveTab("all");
            }}
          >
            <Text style={sc.retryTxt}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={sc.colWrap}
          contentContainerStyle={sc.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === "android"}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={5}
        />
      )}

      <Modal
        visible={showSort}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSort(false)}
      >
        <TouchableOpacity
          style={srt.overlay}
          activeOpacity={1}
          onPress={() => setShowSort(false)}
        >
          <View
            style={[
              srt.sheet,
              { backgroundColor: theme === "dark" ? colors.card : "#FFF" },
            ]}
          >
            <View
              style={[
                srt.handle,
                { backgroundColor: theme === "dark" ? "#475569" : "#DDD" },
              ]}
            />
            <Text style={[srt.title, { color: colors.text }]}>
              Sắp xếp theo
            </Text>

            {SORT_OPTIONS.map((opt) => {
              const active = sort === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    srt.option,
                    {
                      backgroundColor: active
                        ? theme === "dark"
                          ? "#2563EB"
                          : "#1A1A1A"
                        : theme === "dark"
                          ? "#0F172A"
                          : "#F5F3F0",
                    },
                  ]}
                  onPress={() => {
                    setSort(opt.key);
                    setShowSort(false);
                  }}
                >
                  <Text
                    style={[
                      srt.optTxt,
                      {
                        color: active
                          ? "#FFF"
                          : theme === "dark"
                            ? "#CBD5E1"
                            : "#333",
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {active && <Text style={srt.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <DetailModal
        car={selCar}
        visible={modalVis}
        onClose={() => setModalVis(false)}
        theme={theme}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const sc = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4ECE4" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 16 : 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDE9E4",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnTxt: {
    fontSize: 18,
    color: "#1A1A1A",
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    fontFamily: SERIF_FONT,
  },
  headerSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 1,
    fontFamily: SERIF_FONT,
  },

  searchWrap: { paddingHorizontal: 16, marginBottom: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F2",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIco: { fontSize: 15, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    padding: 0,
    fontFamily: SERIF_FONT,
  },
  clearIco: {
    fontSize: 13,
    color: "#999",
    paddingLeft: 8,
    fontFamily: SERIF_FONT,
  },

  tabRow: {
    paddingHorizontal: 16,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#FFF8F2",
    marginRight: 8,
  },
  tabIco: { fontSize: 13 },
  tabLbl: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginLeft: 4,
    marginRight: 5,
    fontFamily: SERIF_FONT,
  },
  tabLblActive: { color: "#FFF" },
  tabBadge: {
    backgroundColor: "#D8D4CC",
    borderRadius: 10,
    minWidth: 20,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBadgeTxt: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666",
    lineHeight: 13,
    fontFamily: SERIF_FONT,
  },

  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  colWrap: { justifyContent: "space-between", marginBottom: 14 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  centerTxt: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
    fontFamily: SERIF_FONT,
  },
  retryBtn: {
    marginTop: 14,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
  },
  retryTxt: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: SERIF_FONT,
  },
});

const crd = StyleSheet.create({
  wrap: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imgBox: {
    height: 148,
    backgroundColor: "#F0ECE8",
    position: "relative",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0ECE8",
  },
  fallbackTxt: {
    fontSize: 11,
    color: "#BBB",
    marginTop: 2,
    fontFamily: SERIF_FONT,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  body: { padding: 11, paddingTop: 9 },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 17,
    minHeight: 17,
    marginBottom: 6,
    fontFamily: SERIF_FONT,
  },
  divider: { height: 1, backgroundColor: "#F0ECE8", marginBottom: 7 },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 10,
    color: "#BBB",
    marginBottom: 1,
    fontFamily: SERIF_FONT,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: "#C8902A",
    fontFamily: SERIF_FONT,
  },
  pill: {
    backgroundColor: "#1A1A1A",
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  pillTxt: { fontSize: 10, color: "#FFF", fontWeight: "600", fontFamily: SERIF_FONT },
});

const srt = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    fontFamily: SERIF_FONT,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F5F3F0",
    marginBottom: 6,
  },
  optTxt: { fontSize: 14, color: "#333", fontWeight: "500", fontFamily: SERIF_FONT },
  check: { color: "#C8902A", fontSize: 16, fontWeight: "800", fontFamily: SERIF_FONT },
});

const dtl = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  heroBox: { position: "relative" },
  heroImg: { width: "100%", height: 220 },
  heroFallback: {
    backgroundColor: "#F0ECE8",
    justifyContent: "center",
    alignItems: "center",
  },
  heroBadge: {
    position: "absolute",
    bottom: 12,
    left: 16,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroBadgeTxt: { color: "#FFF", fontSize: 12, fontWeight: "600", fontFamily: SERIF_FONT },
  body: { padding: 20 },
  carName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 14,
    lineHeight: 28,
    fontFamily: SERIF_FONT,
  },
  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF8EE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  priceLbl: { fontSize: 13, color: "#888", fontFamily: SERIF_FONT },
  priceVal: { fontSize: 22, fontWeight: "900", color: "#C8902A", fontFamily: SERIF_FONT },
  specTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
    fontFamily: SERIF_FONT,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  specItem: {
    flex: 1,
    backgroundColor: "#F5F3F0",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 3,
  },
  specVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 4,
    fontFamily: SERIF_FONT,
  },
  specLbl: { fontSize: 10, color: "#888", marginTop: 2, fontFamily: SERIF_FONT },
  ctaBtn: {
    backgroundColor: "#C8902A",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 8,
  },
  ctaTxt: { color: "#FFF", fontWeight: "700", fontSize: 15, fontFamily: SERIF_FONT },
  closeBtn: {
    backgroundColor: "#F0ECE8",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  closeTxt: { color: "#333", fontWeight: "600", fontSize: 14, fontFamily: SERIF_FONT },
});
