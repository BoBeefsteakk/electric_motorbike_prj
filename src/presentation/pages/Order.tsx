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

const USER_ID = "user_test_123"; // TODO: lấy từ AsyncStorage sau khi có auth

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
interface Order {
  _id: number;
  orderId: string;
  finalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

const STATUS_COLOR: Record<string, string> = {
  "Đang xử lý": "#FF8C00",
  "Đã xác nhận": "#2D6BE4",
  "Đang giao": "#9B51E0",
  "Hoàn thành": "#00B14F",
  "Đã huỷ": "#FF4D4D",
};

/* ── Skeleton ── */
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
  }, []);

  return (
    <Animated.View
      style={[
        styles.orderCard,
        {
          opacity: anim,
          backgroundColor: dark ? "#1F2937" : "#fff",
          shadowOpacity: dark ? 0 : 0.06,
          elevation: dark ? 0 : 2,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#334155" : "transparent",
        },
      ]}
    >
      <View
        style={{
          height: 14,
          width: "50%",
          backgroundColor: dark ? "#334155" : "#EBEBEB",
          borderRadius: 6,
          marginBottom: 12,
        }}
      />
      <View
        style={{
          height: 12,
          width: "80%",
          backgroundColor: dark ? "#293548" : "#F2F2F2",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />
      <View
        style={{
          height: 12,
          width: "40%",
          backgroundColor: dark ? "#293548" : "#F2F2F2",
          borderRadius: 6,
        }}
      />
    </Animated.View>
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
      const res = await fetch(`${API_URL}/api/orders/user/${USER_ID}`);
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
        style={[
          styles.orderCard,
          {
            backgroundColor: colors.card,
            shadowOpacity: isDark ? 0 : 0.06,
            elevation: isDark ? 0 : 2,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? "#334155" : "transparent",
          },
        ]}
        onPress={() => {}}
      >
        {/* Header */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={[styles.orderId, { color: colors.text }]}>
              #{item.orderId}
            </Text>
            <Text
              style={[styles.orderDate, { color: isDark ? "#94A3B8" : "#AAA" }]}
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
                backgroundColor: statusColor + "18",
                borderColor: statusColor + "55",
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

        {/* Sản phẩm đại diện */}
        {firstItem && (
          <View style={styles.productRow}>
            <View
              style={[
                styles.productIconBox,
                { backgroundColor: isDark ? "#0F172A" : "#F5F5F5" },
              ]}
            >
              <FontAwesome
                name="motorcycle"
                size={22}
                color={isDark ? "#94A3B8" : "#999"}
              />
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
        )}

        {/* Footer */}
        <View
          style={[
            styles.orderFooter,
            { borderTopColor: isDark ? "#334155" : "#F0F0F0" },
          ]}
        >
          <Text
            style={[styles.itemCount, { color: isDark ? "#94A3B8" : "#AAA" }]}
          >
            {item.items.length} sản phẩm
          </Text>

          <View style={styles.totalGroup}>
            <Text
              style={[
                styles.totalLabel,
                { color: isDark ? "#CBD5E1" : "#888" },
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
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: isDark ? "#334155" : "#EBEBEB",
          },
        ]}
      >
        <Pressable
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? "#1F2937" : "#F5F5F5" },
          ]}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Đơn Hàng Của Tôi
        </Text>

        <Pressable
          style={[
            styles.backBtn,
            { backgroundColor: isDark ? "#1F2937" : "#F5F5F5" },
          ]}
          onPress={fetchOrders}
          hitSlop={12}
        >
          <Ionicons name="refresh" size={20} color={colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <View style={{ padding: 16, gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} dark={isDark} />
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i) => String(i._id)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.list,
            orders.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name="receipt-outline"
                size={72}
                color={isDark ? "#475569" : "#DDD"}
              />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? "#94A3B8" : "#CCC" },
                ]}
              >
                Chưa có đơn hàng nào
              </Text>
              <Text
                style={[
                  styles.emptySub,
                  { color: isDark ? "#64748B" : "#DDD" },
                ]}
              >
                Hãy mua xe VinFast đầu tiên của bạn!
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

  list: { padding: 16 },

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

  statusDot: { width: 6, height: 6, borderRadius: 3 },

  statusText: { fontSize: 12, fontWeight: "700" },

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

  productInfo: { flex: 1, marginLeft: 12 },

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
  },
});
