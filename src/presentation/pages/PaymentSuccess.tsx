import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { darkTheme, lightTheme } from "../../theme/colors";

export default function PaymentSuccessScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const orderId = route?.params?.orderId || "RE123456";

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* ICON */}
        <Animated.View
          style={[
            styles.iconCircle,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor:
                theme === "dark"
                  ? "rgba(0, 177, 79, 0.15)"
                  : "rgba(0, 177, 79, 0.1)",
            },
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              {
                shadowOpacity: theme === "dark" ? 0 : 0.3,
                elevation: theme === "dark" ? 0 : 8,
              },
            ]}
          >
            <Feather name="check" size={60} color="#fff" />
          </View>
        </Animated.View>

        {/* TITLE */}
        <Text style={[styles.title, { color: colors.text }]}>
          Thanh toán thành công!
        </Text>

        {/* DESC */}
        <Text
          style={[
            styles.desc,
            { color: theme === "dark" ? "#94A3B8" : "#64748B" },
          ]}
        >
          Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đã được xác nhận và sẽ sớm
          được giao đến bạn.
        </Text>

        {/* INFO CARD */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: theme === "dark" ? "#334155" : "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.infoText,
              { color: theme === "dark" ? "#CBD5E1" : "#64748B" },
            ]}
          >
            Mã giao dịch:{" "}
            <Text style={{ fontWeight: "700", color: colors.text }}>
              #{orderId}
            </Text>
          </Text>
        </View>

        {/* BUTTON */}
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => navigation.navigate("inapp", { screen: "home" })}
        >
          <Text style={styles.btnText}>Tiếp tục mua sắm</Text>
        </Pressable>

        {/* OUTLINE BUTTON */}
        <Pressable
          style={styles.outlineBtn}
          onPress={() => navigation.navigate("Order", { orderId })}
        >
          <Text
            style={[
              styles.outlineBtnText,
              { color: theme === "dark" ? "#94A3B8" : "#64748B" },
            ]}
          >
            Xem chi tiết đơn hàng
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },

  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#00B14F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00B14F",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },

  desc: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },

  infoCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 48,
    borderWidth: 1,
  },

  infoText: {
    fontSize: 14,
  },

  btn: {
    backgroundColor: "#00B14F",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#00B14F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  outlineBtn: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },

  outlineBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
