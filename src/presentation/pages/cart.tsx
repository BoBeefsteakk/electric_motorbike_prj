import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Alert,
    Animated,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API_URL from "../../data/api/apis";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean;
}

interface Voucher {
  id: string;
  code: string;
  discount: number;
  minSpend: number;
  description: string;
}

const USER_ID = "user_test_123"; // TODO: thay bằng userId từ AsyncStorage sau khi có auth

const VOUCHERS_MOCK: Voucher[] = [
  {
    id: "1",
    code: "GIAM100K",
    discount: 100000,
    minSpend: 0,
    description: "Giảm 100K cho mọi đơn hàng",
  },
  {
    id: "2",
    code: "DATBIKE500",
    discount: 500000,
    minSpend: 50000000,
    description: "Giảm 500K cho đơn từ 50 Triệu",
  },
];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v,
  );

/* ── Skeleton ── */
const SkeletonCard = () => {
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
    <Animated.View style={[styles.card, { opacity: anim }]}>
      <View
        style={{
          width: 85,
          height: 85,
          backgroundColor: "#EBEBEB",
          borderRadius: 16,
        }}
      />
      <View style={{ flex: 1, marginLeft: 15, gap: 10 }}>
        <View
          style={{
            height: 14,
            width: "70%",
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

export default function CartScreen() {
  const navigation = useNavigation<any>();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVoucherModal, setVoucherModal] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  /* ── Fetch giỏ hàng từ MySQL ── */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart/${USER_ID}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.items)) {
        setCartItems(
          data.data.items.map((i: any) => ({ ...i, selected: false })),
        );
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.log("Lỗi fetch cart:", e);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [fetchCart]),
  );

  /* ── Actions ── */
  const removeItemDirect = async (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    try {
      await fetch(`${API_URL}/api/cart/remove-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, productId }),
      });
    } catch (e) {
      console.log("Lỗi xoá item:", e);
    }
  };

  const removeItem = (productId: string) => {
    Alert.alert("Xóa sản phẩm", "Bạn có chắc muốn bỏ sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => removeItemDirect(productId),
      },
    ]);
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    if (item.quantity === 1 && delta === -1) {
      Alert.alert("Xác nhận xoá", "Bạn có muốn xoá sản phẩm này không?", [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: () => removeItemDirect(productId),
        },
      ]);
      return;
    }
    const newQty = Math.max(1, item.quantity + delta);
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: newQty } : i,
      ),
    );
    try {
      await fetch(`${API_URL}/api/cart/update-quantity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, productId, quantity: newQty }),
      });
    } catch (e) {
      console.log("Lỗi update qty:", e);
    }
  };

  const toggleSelect = (productId: string) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, selected: !i.selected } : i,
      ),
    );
  const isAllSelected =
    cartItems.length > 0 && cartItems.every((i) => i.selected);
  const toggleSelectAll = () =>
    setCartItems((prev) =>
      prev.map((i) => ({ ...i, selected: !isAllSelected })),
    );

  const subTotal = useMemo(
    () =>
      cartItems
        .filter((i) => i.selected)
        .reduce((s, i) => s + i.price * i.quantity, 0),
    [cartItems],
  );
  const finalPrice = Math.max(0, subTotal - (appliedVoucher?.discount || 0));
  const selectedCount = cartItems.filter((i) => i.selected).length;

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert("Thông báo", msg);
  };

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter((i) => i.selected);
    if (!selectedItems.length) return;
    navigation.navigate("checkout", {
      cartItems: selectedItems,
      appliedVoucher,
      userId: USER_ID,
    });
  };

  const handleDeleteSelected = async () => {
    const ids = cartItems.filter((i) => i.selected).map((i) => i.productId);
    setCartItems((prev) => prev.filter((i) => !ids.includes(i.productId)));
    for (const id of ids) {
      try {
        await fetch(`${API_URL}/api/cart/remove-item`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: USER_ID, productId: id }),
        });
      } catch (e) {}
    }
  };

  /* ── Render item ── */
  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <Pressable
        style={styles.checkboxWrapper}
        onPress={() => toggleSelect(item.productId)}
        hitSlop={8}
      >
        <Ionicons
          name={item.selected ? "checkbox" : "square-outline"}
          size={24}
          color={item.selected ? "#000" : "#CCC"}
        />
      </Pressable>
      <View style={styles.imageBox}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoBox}>
        <View style={styles.cardTop}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable onPress={() => removeItem(item.productId)} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
          </Pressable>
        </View>
        <Text style={styles.itemSub}>Xe điện VinFast</Text>
        <View style={styles.cardBottom}>
          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
          <View style={styles.qtyControl}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, -1)}
            >
              <FontAwesome name="minus" size={12} color="#333" />
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, 1)}
            >
              <FontAwesome name="plus" size={12} color="#333" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ Hàng</Text>
        {cartItems.length > 0 && (
          <Pressable onPress={() => setIsEditMode((p) => !p)}>
            <Text style={styles.editBtn}>{isEditMode ? "Xong" : "Sửa"}</Text>
          </Pressable>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={{ padding: 20, gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(i) => i.productId}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            cartItems.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="cart-outline" size={80} color="#EEE" />
              <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
            </View>
          }
        />
      )}

      {/* Footer */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          {/* Voucher row */}
          <Pressable
            style={styles.voucherRow}
            onPress={() => setVoucherModal(true)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="ticket-outline" size={20} color="#FF8C00" />
              <Text style={styles.voucherLabel}>Voucher</Text>
            </View>
            <Text
              style={[
                styles.voucherValue,
                appliedVoucher && { color: "#00B14F" },
              ]}
            >
              {appliedVoucher
                ? `${appliedVoucher.code} (-${formatCurrency(appliedVoucher.discount)})`
                : "Chọn mã giảm giá"}
            </Text>
          </Pressable>

          {/* Action row */}
          <View style={styles.actionRow}>
            <Pressable style={styles.selectAllBtn} onPress={toggleSelectAll}>
              <Ionicons
                name={isAllSelected ? "checkbox" : "square-outline"}
                size={22}
                color={isAllSelected ? "#000" : "#CCC"}
              />
              <Text style={styles.selectAllText}>Tất cả</Text>
            </Pressable>
            <View style={styles.checkoutGroup}>
              <View>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalAmount}>
                  {formatCurrency(finalPrice)}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.checkoutBtn,
                  selectedCount === 0 && { opacity: 0.4 },
                  isEditMode && { backgroundColor: "#FF4D4D" },
                ]}
                disabled={selectedCount === 0}
                onPress={isEditMode ? handleDeleteSelected : handleCheckout}
              >
                <Text style={styles.checkoutText}>
                  {isEditMode ? `Xoá (${selectedCount})` : "Thanh toán"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Voucher Modal */}
      <Modal visible={isVoucherModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn Voucher</Text>
              <Pressable onPress={() => setVoucherModal(false)} hitSlop={12}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            {VOUCHERS_MOCK.map((v) => (
              <Pressable
                key={v.id}
                style={[
                  styles.voucherItem,
                  appliedVoucher?.id === v.id && styles.voucherItemActive,
                ]}
                onPress={() => {
                  setAppliedVoucher(v);
                  setVoucherModal(false);
                }}
              >
                <View style={styles.voucherItemLeft}>
                  <Text style={styles.voucherCode}>{v.code}</Text>
                  <Text style={styles.voucherDesc}>{v.description}</Text>
                </View>
                <Text style={styles.voucherDiscount}>
                  -{formatCurrency(v.discount)}
                </Text>
              </Pressable>
            ))}
            {appliedVoucher && (
              <Pressable
                style={styles.removeVoucherBtn}
                onPress={() => {
                  setAppliedVoucher(null);
                  setVoucherModal(false);
                }}
              >
                <Text style={styles.removeVoucherText}>Bỏ voucher</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  editBtn: { fontSize: 15, fontWeight: "700", color: "#007AFF" },

  listContent: { padding: 16, paddingBottom: 200 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxWrapper: { marginRight: 10, padding: 4 },
  imageBox: {
    width: 85,
    height: 85,
    backgroundColor: "#F8F8F8",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: { width: "85%", height: "85%" },
  infoBox: {
    flex: 1,
    marginLeft: 14,
    height: 85,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    paddingRight: 8,
  },
  itemSub: { fontSize: 12, color: "#AAA" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: { fontSize: 15, fontWeight: "800", color: "#111" },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { paddingHorizontal: 10, fontWeight: "700", fontSize: 14 },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: { color: "#CCC", fontSize: 16, fontWeight: "600" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 14,
    paddingBottom: 32,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 16,
  },

  voucherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  voucherLabel: { fontSize: 14, fontWeight: "600", color: "#111" },
  voucherValue: { fontSize: 13, color: "#AAA", fontWeight: "500" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectAllBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  selectAllText: { fontSize: 14, color: "#666" },
  checkoutGroup: { flexDirection: "row", alignItems: "center", gap: 14 },
  totalLabel: { fontSize: 11, color: "#AAA", marginBottom: 2 },
  totalAmount: { fontSize: 16, fontWeight: "800", color: "#111" },
  checkoutBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },
  checkoutText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  voucherItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F8F8F8",
    marginBottom: 10,
  },
  voucherItemActive: {
    backgroundColor: "#E8F8F5",
    borderWidth: 1.5,
    borderColor: "#00B14F",
  },
  voucherItemLeft: { flex: 1 },
  voucherCode: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginBottom: 3,
  },
  voucherDesc: { fontSize: 12, color: "#888" },
  voucherDiscount: { fontSize: 15, fontWeight: "800", color: "#FF4D4D" },
  removeVoucherBtn: { alignItems: "center", marginTop: 6, paddingVertical: 12 },
  removeVoucherText: { color: "#FF4D4D", fontWeight: "700", fontSize: 14 },
});
