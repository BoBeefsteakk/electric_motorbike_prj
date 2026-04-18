import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../context/themeContext";
import API_URL from "../data/api/apis";
import BEST_PRICE_DATA from "../data/bestPrice";
import { darkTheme, lightTheme } from "../theme/colors";

const { width } = Dimensions.get("window");
const SEARCH_HISTORY_KEY = "SEARCH_SCREEN_HISTORY";
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

interface Motorbike {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  _type: "motorbike";
}
interface Car {
  id: number;
  name: string;
  price: number;
  image: string;
  _type: "car";
}
interface Accessory {
  id: number;
  name: string;
  price: number;
  image: string;
  _type: "accessory";
}
type SearchItem = Motorbike | Car | Accessory;

const CATEGORY_COLOR: Record<string, string> = {
  pho_thong: "#FF8C00",
  trung_cap: "#2D6BE4",
  cao_cap: "#9B51E0",
};
const CATEGORY_LABEL: Record<string, string> = {
  pho_thong: "Phổ Thông",
  trung_cap: "Trung Cấp",
  cao_cap: "Cao Cấp",
};

const TYPE_FILTERS = [
  { key: "all", label: "Tất Cả", icon: "grid-outline" },
  { key: "motorbike", label: "Xe Máy", icon: "bicycle-outline" },
  { key: "car", label: "Ô Tô", icon: "car-outline" },
  { key: "accessory", label: "Phụ Kiện", icon: "bag-outline" },
];

const SkeletonItem = ({ dark }: { dark: boolean }) => {
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

  const sk1 = dark ? "#233041" : "#EBEBEB";
  const sk2 = dark ? "#1B2635" : "#F2F2F2";
  const cardBg = dark ? "#1F2937" : "#FFFFFF";

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          backgroundColor: cardBg,
          shadowOpacity: dark ? 0 : 0.07,
          elevation: dark ? 0 : 3,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#334155" : "transparent",
        },
      ]}
    >
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: sk1,
          borderRadius: 14,
        }}
      />
      <View
        style={{ flex: 1, marginLeft: 14, gap: 10, justifyContent: "center" }}
      >
        <View
          style={{
            height: 14,
            width: "75%",
            backgroundColor: sk1,
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "40%",
            backgroundColor: sk2,
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "55%",
            backgroundColor: sk2,
            borderRadius: 6,
          }}
        />
      </View>
    </Animated.View>
  );
};

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [motoRes, carRes, accRes] = await Promise.all([
          fetch(`${API_URL}/api/products`)
            .then((r) => r.json())
            .catch(() => []),
          fetch(`${API_URL}/api/cars`)
            .then((r) => r.json())
            .catch(() => []),
          fetch(`${API_URL}/api/accessories`)
            .then((r) => r.json())
            .catch(() => []),
        ]);
        const toArr = (res: any) =>
          Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        const motorbikes: Motorbike[] = toArr(motoRes).map((i: any) => ({
          ...i,
          _type: "motorbike",
        }));
        const cars: Car[] = toArr(carRes).map((i: any) => ({
          ...i,
          _type: "car",
        }));
        const accessories: Accessory[] = toArr(accRes).map((i: any) => ({
          ...i,
          _type: "accessory",
        }));
        setAllData([...motorbikes, ...cars, ...accessories]);
      } catch (e) {
        console.log("fetch search error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const rawHistory = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        const parsed = rawHistory ? JSON.parse(rawHistory) : [];
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.log("load search history error:", e);
      }
    };

    loadSearchHistory();
  }, []);

  const results = useCallback((): SearchItem[] => {
    let data = allData;
    if (typeFilter !== "all") data = data.filter((i) => i._type === typeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter((i) => i.name.toLowerCase().includes(q));
    }
    return data;
  }, [allData, query, typeFilter])();

  const commitSearchHistory = useCallback(async () => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    const nextHistory = [
      normalizedQuery,
      ...history.filter((h) => h !== normalizedQuery),
    ].slice(0, 10);

    setHistory(nextHistory);

    try {
      await AsyncStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(nextHistory)
      );
    } catch (e) {
      console.log("save search history error:", e);
    }
  }, [history, query]);

  const handleSubmit = () => {
    commitSearchHistory();
    Keyboard.dismiss();
  };

  const renderItem = useCallback(
    ({ item }: { item: SearchItem }) => {
      const isMotorbike = item._type === "motorbike";
      const isCar = item._type === "car";
      const imageUri =
        isMotorbike || isCar
          ? `${API_URL}/images/${encodeImagePath(item.image)}`
          : `${API_URL}/${encodeImagePath(item.image)}`;
      const rating = isMotorbike
        ? (BEST_PRICE_DATA[(item as Motorbike).id]?.rating ?? null)
        : null;
      const catLabel = isMotorbike
        ? (CATEGORY_LABEL[(item as Motorbike).category] ?? "Xe Máy")
        : isCar
          ? "Ô Tô"
          : "Phụ Kiện";
      const catColor = isMotorbike
        ? (CATEGORY_COLOR[(item as Motorbike).category] ?? "#FF8C00")
        : isCar
          ? "#0CAF60"
          : "#E84393";

      return (
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              shadowOpacity: isDark ? 0 : 0.07,
              elevation: isDark ? 0 : 3,
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? "#334155" : "transparent",
            },
          ]}
          activeOpacity={0.85}
          onPress={() => {
            if (isMotorbike)
              navigation.navigate("best_price_detail", { id: item.id });
            else if (isCar) navigation.navigate("car_detail", { id: item.id });
            else navigation.navigate("accessory_detail", { id: item.id });
          }}
        >
          <View
            style={[
              styles.cardImageBox,
              { backgroundColor: isDark ? "#0F172A" : "#F5F5F5" },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.cardInfo}>
            <Text
              style={[styles.cardName, { color: colors.text }]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: catColor + "15",
                  borderColor: catColor + "50",
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: catColor }]}>
                {catLabel}
              </Text>
            </View>
            <View style={styles.cardFooter}>
              <View>
                <Text
                  style={[
                    styles.priceLabel,
                    { color: isDark ? "#94A3B8" : "#BBB" },
                  ]}
                >
                  Giá từ
                </Text>
                <Text style={[styles.price, { color: catColor }]}>
                  {Number(item.price).toLocaleString("vi-VN")}đ
                </Text>
              </View>
              {rating && (
                <View style={styles.ratingBox}>
                  <FontAwesome name="star" size={11} color="#F5A623" />
                  <Text
                    style={[
                      styles.ratingText,
                      { color: isDark ? "#CBD5E1" : "#999" },
                    ]}
                  >
                    {rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, colors, isDark]
  );

  const showHistory = !query && history.length > 0;

  return (
    <View
      style={[
        styles.safe,
        { paddingTop: insets.top, backgroundColor: pageBg },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Tìm kiếm
        </Text>
      </View>

      <View style={styles.searchBarWrap}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.card,
              shadowOpacity: isDark ? 0 : 0.07,
              elevation: isDark ? 0 : 4,
              borderColor: isDark ? "#1E3A2F" : "#39B78D20",
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color="#39B78D"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Tìm tên xe, phụ kiện..."
            placeholderTextColor={isDark ? "#64748B" : "#C0C0C0"}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={isDark ? "#94A3B8" : "#CCC"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterBarWrap}>
        {TYPE_FILTERS.map((f) => {
          const active = f.key === typeFilter;
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: active
                    ? "#39B78D"
                    : isDark
                      ? "#1F2937"
                      : "#EFEFEF",
                  borderWidth: isDark && !active ? 1 : 0,
                  borderColor: isDark && !active ? "#334155" : "transparent",
                },
              ]}
              onPress={() => setTypeFilter(f.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={f.icon as any}
                size={14}
                color={active ? "#fff" : isDark ? "#CBD5E1" : "#888"}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.filterText,
                  { color: active ? "#fff" : isDark ? "#CBD5E1" : "#888" },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!loading && (
        <View style={styles.countRow}>
          <View style={styles.accentBar} />
          <Text
            style={[styles.countText, { color: isDark ? "#94A3B8" : "#AAA" }]}
          >
            {query.trim()
              ? `${results.length} kết quả cho "${query}"`
              : `${results.length} sản phẩm`}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonItem key={i} dark={isDark} />
          ))}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, i) => `${item._type}-${item.id}-${i}`}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={10}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={
            showHistory ? (
              <View style={styles.historyBox}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyTitle, { color: colors.text }]}>
                    Tìm kiếm gần đây
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      setHistory([]);
                      try {
                        await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
                      } catch (e) {
                        console.log("clear search history error:", e);
                      }
                    }}
                  >
                    <Text style={styles.clearText}>Xóa tất cả</Text>
                  </TouchableOpacity>
                </View>
                {history.map((h, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.historyItem,
                      {
                        borderBottomColor: isDark ? "#233041" : "#F0F0F0",
                      },
                    ]}
                    onPress={() => {
                      setQuery(h);
                      Keyboard.dismiss();
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={isDark ? "#94A3B8" : "#BBB"}
                    />
                    <Text
                      style={[
                        styles.historyText,
                        { color: isDark ? "#CBD5E1" : "#555" },
                      ]}
                    >
                      {h}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        const nextHistory = history.filter((_, idx) => idx !== i);
                        setHistory(nextHistory);
                        try {
                          await AsyncStorage.setItem(
                            SEARCH_HISTORY_KEY,
                            JSON.stringify(nextHistory)
                          );
                        } catch (e) {
                          console.log("remove search history item error:", e);
                        }
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={isDark ? "#64748B" : "#CCC"}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ) : <View />
          }
          ListEmptyComponent={
            query.trim() ? (
              <View style={styles.emptyBox}>
                <Ionicons
                  name="search-outline"
                  size={52}
                  color={isDark ? "#475569" : "#DDD"}
                />
                <Text
                  style={[
                    styles.emptyText,
                    { color: isDark ? "#CBD5E1" : "#CCC" },
                  ]}
                >
                  Không tìm thấy "{query}"
                </Text>
                <Text
                  style={[
                    styles.emptySub,
                    { color: isDark ? "#64748B" : "#DDD" },
                  ]}
                >
                  Thử tìm với từ khóa khác
                </Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons
                  name="search-outline"
                  size={52}
                  color={isDark ? "#475569" : "#DDD"}
                />
                <Text
                  style={[
                    styles.emptyText,
                    { color: isDark ? "#CBD5E1" : "#CCC" },
                  ]}
                >
                  Nhập tên xe để tìm kiếm
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, marginTop: 15 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  searchBarWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1.5,
    borderColor: "#39B78D20",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  filterBarWrap: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    fontFamily: SERIF_FONT,
  },

  countRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  accentBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#39B78D",
    marginRight: 8,
  },
  countText: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "500",
    fontFamily: SERIF_FONT,
  },

  list: { paddingHorizontal: 16, paddingTop: 4 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardImageBox: { width: 110, height: 110, backgroundColor: "#F5F5F5" },
  cardImage: { width: "100%", height: "100%" },
  cardInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    lineHeight: 20,
    fontFamily: SERIF_FONT,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "700", fontFamily: SERIF_FONT },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 6,
  },
  priceLabel: {
    fontSize: 10,
    color: "#BBB",
    marginBottom: 1,
    fontFamily: SERIF_FONT,
  },
  price: { fontSize: 14, fontWeight: "800", fontFamily: SERIF_FONT },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },

  historyBox: { marginBottom: 16 },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  clearText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    fontFamily: SERIF_FONT,
  },

  emptyBox: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyText: {
    fontSize: 16,
    color: "#CCC",
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },
  emptySub: { fontSize: 13, color: "#DDD", fontFamily: SERIF_FONT },
});
