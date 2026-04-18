import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  DeviceEventEmitter,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import API_URL from "../../data/api/apis";
import { darkTheme, lightTheme } from "../../theme/colors";
import EmptyState from "../components/EmptyState";

const AUTH_USER_KEY = "AUTH_USER";
const getCartCacheKey = (userId: string) => `CART_CACHE_${userId}`;
const getPendingCheckoutKey = (userId: string) =>
  `PENDING_CHECKOUT_CART_${userId}`;
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean;
  colorId?: number | null;
  colorName?: string | null;
  colorValue?: string | null;
}
interface Voucher {
  id: string;
  code: string;
  discount: number;
  minSpend: number;
  description: string;
}

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

const fmt = (v: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);

/* ── Toast popup (dùng cho "Thêm vào giỏ") ── */
export function showAddToCartToast(name: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(`✓ Đã thêm "${name}" vào giỏ hàng`, ToastAndroid.SHORT);
  }
}

/* ── In-app Toast (dùng được cả iOS) ── */
export const CartToastRef = React.createRef<{ show: (msg: string) => void }>();

export const CartToast = React.forwardRef<{ show: (msg: string) => void }, {}>(
  (_, ref) => {
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState("");
    const opacity = useRef(new Animated.Value(0)).current;

    React.useImperativeHandle(ref, () => ({
      show(message: string) {
        setMsg(message);
        setVisible(true);
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.delay(1800),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      },
    }));

    if (!visible) return null;

    return (
      <Animated.View style={[toastStyles.wrap, { opacity }]}>
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={toastStyles.text}>{msg}</Text>
      </Animated.View>
    );
  },
);

const toastStyles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 9999,
  },
  text: { color: "#fff", fontSize: 14, fontWeight: "600", flex: 1 },
});

/* ── Skeleton ── */
const SkeletonCard = ({ dark = false }: { dark?: boolean }) => {
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
        styles.card,
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
          width: 85,
          height: 85,
          backgroundColor: dark ? "#334155" : "#EBEBEB",
          borderRadius: 16,
        }}
      />
      <View style={{ flex: 1, marginLeft: 15, gap: 10 }}>
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
            width: "40%",
            backgroundColor: dark ? "#475569" : "#F2F2F2",
            borderRadius: 6,
          }}
        />
        <View
          style={{
            height: 12,
            width: "55%",
            backgroundColor: dark ? "#475569" : "#F2F2F2",
            borderRadius: 6,
          }}
        />
      </View>
    </Animated.View>
  );
};

const getCartItemKey = (item: {
  productId: string;
  colorId?: number | null;
  colorName?: string | null;
}) =>
  `${item.productId}__${item.colorId ?? 0}__${item.colorName ?? "Mặc định"}`;

const safeEncodePath = (path: string) =>
  path
    .split("/")
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");

const buildImageUri = (image?: string) => {
  if (!image) return "";

  const trimmed = image.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/images/")) {
    return `${API_URL}${trimmed}`;
  }

  if (trimmed.startsWith("images/")) {
    return `${API_URL}/${safeEncodePath(trimmed)}`;
  }

  return `${API_URL}/images/${safeEncodePath(trimmed)}`;
};

const normalizeCartItems = (items: any[]): CartItem[] =>
  items.map((i: any) => ({
    ...i,
    selected: false,
    colorId: i.colorId ?? null,
    colorName: i.colorName ?? null,
    colorValue: i.colorValue ?? null,
  }));

const serializeCartItems = (items: CartItem[]) =>
  items.map((item) => ({
    ...item,
    selected: false,
  }));

export default function CartScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const pageBg = theme === "dark" ? "#120F0D" : "#F4ECE4";
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isVoucherModal, setVoucherModal] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const persistCartCache = useCallback(async (items: CartItem[]) => {
    try {
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.account;

      if (!userId) return;

      await AsyncStorage.setItem(
        getCartCacheKey(userId),
        JSON.stringify(serializeCartItems(items)),
      );
    } catch (e) {
      console.log("persist cart cache error:", e);
    }
  }, []);

  const resolveCartAfterCheckout = useCallback(
    async (userId: string, serverItems: CartItem[]) => {
      const pendingRaw = await AsyncStorage.getItem(getPendingCheckoutKey(userId));

      if (!pendingRaw) {
        return serverItems;
      }

      let pending:
        | {
            remainingItems: CartItem[];
            selectedKeys: string[];
          }
        | null = null;

      try {
        pending = JSON.parse(pendingRaw);
      } catch {
        pending = null;
      }

      if (!pending) {
        await AsyncStorage.removeItem(getPendingCheckoutKey(userId));
        return serverItems;
      }

      const serverKeys = new Set(serverItems.map(getCartItemKey));
      const selectedStillInCart = pending.selectedKeys.some((key) =>
        serverKeys.has(key),
      );

      if (selectedStillInCart) {
        await AsyncStorage.removeItem(getPendingCheckoutKey(userId));
        return serverItems;
      }

      if (!pending.remainingItems.length) {
        await AsyncStorage.removeItem(getPendingCheckoutKey(userId));
        return serverItems;
      }

      const hasAllRemaining = pending.remainingItems.every((item) =>
        serverKeys.has(getCartItemKey(item)),
      );

      if (hasAllRemaining) {
        await AsyncStorage.removeItem(getPendingCheckoutKey(userId));
        return serverItems;
      }

      const merged = new Map<string, CartItem>();

      serverItems.forEach((item) => {
        merged.set(getCartItemKey(item), { ...item, selected: false });
      });

      pending.remainingItems.forEach((item) => {
        const key = getCartItemKey(item);
        if (!merged.has(key)) {
          merged.set(key, { ...item, selected: false });
        }
      });

      return Array.from(merged.values());
    },
    [],
  );

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.account;

      if (!userId) {
        setCartItems([]);
        return;
      }

      const res = await fetch(
        `${API_URL}/api/cart/${encodeURIComponent(userId)}`,
      );
      const data = await res.json();

      const normalizedItems =
        data.success && Array.isArray(data.data?.items)
          ? normalizeCartItems(data.data.items)
          : [];

      const resolvedItems = await resolveCartAfterCheckout(
        userId,
        normalizedItems,
      );

      setCartItems(resolvedItems);
      await persistCartCache(resolvedItems);
    } catch (e) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [persistCartCache, resolveCartAfterCheckout]);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [fetchCart]),
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("cartUpdated", () => {
      fetchCart();
    });

    return () => sub.remove();
  }, [fetchCart]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchCart();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCart]);

  const removeItem = async (
    productId: string,
    colorId?: number | null,
    colorName?: string | null,
  ) => {
    const keyToRemove = getCartItemKey({
      productId,
      colorId: colorId ?? null,
      colorName: colorName ?? null,
    });

    const nextItems = cartItems.filter((i) => getCartItemKey(i) !== keyToRemove);
    setCartItems(nextItems);
    persistCartCache(nextItems);

    try {
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.account;

      if (!userId) return;

      await fetch(`${API_URL}/api/cart/remove-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          colorId: colorId ?? null,
        }),
      });

      DeviceEventEmitter.emit("cartUpdated");
    } catch (e) {
      console.log("remove error:", e);
    }
  };

  const updateQuantity = async (
    productId: string,
    delta: number,
    colorId?: number | null,
    colorName?: string | null,
  ) => {
    const key = getCartItemKey({
      productId,
      colorId: colorId ?? null,
      colorName: colorName ?? null,
    });
    const item = cartItems.find((i) => getCartItemKey(i) === key);

    if (!item) return;

    if (item.quantity === 1 && delta === -1) {
      removeItem(productId, colorId, colorName);
      return;
    }

    const newQty = Math.max(1, item.quantity + delta);

    const nextItems = cartItems.map((i) =>
      getCartItemKey(i) === key ? { ...i, quantity: newQty } : i,
    );
    setCartItems(nextItems);
    persistCartCache(nextItems);

    try {
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.account;

      if (!userId) return;

      await fetch(`${API_URL}/api/cart/update-quantity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          quantity: newQty,
          colorId: colorId ?? null,
        }),
      });

      DeviceEventEmitter.emit("cartUpdated");
    } catch (e) {
      console.log("update quantity error:", e);
    }
  };

  const toggleSelect = (key: string) =>
    setCartItems((prev) =>
      prev.map((i) =>
        getCartItemKey(i) === key ? { ...i, selected: !i.selected } : i,
      ),
    );

  const isAllSelected =
    cartItems.length > 0 && cartItems.every((i) => i.selected);

  const toggleSelectAll = () =>
    setCartItems((prev) =>
      prev.map((i) => ({ ...i, selected: !isAllSelected })),
    );

  const selectedCount = cartItems.filter((i) => i.selected).length;

  const subTotal = useMemo(
    () =>
      cartItems
        .filter((i) => i.selected)
        .reduce((s, i) => s + i.price * i.quantity, 0),
    [cartItems],
  );

  const finalPrice = Math.max(0, subTotal - (appliedVoucher?.discount ?? 0));

  const handleCheckout = async () => {
    const selected = cartItems.filter((i) => i.selected);
    if (!selected.length) return;

    try {
      const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.account;

      if (!userId) {
        return;
      }

      const remainingItems = cartItems
        .filter((item) => !item.selected)
        .map((item) => ({ ...item, selected: false }));

      await AsyncStorage.setItem(
        getPendingCheckoutKey(userId),
        JSON.stringify({
          remainingItems,
          selectedKeys: selected.map(getCartItemKey),
        }),
      );

      navigation.navigate("checkout", {
        cartItems: selected,
        appliedVoucher,
        userId,
      });
    } catch (e) {
      console.log("checkout user error:", e);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const itemKey = getCartItemKey(item);

    const handleNavigateToDetail = () => {
      if (item.productId.startsWith("car_")) {
        const id = Number(item.productId.replace("car_", ""));
        navigation.navigate("car_detail", { id });
        return;
      }

      if (item.productId.startsWith("acc_")) {
        const id = Number(item.productId.replace("acc_", ""));
        navigation.navigate("accessory_detail", { id });
        return;
      }

      navigation.navigate("best_price_detail", {
        id: Number(item.productId),
      });
    };

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleNavigateToDetail}
        style={[
        styles.card,
        {
          backgroundColor: theme === "dark" ? colors.card : "#fff",
          shadowOpacity: theme === "dark" ? 0 : 0.06,
          elevation: theme === "dark" ? 0 : 2,
          borderWidth: theme === "dark" ? 1 : 0,
            borderColor: theme === "dark" ? "#334155" : "transparent",
          },
        ]}
      >
        <Pressable
          style={styles.checkboxWrapper}
          onPress={() => toggleSelect(itemKey)}
          hitSlop={8}
        >
          <Ionicons
            name={item.selected ? "checkbox" : "square-outline"}
            size={24}
            color={
              item.selected ? "#39B78D" : theme === "dark" ? "#64748B" : "#CCC"
            }
          />
        </Pressable>

        <View
          style={[
            styles.imageBox,
            { backgroundColor: theme === "dark" ? "#0F172A" : "#F8F8F8" },
          ]}
        >
          <Image
            source={{ uri: buildImageUri(item.image) }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoBox}>
          <View style={styles.cardTop}>
            <Text
              style={[styles.itemName, { color: colors.text }]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Pressable
              onPress={() =>
                removeItem(item.productId, item.colorId, item.colorName)
              }
              hitSlop={10}
            >
              <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
            </Pressable>
          </View>

          <Text
            style={[
              styles.itemSub,
              { color: theme === "dark" ? "#94A3B8" : "#BBB" },
            ]}
          >
            Xe điện VinFast
          </Text>

          <View style={styles.colorRow}>
            <Text
              style={[
                styles.metaLabel,
                { color: theme === "dark" ? "#CBD5E1" : "#666" },
              ]}
            >
              Màu đã chọn:
            </Text>
            <View
              style={[
                styles.colorDot,
                {
                  backgroundColor: item.colorValue || "#DDD",
                  borderColor: theme === "dark" ? "#475569" : "#DDD",
                },
              ]}
            />
            <Text
              style={[
                styles.metaValue,
                { color: theme === "dark" ? "#F8FAFC" : "#222" },
              ]}
            >
              {item.colorName || "Mặc định"}
            </Text>
          </View>

          <View style={styles.cardBottom}>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              {fmt(item.price)}
            </Text>
            <View
              style={[
                styles.qtyControl,
                { backgroundColor: theme === "dark" ? "#0F172A" : "#F0F0F0" },
              ]}
            >
              <Pressable
                style={styles.qtyBtn}
                onPress={() =>
                  updateQuantity(
                    item.productId,
                    -1,
                    item.colorId,
                    item.colorName,
                  )
                }
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={theme === "dark" ? "#E2E8F0" : "#333"}
                />
              </Pressable>
              <Text
                style={[
                  styles.qtyText,
                  { color: theme === "dark" ? "#F8FAFC" : "#111" },
                ]}
              >
                {item.quantity}
              </Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() =>
                  updateQuantity(
                    item.productId,
                    +1,
                    item.colorId,
                    item.colorName,
                  )
                }
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={theme === "dark" ? "#E2E8F0" : "#333"}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      <View
        style={[
          styles.header,
          {
            backgroundColor: pageBg,
            borderBottomColor: theme === "dark" ? "#243041" : "#EBEBEB",
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Giỏ Hàng
        </Text>
        {cartItems.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{cartItems.length}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={{ padding: 16, gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} dark={theme === "dark"} />
          ))}
        </View>
      ) : cartItems.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          dark={theme === "dark"}
          title="Giỏ hàng đang trống"
          description="Chưa có sản phẩm nào trong giỏ. Chọn xe hoặc phụ kiện để tiếp tục mua sắm."
          actionLabel="Khám phá xe ngay"
          onPressAction={() => navigation.navigate("home")}
        />
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(i) => getCartItemKey(i)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#C47A4A"
              colors={["#C47A4A"]}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 180 },
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {!loading && cartItems.length > 0 && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 12,
              backgroundColor: pageBg,
              shadowOpacity: theme === "dark" ? 0 : 0.08,
              elevation: theme === "dark" ? 0 : 18,
              borderTopWidth: theme === "dark" ? 1 : 0,
              borderTopColor: theme === "dark" ? "#243041" : "transparent",
            },
          ]}
        >
          <Pressable
            style={[
              styles.voucherRow,
              { borderBottomColor: theme === "dark" ? "#243041" : "#F0F0F0" },
            ]}
            onPress={() => setVoucherModal(true)}
          >
            <View style={styles.voucherLeft}>
              <Ionicons name="pricetag-outline" size={16} color="#39B78D" />
              <Text style={[styles.voucherLabel, { color: colors.text }]}>
                Voucher
              </Text>
            </View>
            <View style={styles.voucherRight}>
              <Text
                style={[
                  styles.voucherValue,
                  {
                    color: appliedVoucher
                      ? "#39B78D"
                      : theme === "dark"
                        ? "#94A3B8"
                        : "#AAA",
                    fontWeight: appliedVoucher ? "700" : "500",
                  },
                ]}
              >
                {appliedVoucher
                  ? `${appliedVoucher.code} (-${fmt(appliedVoucher.discount)})`
                  : "Chọn mã giảm giá"}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme === "dark" ? "#94A3B8" : "#CCC"}
              />
            </View>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable style={styles.selectAllBtn} onPress={toggleSelectAll}>
              <Ionicons
                name={isAllSelected ? "checkbox" : "square-outline"}
                size={22}
                color={
                  isAllSelected
                    ? "#39B78D"
                    : theme === "dark"
                      ? "#64748B"
                      : "#CCC"
                }
              />
              <Text
                style={[
                  styles.selectAllText,
                  { color: theme === "dark" ? "#CBD5E1" : "#666" },
                ]}
              >
                Tất cả
              </Text>
            </Pressable>
            <View style={styles.checkoutGroup}>
              <View>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: theme === "dark" ? "#94A3B8" : "#AAA" },
                  ]}
                >
                  Tổng cộng
                </Text>
                <Text style={[styles.totalAmount, { color: colors.text }]}>
                  {fmt(finalPrice)}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.checkoutBtn,
                  selectedCount === 0 && styles.checkoutBtnDisabled,
                ]}
                disabled={selectedCount === 0}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutText}>
                  Thanh toán{selectedCount > 0 ? ` (${selectedCount})` : ""}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <Modal visible={isVoucherModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor: pageBg,
                borderTopWidth: theme === "dark" ? 1 : 0,
                borderTopColor: theme === "dark" ? "#243041" : "transparent",
              },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: theme === "dark" ? "#475569" : "#E0E0E0" },
              ]}
            />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Chọn Voucher
              </Text>
              <Pressable onPress={() => setVoucherModal(false)} hitSlop={12}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme === "dark" ? "#E2E8F0" : "#333"}
                />
              </Pressable>
            </View>

            {VOUCHERS_MOCK.map((v) => (
              <Pressable
                key={v.id}
                style={[
                  styles.voucherItem,
                  {
                    backgroundColor: theme === "dark" ? "#1F2937" : "#F8F8F8",
                    borderColor:
                      appliedVoucher?.id === v.id
                        ? "#39B78D"
                        : theme === "dark"
                          ? "#334155"
                          : "transparent",
                    borderWidth:
                      appliedVoucher?.id === v.id || theme === "dark" ? 1.5 : 0,
                  },
                ]}
                onPress={() => {
                  setAppliedVoucher(v);
                  setVoucherModal(false);
                }}
              >
                <View style={styles.voucherTagStrip} />
                <View style={styles.voucherItemLeft}>
                  <Text
                    style={[
                      styles.voucherCode,
                      { color: theme === "dark" ? "#F8FAFC" : "#111" },
                    ]}
                  >
                    {v.code}
                  </Text>
                  <Text
                    style={[
                      styles.voucherDesc,
                      { color: theme === "dark" ? "#94A3B8" : "#888" },
                    ]}
                  >
                    {v.description}
                  </Text>
                </View>
                <View style={styles.voucherDiscountBox}>
                  <Text style={styles.voucherDiscount}>-{fmt(v.discount)}</Text>
                </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4ECE4" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  countBadge: {
    backgroundColor: "#39B78D",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  listContent: { padding: 16 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxWrapper: { marginRight: 8, padding: 4 },

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
    marginLeft: 12,
    minHeight: 85,
    justifyContent: "space-between",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    paddingRight: 8,
    lineHeight: 20,
    fontFamily: SERIF_FONT,
  },

  itemSub: {
    fontSize: 11,
    color: "#BBB",
    marginTop: 2,
    fontFamily: SERIF_FONT,
  },

  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
    flexWrap: "wrap",
  },

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  metaLabel: {
    fontSize: 13,
    color: "#666",
    fontFamily: SERIF_FONT,
  },

  metaValue: {
    fontSize: 13,
    color: "#222",
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
    fontFamily: SERIF_FONT,
  },

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

  qtyText: {
    paddingHorizontal: 10,
    fontWeight: "700",
    fontSize: 14,
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  emptyText: {
    color: "#CCC",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: SERIF_FONT,
  },
  shopBtn: {
    backgroundColor: "#39B78D",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 4,
  },
  shopBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: SERIF_FONT,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 18,
  },

  voucherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  voucherLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  voucherRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  voucherLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  voucherValue: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "500",
    fontFamily: SERIF_FONT,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectAllBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  selectAllText: { fontSize: 14, color: "#666", fontFamily: SERIF_FONT },
  checkoutGroup: { flexDirection: "row", alignItems: "center", gap: 14 },
  totalLabel: {
    fontSize: 11,
    color: "#AAA",
    marginBottom: 2,
    fontFamily: SERIF_FONT,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    fontFamily: SERIF_FONT,
  },
  checkoutBtn: {
    backgroundColor: "#39B78D",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  checkoutBtnDisabled: { backgroundColor: "#CCC" },
  checkoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    fontFamily: SERIF_FONT,
  },

  voucherItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#F8F8F8",
    marginBottom: 10,
    overflow: "hidden",
  },
  voucherItemActive: {
    backgroundColor: "#F0FBF7",
    borderWidth: 1.5,
    borderColor: "#39B78D",
  },
  voucherTagStrip: {
    width: 6,
    alignSelf: "stretch",
    backgroundColor: "#39B78D",
  },
  voucherItemLeft: { flex: 1, padding: 14 },
  voucherCode: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginBottom: 3,
    fontFamily: SERIF_FONT,
  },
  voucherDesc: { fontSize: 12, color: "#888", fontFamily: SERIF_FONT },
  voucherDiscountBox: { paddingHorizontal: 14 },
  voucherDiscount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FF4D4D",
    fontFamily: SERIF_FONT,
  },
  removeVoucherBtn: {
    alignItems: "center",
    marginTop: 6,
    paddingVertical: 12,
  },
  removeVoucherText: {
    color: "#FF4D4D",
    fontWeight: "700",
    fontSize: 14,
    fontFamily: SERIF_FONT,
  },
});
