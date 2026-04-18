import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
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

const formatCurrency = (value: number) =>
  Number(value || 0).toLocaleString("vi-VN") + "đ";

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

const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export default function PaymentSuccessScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";
  const pageBg = isDark ? "#120F0D" : "#F4ECE4";

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const hasSavedNotification = useRef(false);

  const orderId = route?.params?.orderId || "VF000000";
  const userId = route?.params?.userId || "";
  const cartItems = Array.isArray(route?.params?.cartItems)
    ? route.params.cartItems
    : [];

  const computedSubTotal = cartItems.reduce(
    (sum: number, item: any) =>
      sum + Number(item?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  const subTotal = Number(route?.params?.subTotal ?? computedSubTotal);
  const discount = Number(route?.params?.discount ?? 0);
  const finalPrice = Number(
    route?.params?.finalPrice ?? Math.max(0, computedSubTotal - discount),
  );

  const createdAt = route?.params?.createdAt || new Date().toISOString();

  const [canceling, setCanceling] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  useEffect(() => {
    if (hasSavedNotification.current) return;

    const saveOrderNotification = async () => {
      try {
        await addNotification({
          type: "order",
          title: "Đặt mua thành công",
          message: `Đơn hàng #${orderId} của bạn đã được xác nhận thành công.`,
        });
        hasSavedNotification.current = true;
      } catch (error) {
        console.log("save order notification error:", error);
      }
    };

    saveOrderNotification();
  }, [orderId]);

  const handleCancelOrder = () => {
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
              body: JSON.stringify({ orderId, userId }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
              Alert.alert(
                "Thông báo",
                data.message || "Không thể hủy đơn hàng",
              );
              return;
            }

            setIsCanceled(true);
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: pageBg }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View
          style={[
            styles.iconCircle,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: isDark ? "#0F3D28" : "#E8FFF1",
            },
          ]}
        >
          <View style={styles.innerCircle}>
            <Feather name="check" size={46} color="#fff" />
          </View>
        </Animated.View>

        <Text style={[styles.title, { color: colors.text }]}>
          {isCanceled ? "Đơn hàng đã được hủy" : "Thanh toán thành công!"}
        </Text>

        <Text style={[styles.desc, { color: isDark ? "#94A3B8" : "#64748B" }]}>
          {isCanceled
            ? "Đơn hàng của bạn đã được cập nhật sang trạng thái hủy."
            : "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận thành công."}
        </Text>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: isDark ? colors.card : "#FFFFFF",
              borderColor: isDark ? "#334155" : "#E5E7EB",
            },
          ]}
        >
          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Mã đơn hàng
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              #{orderId}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Thời gian đặt
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatDateTime(createdAt)}
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
                styles.statusText,
                { color: isCanceled ? "#EF4444" : "#16A34A" },
              ]}
            >
              {isCanceled ? "Đã hủy" : "Đang xử lý"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: isDark ? colors.card : "#FFFFFF",
              borderColor: isDark ? "#334155" : "#E5E7EB",
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Chi tiết đơn hàng
          </Text>

          {cartItems.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Không có dữ liệu sản phẩm.
            </Text>
          ) : (
            cartItems.map((item: any, index: number) => (
              <View
                key={`order-item-${orderId}-${item?.product_id ?? item?.productId ?? item?.id ?? "unknown"}-${index}`}
                style={[
                  styles.itemRow,
                  {
                    borderBottomColor: isDark ? "#334155" : "#F1F5F9",
                  },
                ]}
              >
                <View style={styles.itemLeft}>
                  <Text style={[styles.itemName, { color: colors.text }]}>
                    {item?.name || "Sản phẩm"}
                  </Text>

                  <Text
                    style={[
                      styles.itemMeta,
                      { color: isDark ? "#94A3B8" : "#64748B" },
                    ]}
                  >
                    Số lượng: {item?.quantity || 1}
                  </Text>
                </View>

                <Text style={[styles.itemPrice, { color: colors.text }]}>
                  {formatCurrency(
                    Number(item?.price || 0) * Number(item?.quantity || 1),
                  )}
                </Text>
              </View>
            ))
          )}

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
                {formatCurrency(subTotal)}
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
                -{formatCurrency(discount)}
              </Text>
            </View>

            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Tổng thanh toán
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(finalPrice)}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate("inapp")}
        >
          <Text style={styles.btnText}>Tiếp tục mua sắm</Text>
        </Pressable>

        {!isCanceled && (
          <Pressable
            style={({ pressed }) => [
              styles.cancelBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleCancelOrder}
            disabled={canceling}
          >
            {canceling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={18} color="#fff" />
                <Text style={styles.cancelBtnText}>Hủy đơn hàng</Text>
              </>
            )}
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4ECE4",
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  innerCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
    textAlign: "center",
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    fontFamily: SERIF_FONT,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  statusText: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: SERIF_FONT,
    textAlign: "center",
    paddingVertical: 12,
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
    lineHeight: 18,
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
    color: "#16A34A",
  },
  btn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },
  cancelBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  cancelBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },
});
