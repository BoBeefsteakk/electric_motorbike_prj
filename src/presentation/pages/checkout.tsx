import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
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
import API_URL from "../../data/api/apis";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const userId = route.params?.userId || "user_test_123";
  const cartItems = route.params?.cartItems || [];
  const appliedVoucher = route.params?.appliedVoucher || null;

  const subTotal = cartItems.reduce(
    (s: number, i: any) => s + i.price * i.quantity,
    0,
  );
  const discount = appliedVoucher?.discount || 0;
  const finalPrice = Math.max(0, subTotal - discount);

  const [paying, setPaying] = useState(false);

  const handlePayment = async () => {
    if (cartItems.length === 0) return;
    try {
      setPaying(true);
      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cartItems,
          subTotal,
          discount,
          finalPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigation.navigate("PaymentSuccess", { orderId: data.orderId });
      } else {
        Alert.alert("Lỗi", data.message || "Không thể tạo đơn hàng");
      }
    } catch (e: any) {
      Alert.alert("Lỗi", "Không thể kết nối server. Hãy kiểm tra lại kết nối!");
    } finally {
      setPaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Xác Nhận Đơn Hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Danh sách sản phẩm */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sản phẩm đã chọn</Text>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
          ) : (
            cartItems.map((item: any) => (
              <View key={item.productId} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Chi tiết thanh toán */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>{formatCurrency(subTotal)}</Text>
          </View>
          {appliedVoucher && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Giảm giá ({appliedVoucher.code})
              </Text>
              <Text style={[styles.priceValue, { color: "#FF4D4F" }]}>
                -{formatCurrency(discount)}
              </Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatCurrency(finalPrice)}</Text>
          </View>
        </View>

        {/* Ghi chú bảo mật */}
        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={15} color="#AAA" />
          <Text style={styles.secureText}>Thanh toán an toàn và bảo mật</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.payBtn,
            (paying || cartItems.length === 0) && { opacity: 0.5 },
          ]}
          onPress={handlePayment}
          disabled={paying || cartItems.length === 0}
        >
          {paying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <FontAwesome name="check-circle" size={18} color="#fff" />
              <Text style={styles.payText}>Thanh toán ngay</Text>
            </View>
          )}
        </Pressable>
      </View>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  scroll: { padding: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 3 },
  itemQty: { fontSize: 12, color: "#999" },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#111" },
  emptyText: { color: "#CCC", textAlign: "center", paddingVertical: 8 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: { fontSize: 14, color: "#888" },
  priceValue: { fontSize: 14, fontWeight: "500", color: "#333" },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
  },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#111" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#00B14F" },

  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
    marginBottom: 24,
  },
  secureText: { fontSize: 12, color: "#AAA" },

  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#EBEBEB",
  },
  payBtn: {
    backgroundColor: "#00B14F",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#00B14F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
