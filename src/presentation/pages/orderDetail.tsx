import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
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
import { ApiErrorState, ApiSkeleton } from "../components/ApiFeedback";
import { showFeedback } from "../utils/feedback";

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

type TimelineStep = {
  key: string;
  title: string;
  description: string;
  state: "completed" | "current" | "upcoming" | "canceled";
};

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

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

const ORDER_PROGRESS: Array<{
  key: string;
  title: string;
  description: string;
}> = [
  {
    key: "processing",
    title: "Đang xử lý",
    description: "Đơn hàng đã được ghi nhận và đang chờ xác nhận.",
  },
  {
    key: "confirmed",
    title: "Đã xác nhận",
    description: "Đơn hàng đã được xác nhận và chuẩn bị xuất kho.",
  },
  {
    key: "shipping",
    title: "Đang giao",
    description: "Đơn hàng đang được vận chuyển tới địa chỉ của bạn.",
  },
  {
    key: "done",
    title: "Hoàn thành",
    description: "Đơn hàng đã giao thành công.",
  },
];

const STATUS_INDEX: Record<string, number> = {
  "Đang xử lý": 0,
  "Đã xác nhận": 1,
  "Đang giao": 2,
  "Hoàn thành": 3,
};

const getTimelineSteps = (
  status: string,
  createdAt?: string,
): TimelineStep[] => {
  if (status === "Đã hủy") {
    return [
      {
        key: "created",
        title: "Đơn đã tạo",
        description: `Đặt lúc ${formatDateTime(createdAt)}`,
        state: "completed",
      },
      {
        key: "canceled",
        title: "Đã hủy",
        description: "Đơn hàng đã được hủy và không tiếp tục xử lý.",
        state: "canceled",
      },
    ];
  }

  const currentIndex = STATUS_INDEX[status] ?? 0;

  return ORDER_PROGRESS.map((step, index) => ({
    key: step.key,
    title: step.title,
    description:
      index === 0 ? `Đặt lúc ${formatDateTime(createdAt)}` : step.description,
    state:
      index < currentIndex
        ? "completed"
        : index === currentIndex
          ? "current"
          : "upcoming",
  }));
};

export default function OrderDetailScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const orderId = route.params?.orderId;

  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) {
      setError("Không tải được dữ liệu");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

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
        setOrder(null);
        setError(data.message || "Không tải được dữ liệu");
      }
    } catch (error) {
      setOrder(null);
      setError("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

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
              showFeedback({
                type: "error",
                title: "Thông báo",
                message: data.message || "Không thể hủy đơn hàng.",
              });
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

            showFeedback({
              type: "success",
              message: "Đơn hàng đã được hủy.",
            });
          } catch (error) {
            showFeedback({
              type: "error",
              message: "Không thể kết nối server để hủy đơn.",
            });
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
        style={[styles.container, { backgroundColor: pageBg }]}
      >
        <ApiSkeleton dark={isDark} variant="detail" count={2} />
      </SafeAreaView>
    );
  }

  if (error && !order) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: pageBg }]}
      >
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
            Chi tiết đơn hàng
          </Text>

          <View style={{ width: 38 }} />
        </View>

        <ApiErrorState
          dark={isDark}
          title="Không tải được dữ liệu"
          description="Chi tiết đơn hàng hiện chưa thể tải. Vui lòng thử lại."
          onRetry={fetchOrderDetail}
        />
      </SafeAreaView>
    );
  }

  if (!order) return null;

  const isCanceled = order.status === "Đã hủy";
  const timelineSteps = getTimelineSteps(order.status, order.createdAt);

  const getStepColors = (state: TimelineStep["state"]) => {
    switch (state) {
      case "completed":
        return {
          dotBg: "#16A34A",
          dotBorder: "#16A34A",
          line: "#16A34A",
          title: colors.text,
          description: isDark ? "#94A3B8" : "#64748B",
          icon: "checkmark",
          iconColor: "#FFFFFF",
        };
      case "current":
        return {
          dotBg: "#C47A4A",
          dotBorder: "#C47A4A",
          line: isDark ? "#334155" : "#E5E7EB",
          title: colors.text,
          description: "#C47A4A",
          icon: "ellipse",
          iconColor: "#FFFFFF",
        };
      case "canceled":
        return {
          dotBg: "#EF4444",
          dotBorder: "#EF4444",
          line: "#EF4444",
          title: "#EF4444",
          description: isDark ? "#FCA5A5" : "#B91C1C",
          icon: "close",
          iconColor: "#FFFFFF",
        };
      default:
        return {
          dotBg: isDark ? "#0F172A" : "#FFFFFF",
          dotBorder: isDark ? "#334155" : "#D6D3D1",
          line: isDark ? "#334155" : "#E5E7EB",
          title: isDark ? "#CBD5E1" : "#64748B",
          description: isDark ? "#64748B" : "#94A3B8",
          icon: "ellipse-outline",
          iconColor: isDark ? "#94A3B8" : "#94A3B8",
        };
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: pageBg }]}
    >
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
            Tiến trình đơn hàng
          </Text>

          {timelineSteps.map((step, index) => {
            const stepColors = getStepColors(step.state);
            const isLast = index === timelineSteps.length - 1;

            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: stepColors.dotBg,
                        borderColor: stepColors.dotBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name={stepColors.icon as any}
                      size={12}
                      color={stepColors.iconColor}
                    />
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: stepColors.line },
                      ]}
                    />
                  )}
                </View>

                <View
                  style={[
                    styles.timelineContent,
                    !isLast && styles.timelineContentSpaced,
                  ]}
                >
                  <Text
                    style={[
                      styles.timelineTitle,
                      { color: stepColors.title },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineDescription,
                      { color: stepColors.description },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>
            );
          })}
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
    backgroundColor: "#F4ECE4",
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: SERIF_FONT,
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
    fontFamily: SERIF_FONT,
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
    fontFamily: SERIF_FONT,
    marginBottom: 14,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  timelineRail: {
    width: 26,
    alignItems: "center",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 6,
    borderRadius: 999,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineContentSpaced: {
    paddingBottom: 18,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },
  timelineDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: SERIF_FONT,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: SERIF_FONT,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
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
    fontFamily: SERIF_FONT,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
    fontFamily: SERIF_FONT,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
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
    fontFamily: SERIF_FONT,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
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
    fontFamily: SERIF_FONT,
  },
});
