import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import API_URL from "../../data/api/apis";
import { darkTheme, lightTheme } from "../../theme/colors";
import { ApiErrorState, ApiSkeleton } from "../components/ApiFeedback";
import EmptyState from "../components/EmptyState";

const AUTH_USER_KEY = "AUTH_USER";
const ORDER_SEARCH_HISTORY_KEY = "ORDER_SEARCH_HISTORY";
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

interface OrderItem {
  id?: number;
  product_id?: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id?: number;
  orderId: string;
  userId?: string;
  subTotal?: number;
  discount?: number;
  finalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

type TimelineState = "completed" | "current" | "upcoming" | "canceled";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(v || 0));

const STATUS_COLOR: Record<string, string> = {
  "Đang xử lý": "#FF8C00",
  "Đã xác nhận": "#2D6BE4",
  "Đang giao": "#9B51E0",
  "Hoàn thành": "#00B14F",
  "Đã hủy": "#FF4D4D",
};

const ORDER_FILTERS = [
  "Tất cả",
  "Đang xử lý",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

const ORDER_TIMELINE = [
  "Đang xử lý",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
];

const STATUS_INDEX: Record<string, number> = {
  "Đang xử lý": 0,
  "Đã xác nhận": 1,
  "Đang giao": 2,
  "Hoàn thành": 3,
};

export default function OrderScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";
  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const fetchOrders = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError(null);

      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const authUser = rawUser ? JSON.parse(rawUser) : null;
      const userId = authUser?.account;

      if (!userId) {
        setOrders([]);
        return;
      }

      const res = await fetch(`${API_URL}/api/orders/user/${userId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
        setError("Không tải được dữ liệu");
      }
    } catch (e) {
      console.log("Lỗi fetch orders:", e);
      setOrders([]);
      setError("Không tải được dữ liệu");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const rawHistory = await AsyncStorage.getItem(ORDER_SEARCH_HISTORY_KEY);
        const parsed = rawHistory ? JSON.parse(rawHistory) : [];
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.log("Lỗi load order search history:", e);
      }
    };

    loadSearchHistory();
  }, []);

  const commitOrderSearchHistory = useCallback(async () => {
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return;

    const nextHistory = [
      normalizedQuery,
      ...searchHistory.filter((item) => item !== normalizedQuery),
    ].slice(0, 8);

    setSearchHistory(nextHistory);

    try {
      await AsyncStorage.setItem(
        ORDER_SEARCH_HISTORY_KEY,
        JSON.stringify(nextHistory)
      );
    } catch (e) {
      console.log("Lỗi save order search history:", e);
    }
  }, [searchHistory, searchQuery]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchOrders(false);
    } finally {
      setRefreshing(false);
    }
  }, [fetchOrders]);

  const handleDeleteCanceledOrder = useCallback(async (order: Order) => {
    Alert.alert(
      "Xóa đơn hàng",
      `Bạn muốn xóa đơn #${order.orderId} khỏi danh sách?`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingOrderId(order.orderId);

              const res = await fetch(
                `${API_URL}/api/orders/${encodeURIComponent(
                  order.orderId
                )}?userId=${encodeURIComponent(order.userId || "")}`,
                {
                  method: "DELETE",
                }
              );

              const data = await res.json();

              if (!res.ok || !data.success) {
                Alert.alert(
                  "Thông báo",
                  data.message || "Không thể xóa đơn hàng đã hủy"
                );
                return;
              }

              setOrders((prev) =>
                prev.filter((item) => item.orderId !== order.orderId)
              );
            } catch (e) {
              Alert.alert("Lỗi", "Không thể xóa đơn hàng đã hủy");
            } finally {
              setDeletingOrderId(null);
            }
          },
        },
      ]
    );
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return orders.filter((item) => {
      const matchesStatus =
        statusFilter === "Tất cả" || item.status === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedQuery) return true;

      const firstItemName = item.items?.[0]?.name?.toLowerCase?.() || "";

      return (
        item.orderId.toLowerCase().includes(normalizedQuery) ||
        firstItemName.includes(normalizedQuery)
      );
    });
  }, [orders, searchQuery, statusFilter]);

  const renderItem = ({ item }: { item: Order }) => {
    const statusColor = STATUS_COLOR[item.status] ?? "#888";
    const firstItem = item.items?.[0];
    const isCanceled = item.status === "Đã hủy";
    const isDeleting = deletingOrderId === item.orderId;
    const currentStatusIndex = STATUS_INDEX[item.status] ?? 0;

    const getTimelineState = (index: number): TimelineState => {
      if (isCanceled) {
        return index === 0 ? "completed" : "canceled";
      }

      if (index < currentStatusIndex) return "completed";
      if (index === currentStatusIndex) return "current";
      return "upcoming";
    };

    const getTimelineColors = (state: TimelineState) => {
      switch (state) {
        case "completed":
          return {
            dot: "#16A34A",
            line: "#16A34A",
            text: isDark ? "#CBD5E1" : "#475569",
          };
        case "current":
          return {
            dot: "#C47A4A",
            line: isDark ? "#334155" : "#E5E7EB",
            text: "#C47A4A",
          };
        case "canceled":
          return {
            dot: "#FF4D4D",
            line: "#FF4D4D",
            text: "#FF4D4D",
          };
        default:
          return {
            dot: isDark ? "#334155" : "#D6D3D1",
            line: isDark ? "#334155" : "#E5E7EB",
            text: isDark ? "#64748B" : "#94A3B8",
          };
      }
    };

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("OrderDetail", {
            orderId: item.orderId,
          })
        }
        style={({ pressed }) => [
          styles.orderCard,
          {
            backgroundColor: isDark ? colors.card : "#fff",
            shadowOpacity: isDark ? 0 : 0.06,
            elevation: isDark ? 0 : 2,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#334155" : "transparent",
          },
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={[styles.orderId, { color: colors.text }]}>
              #{item.orderId}
            </Text>
            <Text
              style={[
                styles.orderDate,
                { color: isDark ? "#94A3B8" : "#AAA" },
              ]}
            >
              {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                borderColor: statusColor,
                backgroundColor: `${statusColor}15`,
              },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: isDark ? "#334155" : "#F0F0F0" },
          ]}
        />

        {firstItem ? (
          <View style={styles.productRow}>
            <View
              style={[
                styles.productIconBox,
                { backgroundColor: isDark ? "#0F172A" : "#F5F5F5" },
              ]}
            >
              <FontAwesome name="shopping-bag" size={18} color="#00B14F" />
            </View>

            <View style={styles.productInfo}>
              <Text
                style={[styles.productName, { color: colors.text }]}
                numberOfLines={1}
              >
                {firstItem.name}
              </Text>

              {item.items.length > 1 && (
                <Text
                  style={[
                    styles.moreItems,
                    { color: isDark ? "#94A3B8" : "#AAA" },
                  ]}
                >
                  va {item.items.length - 1} sản phẩm khác
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.productQty,
                { color: isDark ? "#CBD5E1" : "#888" },
              ]}
            >
              x{firstItem.quantity}
            </Text>
          </View>
        ) : null}

        <View
          style={[
            styles.timelineBox,
            {
              backgroundColor: isDark ? "#0F172A" : "#FAF7F4",
              borderColor: isDark ? "#334155" : "#EADFD6",
            },
          ]}
        >
          <Text
            style={[
              styles.timelineHeading,
              { color: isDark ? "#94A3B8" : "#78716C" },
            ]}
          >
            Tiến trình đơn hàng
          </Text>

          <View style={styles.timelineTrack}>
            {ORDER_TIMELINE.map((label, index) => {
              const state = getTimelineState(index);
              const timelineColors = getTimelineColors(state);
              const isLast = index === ORDER_TIMELINE.length - 1;

              return (
                <React.Fragment key={`${item.orderId}-${label}`}>
                  <View style={styles.timelineStep}>
                    <View
                      style={[
                        styles.timelineDot,
                        { backgroundColor: timelineColors.dot },
                      ]}
                    />
                    <Text
                      style={[
                        styles.timelineLabel,
                        { color: timelineColors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.timelineConnector,
                        { backgroundColor: timelineColors.line },
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.orderFooter,
            { borderTopColor: isDark ? "#334155" : "#F0F0F0" },
          ]}
        >
          <View style={styles.orderFooterLeft}>
            <Text
              style={[
                styles.itemCount,
                { color: isDark ? "#94A3B8" : "#AAA" },
              ]}
            >
              {item.items.length} sản phẩm
            </Text>

            {isCanceled && (
              <Pressable
                onPress={(event: any) => {
                  event?.stopPropagation?.();
                  handleDeleteCanceledOrder(item);
                }}
                disabled={isDeleting}
                style={[
                  styles.deleteOrderBtn,
                  isDeleting && styles.deleteOrderBtnDisabled,
                ]}
              >
                <Text style={styles.deleteOrderBtnText}>
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.totalGroup}>
            <Text
              style={[
                styles.totalLabel,
                { color: isDark ? "#94A3B8" : "#888" },
              ]}
            >
              Tổng:{" "}
            </Text>
            <Text style={styles.totalValue}>
              {formatCurrency(item.finalPrice)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const listHeader = (
    <View style={styles.filterSection}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: isDark ? "#0F172A" : "#FFF8F3",
            borderColor: isDark ? "#334155" : "#E8D7CB",
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={isDark ? "#94A3B8" : "#8B7163"}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={commitOrderSearchHistory}
          placeholder="Tìm theo mã đơn hoặc tên sản phẩm"
          placeholderTextColor={isDark ? "#64748B" : "#A8A29E"}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {searchHistory.length > 0 ? (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text
              style={[
                styles.historyTitle,
                { color: isDark ? "#94A3B8" : "#78716C" },
              ]}
            >
              Tìm kiếm gần đây
            </Text>
            <Pressable
              onPress={async () => {
                setSearchHistory([]);
                try {
                  await AsyncStorage.removeItem(ORDER_SEARCH_HISTORY_KEY);
                } catch (e) {
                  console.log("Lỗi clear order search history:", e);
                }
              }}
            >
              <Text style={styles.historyClearText}>Xóa</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={searchHistory}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.historyRow}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSearchQuery(item);
                }}
                style={[
                  styles.historyChip,
                  {
                    backgroundColor: isDark ? "#0F172A" : "#FFF8F3",
                    borderColor: isDark ? "#334155" : "#E8D7CB",
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={13}
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
              </Pressable>
            )}
          />
        </View>
      ) : null}

      <FlatList
        horizontal
        data={ORDER_FILTERS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const active = item === statusFilter;
          return (
            <Pressable
              onPress={() => setStatusFilter(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active
                    ? "#C47A4A"
                    : isDark
                      ? "#0F172A"
                      : "#FFF8F3",
                  borderColor: active
                    ? "#C47A4A"
                    : isDark
                      ? "#334155"
                      : "#E8D7CB",
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: active ? "#FFFFFF" : isDark ? "#CBD5E1" : "#6B4F3C",
                  },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: pageBg }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: pageBg,
            borderBottomColor: isDark ? "#334155" : "#EBEBEB",
          },
        ]}
      >
        <Pressable
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? "#0F172A" : "#F5F5F5" },
          ]}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#E5E7EB" : "#111"}
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Đơn Hàng Của Tôi
        </Text>

        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <ApiSkeleton dark={isDark} variant="list" count={3} />
      ) : error && orders.length === 0 ? (
        <ApiErrorState
          dark={isDark}
          title="Không tải được dữ liệu"
          description="Danh sách đơn hàng hiện chưa thể tải. Vui lòng thử lại."
          onRetry={fetchOrders}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item, index) =>
            item.orderId
              ? `order-${item.orderId}`
              : `order-fallback-${item.id ?? index}`
          }
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#C47A4A"
              colors={["#C47A4A"]}
            />
          }
          contentContainerStyle={[
            styles.list,
            filteredOrders.length === 0 && { flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              dark={isDark}
              title={
                orders.length === 0
                  ? "Chưa có đơn hàng nào"
                  : "Không tìm thấy đơn phù hợp"
              }
              description={
                orders.length === 0
                  ? "Các đơn đã đặt và đã hủy sẽ hiển thị tại đây sau khi anh hoàn tất giao dịch."
                  : "Thử đổi từ khóa tìm kiếm hoặc chọn trạng thái khác."
              }
              actionLabel={orders.length === 0 ? "Khám phá xe ngay" : "Đặt lại bộ lọc"}
              onPressAction={
                orders.length === 0
                  ? () => navigation.navigate("home")
                  : () => {
                      setSearchQuery("");
                      setStatusFilter("Tất cả");
                    }
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    fontFamily: SERIF_FONT,
    color: "#111",
  },

  list: {
    padding: 16,
  },

  filterSection: {
    marginBottom: 16,
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

  historySection: {
    marginTop: 12,
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
    paddingBottom: 2,
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

  filterRow: {
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderId: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
    color: "#111",
    marginBottom: 3,
  },

  orderDate: {
    fontSize: 12,
    fontFamily: SERIF_FONT,
    color: "#AAA",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  divider: {
    height: 0.5,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  productIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: SERIF_FONT,
    color: "#333",
  },

  moreItems: {
    fontSize: 12,
    fontFamily: SERIF_FONT,
    color: "#AAA",
    marginTop: 2,
  },

  productQty: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: SERIF_FONT,
    color: "#888",
  },

  timelineBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  timelineHeading: {
    fontSize: 12,
    fontFamily: SERIF_FONT,
    marginBottom: 10,
  },

  timelineTrack: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  timelineStep: {
    width: 52,
    alignItems: "center",
  },

  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },

  timelineLabel: {
    fontSize: 10,
    lineHeight: 13,
    textAlign: "center",
    fontFamily: SERIF_FONT,
  },

  timelineConnector: {
    flex: 1,
    height: 2,
    marginTop: 4,
    marginHorizontal: 4,
    borderRadius: 999,
  },

  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
  },

  orderFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemCount: {
    fontSize: 12,
    fontFamily: SERIF_FONT,
    color: "#AAA",
  },

  deleteOrderBtn: {
    backgroundColor: "#FFE8E8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  deleteOrderBtnDisabled: {
    opacity: 0.7,
  },

  deleteOrderBtnText: {
    color: "#FF4D4D",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  totalGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 13,
    fontFamily: SERIF_FONT,
    color: "#888",
  },

  totalValue: {
    fontSize: 15,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
    color: "#FF4D4D",
  },
});
