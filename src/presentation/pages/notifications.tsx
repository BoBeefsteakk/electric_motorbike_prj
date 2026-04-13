import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/themeContext";
import { darkTheme, lightTheme } from "../../theme/colors";
import {
  AppNotification,
  clearNotifications,
  getNotifications,
} from "../../data/notifications";

const formatTime = (value: string) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const getMeta = (type: AppNotification["type"]) => {
  switch (type) {
    case "login":
      return {
        icon: "log-in-outline" as const,
        color: "#2563EB",
        bg: "#DBEAFE",
      };
    case "order":
      return {
        icon: "cart-outline" as const,
        color: "#16A34A",
        bg: "#DCFCE7",
      };
    case "profile":
      return {
        icon: "person-outline" as const,
        color: "#EA580C",
        bg: "#FFEDD5",
      };
    default:
      return {
        icon: "notifications-outline" as const,
        color: "#475569",
        bg: "#E2E8F0",
      };
  }
};

export default function NotificationScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";

  const [items, setItems] = useState<AppNotification[]>([]);

  const loadNotifications = useCallback(async () => {
    const data = await getNotifications();
    setItems(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const handleClearAll = () => {
    if (!items.length) return;

    Alert.alert("Xóa thông báo", "Bạn có muốn xóa toàn bộ thông báo không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          await clearNotifications();
          setItems([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            borderBottomColor: isDark ? "#1F2937" : "#E5E7EB",
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Thông báo
        </Text>

        <TouchableOpacity activeOpacity={0.8} onPress={handleClearAll}>
          <Text style={styles.clearText}>Xóa hết</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          !items.length && styles.emptyListContent,
        ]}
        renderItem={({ item }) => {
          const meta = getMeta(item.type);

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? "#111827" : "#FFFFFF",
                  borderColor: isDark ? "#1F2937" : "#E5E7EB",
                },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
                <Ionicons name={meta.icon} size={22} color={meta.color} />
              </View>

              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardMessage,
                    { color: isDark ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  {item.message}
                </Text>

                <Text
                  style={[
                    styles.cardTime,
                    { color: isDark ? "#64748B" : "#94A3B8" },
                  ]}
                >
                  {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons
              name="notifications-off-outline"
              size={54}
              color={isDark ? "#475569" : "#94A3B8"}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Chưa có thông báo
            </Text>
            <Text
              style={[
                styles.emptyDesc,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Các thông báo đăng nhập, đặt mua và cập nhật tài khoản sẽ hiện ở đây.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 88,
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  clearText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyWrap: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },
  emptyDesc: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
  },
});
