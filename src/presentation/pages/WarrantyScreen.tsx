import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../context/themeContext";
import API_URL from "../../data/api/apis";
import { darkTheme, lightTheme } from "../../theme/colors";

const USER_ID = "user_test_123";

export default function WarrantyScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchWarrantyData();
  }, []);

  const fetchWarrantyData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/user/${USER_ID}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu bảo hành:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const renderWarrantyItem = (order: any) => {
    const startDate = new Date(order.createdAt);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(startDate.getFullYear() + 3);

    return (
      <View
        key={order.id ?? order.orderId}
        style={[
          styles.ticketCard,
          {
            backgroundColor: colors.card,
            shadowOpacity: theme === "dark" ? 0 : 0.08,
            elevation: theme === "dark" ? 0 : 4,
            borderWidth: theme === "dark" ? 1 : 0,
            borderColor: theme === "dark" ? "#334155" : "transparent",
          },
        ]}
      >
        <View
          style={[
            styles.cardHeader,
            { backgroundColor: theme === "dark" ? "#0F172A" : "#FAFAFA" },
          ]}
        >
          <Text
            style={[
              styles.orderIdText,
              { color: theme === "dark" ? "#94A3B8" : "#8C8C8C" },
            ]}
          >
            Mã đơn: {order.id ?? order.orderId}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: theme === "dark" ? "#123226" : "#E6F7ED",
              },
            ]}
          >
            <Text style={styles.statusText}>Chính hãng</Text>
          </View>
        </View>

        {(order.items ?? []).map((item: any, index: number) => (
          <View key={index} style={styles.productRow}>
            <Text style={[styles.productName, { color: colors.text }]}>
              {item.name}
            </Text>
          </View>
        ))}

        <View style={styles.divider}>
          <View
            style={[
              styles.cutout,
              {
                left: -25,
                backgroundColor:
                  theme === "dark" ? colors.background : "#F5F7FA",
              },
            ]}
          />
          <View
            style={[
              styles.dashLine,
              { borderColor: theme === "dark" ? "#475569" : "#DDD" },
            ]}
          />
          <View
            style={[
              styles.cutout,
              {
                right: -25,
                backgroundColor:
                  theme === "dark" ? colors.background : "#F5F7FA",
              },
            ]}
          />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateBox}>
            <Text
              style={[
                styles.dateLabel,
                { color: theme === "dark" ? "#94A3B8" : "#8C8C8C" },
              ]}
            >
              Ngày mua
            </Text>
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {startDate.toLocaleDateString("vi-VN")}
            </Text>
          </View>
          <View style={[styles.dateBox, { alignItems: "flex-end" }]}>
            <Text
              style={[
                styles.dateLabel,
                { color: theme === "dark" ? "#94A3B8" : "#8C8C8C" },
              ]}
            >
              Hết hạn bảo hành
            </Text>
            <Text style={[styles.dateValue, { color: "#FF4D4F" }]}>
              {expiryDate.toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: theme === "dark" ? "#334155" : "#EBEBEB",
          },
        ]}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={theme === "dark" ? "#FFFFFF" : "#1A1A1A"}
          />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Bảo hành của tôi
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#39B78D"
          style={{ marginTop: 50 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {orders.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={60}
                color={theme === "dark" ? "#475569" : "#DDD"}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme === "dark" ? "#94A3B8" : "#8C8C8C" },
                ]}
              >
                Bạn chưa có sản phẩm nào được bảo hành.
              </Text>
            </View>
          ) : (
            orders.map((order) => renderWarrantyItem(order))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  scrollContent: { padding: 20 },

  ticketCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FAFAFA",
  },

  orderIdText: {
    fontSize: 13,
    color: "#8C8C8C",
    fontWeight: "600",
  },

  statusBadge: {
    backgroundColor: "#E6F7ED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    color: "#39B78D",
    fontSize: 11,
    fontWeight: "700",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  divider: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  cutout: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F5F7FA",
  },

  dashLine: {
    width: "90%",
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#DDD",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 0,
  },

  dateBox: { flex: 1 },

  dateLabel: {
    fontSize: 11,
    color: "#8C8C8C",
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#434343",
  },

  emptyBox: { alignItems: "center", marginTop: 100, gap: 14 },

  emptyText: {
    textAlign: "center",
    color: "#8C8C8C",
    fontSize: 15,
  },
});
