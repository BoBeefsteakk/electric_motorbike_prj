import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import API_URL from "../../data/api/apis";
import { addNotification } from "../../data/notifications";
import { darkTheme, lightTheme } from "../../theme/colors";

type OrderItem = {
  id?: number;
  product_id?: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderDetailData = {
  id?: number;
  orderId: string;
  userId: string;
  subTotal: number;
  discount: number;
  finalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(v || 0));

const formatDateTime = (value?: string) => {
  if (!value) return "--/--/---- --:--";
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

export default function OrderDetailScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const orderId = route.params?.orderId;

  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/${orderId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setOrder({
          id: data.data.id,
          orderId: data.data.orderId || data.data.order_id,
          userId: data.data.userId || data.data.user_id,
          subTotal: Number(data.data.subTotal ?? data.data.sub_total ?? 0),
          discount: Number(data.data.discount ?? 0),
          finalPrice: Number(data.data.finalPrice ?? data.data.final_price ?? 0),
          status: data.data.status,
          createdAt: data.data.createdAt || data.data.created_at,
          items: Array.isArray(data.data.items) ? data.data.items : [],
        });
      } else {
        Alert.alert("Lỗi", data.message || "Không tìm thấy đơn hàng");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải chi tiết đơn hàng");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [navigation, orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleCancelOrder = () => {
    if (!order) return;

    Alert.alert("Hủy đơn hàng", "Bạn có chắc muốn hủy đơn hàng này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            setCanceling(true);

            const res = await fetch(`${API_URL}/api/orders/cancel`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.orderId,
                userId: order.userId,
              }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
              Alert.alert(
                "Thông báo",
                data.message || "Không thể hủy đơn hàng",
              );
              return;
            }

            await addNotification({
              type: "order",
              title: "Hủy đơn hàng thành công",
              message: `Đơn hàng #${order.orderId} đã được hủy thành công.`,
            });

            setOrder((prev) =>
              prev
                ? {
                    ...prev,
                    status: "Đã hủy",
                  }
                : prev,
            );

            Alert.alert("Thành công", "Đơn hàng đã được hủy.");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể kết nối server để hủy đơn.");
          } finally {
            setCanceling(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#00B14F" />
          <Text
            style={[
              styles.loadingText,
              { color: isDark ? "#94A3B8" : "#64748B" },
            ]}
          >
            Đang tải chi tiết đơn hàng...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) return null;

  const isCanceled = order.status === "Đã hủy";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
          Chi tiết đơn hàng
        </Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.card : "#fff",
              borderColor: isDark ? "#334155" : "#EAEAEA",
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Thông tin đơn hàng
          </Text>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Mã đơn
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              #{order.orderId}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Ngày đặt
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatDateTime(order.createdAt)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Trạng thái
            </Text>
            <Text
              style={[
                styles.infoValue,
                { color: isCanceled ? "#EF4444" : "#00B14F" },
              ]}
            >
              {order.status}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.card : "#fff",
              borderColor: isDark ? "#334155" : "#EAEAEA",
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Sản phẩm
          </Text>

          {order.items.map((item, index) => (
            <View
              key={`detail-${order.orderId}-${item.product_id ?? item.id ?? "item"}-${index}`}
              style={[
                styles.itemRow,
                {
                  borderBottomColor: isDark ? "#334155" : "#F0F0F0",
                },
              ]}
            >
              <View style={styles.itemLeft}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.itemMeta,
                    { color: isDark ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  Số lượng: {item.quantity}
                </Text>
              </View>

              <Text style={[styles.itemPrice, { color: colors.text }]}>
                {formatCurrency(Number(item.price) * Number(item.quantity))}
              </Text>
            </View>
          ))}

          <View style={styles.summaryWrap}>
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: isDark ? "#94A3B8" : "#64748B" },
                ]}
              >
                Tạm tính
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatCurrency(order.subTotal)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: isDark ? "#94A3B8" : "#64748B" },
                ]}
              >
                Giảm giá
              </Text>
              <Text style={[styles.summaryValue, { color: "#F59E0B" }]}>
                -{formatCurrency(order.discount)}
              </Text>
            </View>

            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Tổng thanh toán
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(order.finalPrice)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: isDark ? colors.card : "#fff",
            borderTopColor: isDark ? "#334155" : "#EBEBEB",
          },
        ]}
      >
        <Pressable
          style={[
            styles.cancelBtn,
            (canceling || isCanceled) && styles.cancelBtnDisabled,
          ]}
          onPress={handleCancelOrder}
          disabled={canceling || isCanceled}
        >
          {canceling ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.cancelBtnText}>
              {isCanceled ? "Đơn đã hủy" : "Hủy đơn hàng"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  scroll: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  summaryWrap: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#00B14F",
  },
  footer: {
    padding: 16,
    borderTopWidth: 0.5,
  },
  cancelBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelBtnDisabled: {
    opacity: 0.6,
  },
  cancelBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
