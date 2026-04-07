import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API_URL from "../data/api/apis";
import BEST_PRICE_DATA from "../data/bestPrice";

const { width } = Dimensions.get("window");

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

const SkeletonItem = () => {
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
      ]),
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.card, { opacity: anim }]}>
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#EBEBEB",
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
            backgroundColor: "#EBEBEB",
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "40%",
            backgroundColor: "#F2F2F2",
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "55%",
            backgroundColor: "#F2F2F2",
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

  const results = useCallback((): SearchItem[] => {
    let data = allData;
    if (typeFilter !== "all") data = data.filter((i) => i._type === typeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter((i) => i.name.toLowerCase().includes(q));
    }
    return data;
  }, [allData, query, typeFilter])();

  const handleSubmit = () => {
    if (!query.trim()) return;
    setHistory((prev) =>
      [query.trim(), ...prev.filter((h) => h !== query.trim())].slice(0, 10),
    );
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
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => {
            if (isMotorbike) navigation.navigate("best_price_detail", { id: item.id });
            else if (isCar) navigation.navigate("car_detail", { id: item.id });
            else navigation.navigate("accessory_detail", { id: item.id });
          }}
        >
          <View style={styles.cardImageBox}>
            <Image
              source={{ uri: imageUri }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={2}>
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
                <Text style={styles.priceLabel}>Giá từ</Text>
                <Text style={[styles.price, { color: catColor }]}>
                  {Number(item.price).toLocaleString("vi-VN")}đ
                </Text>
              </View>
              {rating && (
                <View style={styles.ratingBox}>
                  <FontAwesome name="star" size={11} color="#F5A623" />
                  <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  const showHistory = !query && history.length > 0;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color="#39B78D"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên xe, phụ kiện..."
            placeholderTextColor="#C0C0C0"
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
              <Ionicons name="close-circle" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterBarWrap}>
        {TYPE_FILTERS.map((f) => {
          const active = f.key === typeFilter;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, active && styles.filterActive]}
              onPress={() => setTypeFilter(f.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={f.icon as any}
                size={14}
                color={active ? "#fff" : "#888"}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Count */}
      {!loading && (
        <View style={styles.countRow}>
          <View style={styles.accentBar} />
          <Text style={styles.countText}>
            {query.trim()
              ? `${results.length} kết quả cho "${query}"`
              : `${results.length} sản phẩm`}
          </Text>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonItem key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={showHistory ? [] : results}
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
                  <Text style={styles.historyTitle}>Tìm kiếm gần đây</Text>
                  <TouchableOpacity onPress={() => setHistory([])}>
                    <Text style={styles.clearText}>Xóa tất cả</Text>
                  </TouchableOpacity>
                </View>
                {history.map((h, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.historyItem}
                    onPress={() => setQuery(h)}
                  >
                    <Ionicons name="time-outline" size={16} color="#BBB" />
                    <Text style={styles.historyText}>{h}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setHistory((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close" size={16} color="#CCC" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null
          }
          ListEmptyComponent={
            query.trim() ? (
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={52} color="#DDD" />
                <Text style={styles.emptyText}>Không tìm thấy "{query}"</Text>
                <Text style={styles.emptySub}>Thử tìm với từ khóa khác</Text>
              </View>
            ) : !showHistory ? (
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={52} color="#DDD" />
                <Text style={styles.emptyText}>Nhập tên xe để tìm kiếm</Text>
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

  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111" },

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
  searchInput: { flex: 1, fontSize: 15, color: "#111" },

  /* Filter tabs — full width, 4 equal buttons */
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
  filterActive: { backgroundColor: "#39B78D" },
  filterText: { fontSize: 12, fontWeight: "700", color: "#888" },
  filterTextActive: { color: "#fff" },

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
  countText: { fontSize: 13, color: "#AAA", fontWeight: "500" },

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
  cardName: { fontSize: 14, fontWeight: "700", color: "#111", lineHeight: 20 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 6,
  },
  priceLabel: { fontSize: 10, color: "#BBB", marginBottom: 1 },
  price: { fontSize: 14, fontWeight: "800" },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 12, color: "#999", fontWeight: "600" },

  historyBox: { marginBottom: 16 },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  clearText: { fontSize: 13, color: "#FF3B30", fontWeight: "600" },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  historyText: { flex: 1, fontSize: 14, color: "#555" },

  emptyBox: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyText: { fontSize: 16, color: "#CCC", fontWeight: "600" },
  emptySub: { fontSize: 13, color: "#DDD" },
});