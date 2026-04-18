import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppImage from "../../../components/AppImage";
import { ApiErrorState } from "../../../components/ApiFeedback";
import EmptyState from "../../../components/EmptyState";
import { useTheme } from "../../../../context/themeContext";
import API_URL from "../../../../data/api/apis";
import { darkTheme, lightTheme } from "../../../../theme/colors";

interface Store {
  id: number;
  name: string;
  address: string;
  rating: number;
  image: string;
  route?: string;
  description?: string;
}

const STORE_SEARCH_HISTORY_KEY = "STORE_SEARCH_HISTORY";

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const SkeletonRow = ({ dark }: { dark: boolean }) => {
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
      style={[
        styles.card,
        {
          opacity: anim,
          flexDirection: "row",
          height: 110,
          backgroundColor: dark ? "#1F2937" : "#fff",
          shadowOpacity: dark ? 0 : 0.07,
          elevation: dark ? 0 : 3,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#334155" : "transparent",
        },
      ]}
    >
      <View
        style={{
          width: 110,
          backgroundColor: dark ? "#334155" : "#EBEBEB",
        }}
      />
      <View style={{ flex: 1, padding: 14, gap: 8 }}>
        <View
          style={{
            height: 14,
            width: "70%",
            backgroundColor: dark ? "#334155" : "#EBEBEB",
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "50%",
            backgroundColor: dark ? "#293548" : "#F2F2F2",
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "90%",
            backgroundColor: dark ? "#293548" : "#F2F2F2",
            borderRadius: 6,
          }}
        />
      </View>
    </Animated.View>
  );
};

const RatingStars = ({ rating, dark }: { rating: number; dark: boolean }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array(full)
        .fill(0)
        .map((_, i) => (
          <FontAwesome
            key={`f${i}`}
            name="star"
            size={11}
            color="#F5A623"
            style={i > 0 ? { marginLeft: 2 } : {}}
          />
        ))}
      {half === 1 && (
        <FontAwesome
          name="star-half-empty"
          size={11}
          color="#F5A623"
          style={{ marginLeft: 2 }}
        />
      )}
      {Array(empty)
        .fill(0)
        .map((_, i) => (
          <FontAwesome
            key={`e${i}`}
            name="star-o"
            size={11}
            color={dark ? "#475569" : "#DDD"}
            style={{ marginLeft: 2 }}
          />
        ))}
      <Text
        style={{
          fontSize: 12,
          color: dark ? "#CBD5E1" : "#555",
          fontWeight: "600",
          marginLeft: 5,
          fontFamily: SERIF_FONT,
        }}
      >
        {rating}
      </Text>
    </View>
  );
};

export default function HomeStoreList() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const fetchStores = useCallback(async (preserveData = false) => {
    try {
      setError(null);

      const res = await fetch(`${API_URL}/api/stores`);

      if (!res.ok) {
        throw new Error(`fetch stores failed: ${res.status}`);
      }

      const data = await res.json();
      setStores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("Lỗi fetch stores:", e);
      if (!preserveData) {
        setStores([]);
      }
      setError("Không tải được dữ liệu");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchStores().finally(() => setLoading(false));
  }, [fetchStores]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const rawHistory = await AsyncStorage.getItem(STORE_SEARCH_HISTORY_KEY);
        const parsed = rawHistory ? JSON.parse(rawHistory) : [];
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.log("Lỗi load store search history:", e);
      }
    };

    loadSearchHistory();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStores(true);
    setRefreshing(false);
  }, [fetchStores]);

  const handleRetry = useCallback(async () => {
    setLoading(true);
    await fetchStores();
    setLoading(false);
  }, [fetchStores]);

  const filteredStores = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return stores;

    return stores.filter((item) => {
      const name = item.name?.toLowerCase?.() || "";
      const address = item.address?.toLowerCase?.() || "";

      return (
        name.includes(normalizedQuery) || address.includes(normalizedQuery)
      );
    });
  }, [searchQuery, stores]);

  const commitStoreSearchHistory = useCallback(async () => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return;

    const nextHistory = [
      normalizedQuery,
      ...searchHistory.filter((item) => item !== normalizedQuery),
    ].slice(0, 8);

    setSearchHistory(nextHistory);

    try {
      await AsyncStorage.setItem(
        STORE_SEARCH_HISTORY_KEY,
        JSON.stringify(nextHistory)
      );
    } catch (e) {
      console.log("Lỗi save store search history:", e);
    }
  }, [searchHistory, searchQuery]);

  const goStoreDetail = (item: Store) => {
    navigation.navigate("store_detail", {
      storeId: item.id,
      description: item.description,
    });
  };

  const renderItem = ({ item, index }: { item: Store; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.card : "#fff",
          shadowOpacity: isDark ? 0 : 0.07,
          elevation: isDark ? 0 : 3,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? "#334155" : "transparent",
        },
      ]}
      onPress={() => goStoreDetail(item)}
    >
      <View style={styles.imageBox}>
        <AppImage
          uri={`${API_URL}${item.image}`}
          style={styles.image}
          dark={isDark}
          fallbackIcon="storefront-outline"
          fallbackLabel="Ảnh cửa hàng chưa sẵn sàng"
        />
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.storeName, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <RatingStars rating={item.rating} dark={isDark} />

        <View style={styles.addressRow}>
          <FontAwesome
            name="map-marker"
            size={12}
            color={isDark ? "#94A3B8" : "#BBB"}
          />
          <Text
            style={[styles.addressText, { color: isDark ? "#94A3B8" : "#999" }]}
            numberOfLines={2}
          >
            {item.address}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.viewBtn,
            { backgroundColor: isDark ? "#2563EB" : "#111" },
          ]}
          activeOpacity={0.8}
          onPress={() => goStoreDetail(item)}
        >
          <Text style={styles.viewText}>Xem cửa hàng</Text>
          <FontAwesome name="arrow-right" size={11} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.safe,
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
            backgroundColor: pageBg,
            borderBottomColor: isDark ? "#243041" : "#EBEBEB",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: isDark ? "#1F2937" : "#F5F5F5",
            },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-left"
            size={15}
            color={isDark ? "#FFF" : "#111"}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Danh Sách Cửa Hàng
        </Text>

        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={{ padding: 16, gap: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonRow key={i} dark={isDark} />
          ))}
        </View>
      ) : error && stores.length === 0 ? (
        <ApiErrorState
          dark={isDark}
          title="Không tải được dữ liệu"
          description="Danh sách cửa hàng hiện chưa thể tải. Vui lòng thử lại."
          onRetry={handleRetry}
        />
      ) : (
        <>
          <View style={styles.searchWrap}>
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: isDark ? "#0F172A" : "#FFF8F3",
                  borderColor: isDark ? "#334155" : "#E8D7CB",
                },
              ]}
            >
              <FontAwesome
                name="search"
                size={14}
                color={isDark ? "#94A3B8" : "#8B7163"}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                  commitStoreSearchHistory();
                  Keyboard.dismiss();
                }}
                placeholder="Tìm cửa hàng theo tên hoặc địa chỉ"
                placeholderTextColor={isDark ? "#64748B" : "#A8A29E"}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>
          </View>

          {!searchQuery && searchHistory.length > 0 ? (
            <View style={styles.historyWrap}>
              <View style={styles.historyHeader}>
                <Text
                  style={[
                    styles.historyTitle,
                    { color: isDark ? "#94A3B8" : "#78716C" },
                  ]}
                >
                  Tìm kiếm gần đây
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    setSearchHistory([]);
                    try {
                      await AsyncStorage.removeItem(STORE_SEARCH_HISTORY_KEY);
                    } catch (e) {
                      console.log("Lỗi clear store search history:", e);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.historyClearText}>Xóa</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                data={searchHistory}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.historyRow}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSearchQuery(item);
                      Keyboard.dismiss();
                    }}
                    style={[
                      styles.historyChip,
                      {
                        backgroundColor: isDark ? "#0F172A" : "#FFF8F3",
                        borderColor: isDark ? "#334155" : "#E8D7CB",
                      },
                    ]}
                  >
                    <FontAwesome
                      name="history"
                      size={12}
                      color={isDark ? "#94A3B8" : "#8B7163"}
                    />
                    <Text
                      style={[
                        styles.historyChipText,
                        { color: isDark ? "#CBD5E1" : "#6B4F3C" },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}

          <View
            style={[
              styles.subHeader,
              {
                backgroundColor: pageBg,
                borderBottomColor: isDark ? "#243041" : "#F0F0F0",
              },
            ]}
          >
            <View style={styles.accentBar} />
            <Text
              style={[styles.subTitle, { color: isDark ? "#94A3B8" : "#888" }]}
            >
              {filteredStores.length} / {stores.length} cửa hàng
            </Text>
          </View>

          {stores.length === 0 ? (
            <EmptyState
              dark={isDark}
              icon="storefront-outline"
              title="Chưa có cửa hàng"
              description="Danh sách cửa hàng hiện chưa có dữ liệu. Vui lòng thử lại sau."
              actionLabel="Tải lại"
              onAction={handleRetry}
            />
          ) : filteredStores.length === 0 ? (
            <EmptyState
              dark={isDark}
              icon="search-outline"
              title="Không tìm thấy cửa hàng"
              description="Thử đổi từ khóa tìm kiếm hoặc kiểm tra lại địa chỉ."
              actionLabel="Xóa tìm kiếm"
              onAction={() => setSearchQuery("")}
            />
          ) : (
            <FlatList
              data={filteredStores}
              keyExtractor={(i) => String(i.id)}
              renderItem={renderItem}
              contentContainerStyle={[
                styles.list,
                { paddingBottom: insets.bottom + 32 },
              ]}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={isDark ? "#E5E7EB" : "#C47A4A"}
                  colors={["#C47A4A"]}
                  progressBackgroundColor={isDark ? "#1F2937" : "#FFFFFF"}
                />
              }
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4ECE4" },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: SERIF_FONT,
    paddingVertical: 0,
  },
  historyWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 12,
    fontFamily: SERIF_FONT,
  },
  historyClearText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C47A4A",
    fontFamily: SERIF_FONT,
  },
  historyRow: {
    gap: 8,
  },
  historyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  historyChipText: {
    fontSize: 12,
    fontFamily: SERIF_FONT,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  accentBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#FF8C00",
    marginRight: 10,
  },
  subTitle: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
    fontFamily: SERIF_FONT,
  },

  list: { padding: 16 },

  card: {
    flexDirection: "row",
    height: 130,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageBox: { width: 120, height: 130, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  indexBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  indexText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    fontFamily: SERIF_FONT,
  },

  info: { flex: 1, padding: 14, justifyContent: "space-between" },
  storeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
    fontFamily: SERIF_FONT,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
    gap: 5,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: "#999",
    lineHeight: 17,
    fontFamily: SERIF_FONT,
  },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#111",
  },
  viewText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },
});
