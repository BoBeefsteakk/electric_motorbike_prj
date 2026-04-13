import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import API_URL from "../../data/api/apis";
import { darkTheme, lightTheme } from "../../theme/colors";

const AUTH_USER_KEY = "AUTH_USER";

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

const SkeletonCard = ({ dark }: { dark: boolean }) => {
  const anim = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
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
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        {
          backgroundColor: dark ? "#1F2937" : "#EBEBEB",
          opacity: anim,
        },
      ]}
    />
  );
};

export default function OrderScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

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
      }
    } catch (e) {
      console.log("Lỗi fetch orders:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const renderItem = ({ item }: { item: Order }) => {
    const statusColor = STATUS_COLOR[item.status] ?? "#888";
    const firstItem = item.items?.[0];

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
                  và {item.items.length - 1} sản phẩm khác
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
            styles.orderFooter,
            { borderTopColor: isDark ? "#334155" : "#F0F0F0" },
          ]}
        >
          <Text
            style={[
              styles.itemCount,
              { color: isDark ? "#94A3B8" : "#AAA" },
            ]}
          >
            {item.items.length} sản phẩm
          </Text>

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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? colors.card : "#fff",
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
        <View style={styles.list}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} dark={isDark} />
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) =>
            item.orderId
              ? `order-${item.orderId}`
              : `order-fallback-${item.id ?? index}`
          }
          renderItem={renderItem}
          contentContainerStyle={[
            styles.list,
            orders.length === 0 && { flex: 1, justifyContent: "center" },
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name="receipt-outline"
                size={52}
                color={isDark ? "#475569" : "#D1D5DB"}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Chưa có đơn hàng nào
              </Text>
              <Text
                style={[
                  styles.emptySub,
                  { color: isDark ? "#94A3B8" : "#AAA" },
                ]}
              >
                Các đơn đã đặt và đã hủy sẽ hiển thị tại đây.
              </Text>
            </View>
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
    color: "#111",
  },

  list: {
    padding: 16,
  },

  skeletonCard: {
    height: 140,
    borderRadius: 20,
    marginBottom: 12,
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
    color: "#111",
    marginBottom: 3,
  },

  orderDate: {
    fontSize: 12,
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
    color: "#333",
  },

  moreItems: {
    fontSize: 12,
    color: "#AAA",
    marginTop: 2,
  },

  productQty: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
  },

  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
  },

  itemCount: {
    fontSize: 12,
    color: "#AAA",
  },

  totalGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 13,
    color: "#888",
  },

  totalValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FF4D4D",
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#CCC",
  },

  emptySub: {
    fontSize: 13,
    color: "#DDD",
    textAlign: "center",
  },
});
