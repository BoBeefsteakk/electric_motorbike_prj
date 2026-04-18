import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { darkTheme, lightTheme } from "../../theme/colors";
import { showFeedback } from "../utils/feedback";

type PaymentOption = "card" | "bank" | "paypal" | "wallet";

const PRIMARY = "#2563EB";
const PRIMARY_DARK = "#1D4ED8";
const PRIMARY_SOFT = "#DBEAFE";
const PRIMARY_SOFT_BG = "#EFF6FF";
const PAYMENT_KEY = "PAYMENT_DATA";
const SERIF_FONT = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export default function PaymentMethodScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const pageBg = theme === "dark" ? "#120F0D" : "#F4ECE4";

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [selectedMethod, setSelectedMethod] = useState<PaymentOption>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const orderTotal = 124.99;
  const itemCount = 3;

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const raw = await AsyncStorage.getItem(PAYMENT_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);
        setSelectedMethod(data.selectedMethod ?? "card");
        setCardNumber(data.cardNumber ?? "");
        setCardholderName(data.cardholderName ?? "");
        setExpiryDate(data.expiryDate ?? "");
      } catch (e) {
        console.log("load payment error:", e);
      }
    };

    loadPayment();
  }, []);

  const formattedCardNumber = useMemo(() => {
    const digits = cardNumber.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }, [cardNumber]);

  const maskedPreview = useMemo(() => {
    if (!formattedCardNumber) return "••••  ••••  ••••  ••••";
    return formattedCardNumber.padEnd(19, "•");
  }, [formattedCardNumber]);

  const handleCardNumberChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits);
  };

  const handleExpiryChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setExpiryDate(formatted);
  };

  const handleCvvChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
  };

  const validateAndPay = async () => {
    if (selectedMethod === "card") {
      if (cardNumber.replace(/\D/g, "").length < 16) {
        Alert.alert("Lỗi", "Vui lòng nhập đủ 16 số thẻ.");
        return;
      }

      if (!cardholderName.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tên chủ thẻ.");
        return;
      }

      if (expiryDate.length !== 5) {
        Alert.alert("Lỗi", "Vui lòng nhập ngày hết hạn theo định dạng MM/YY.");
        return;
      }

      if (cvv.length < 3) {
        Alert.alert("Lỗi", "Vui lòng nhập CVV hợp lệ.");
        return;
      }
    }

    try {
      await AsyncStorage.setItem(
        PAYMENT_KEY,
        JSON.stringify({
          selectedMethod,
          cardNumber,
          cardholderName,
          expiryDate,
        }),
      );

      showFeedback({
        type: "success",
        message: "Đã lưu phương thức thanh toán.",
      });
    } catch (e) {
      showFeedback({
        type: "error",
        message: "Không thể lưu phương thức thanh toán.",
      });
    }
  };

  const PaymentItem = ({
    id,
    title,
    subtitle,
    icon,
  }: {
    id: PaymentOption;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }) => {
    const active = selectedMethod === id;

    return (
      <Pressable
        onPress={() => setSelectedMethod(id)}
        style={[
          styles.paymentItem,
          {
            backgroundColor: active
              ? theme === "dark"
                ? "#0F1E35"
                : PRIMARY_SOFT_BG
              : theme === "dark"
                ? colors.card
                : "#F3F4F6",
            borderColor: active
              ? PRIMARY
              : theme === "dark"
                ? "#334155"
                : "#E5E7EB",
          },
        ]}
      >
        <View style={styles.paymentItemLeft}>
          <View
            style={[
              styles.paymentIconBox,
              {
                backgroundColor: active
                  ? theme === "dark"
                    ? "#1E3A5F"
                    : PRIMARY_SOFT
                  : theme === "dark"
                    ? "#0F172A"
                    : "#E5E7EB",
              },
            ]}
          >
            {icon}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.paymentTitle,
                { color: active ? PRIMARY_DARK : colors.text },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.paymentSubtitle,
                { color: theme === "dark" ? "#94A3B8" : "#9CA3AF" },
              ]}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.radioOuter,
            {
              borderColor: active
                ? PRIMARY
                : theme === "dark"
                  ? "#475569"
                  : "#D1D5DB",
            },
          ]}
        >
          {active && <View style={styles.radioInner} />}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: pageBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View style={[styles.topHeader, { paddingTop: insets.top + 4 }]}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={18} color="#FFF" />
            </Pressable>

            <Text style={styles.headerTitle}>Payment Method</Text>
          </View>

          <View
            style={[
              styles.summaryCardCompact,
              {
                backgroundColor:
                  theme === "dark"
                    ? "rgba(15, 23, 42, 0.35)"
                    : "rgba(255,255,255,0.12)",
              },
            ]}
          >
            <View>
              <Text style={styles.summaryLabel}>Order Total</Text>
              <Text style={styles.summaryAmount}>${orderTotal.toFixed(2)}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryItems}>{itemCount} items</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.sectionMiniTitle,
              { color: theme === "dark" ? "#94A3B8" : "#9CA3AF" },
            ]}
          >
            SELECT PAYMENT
          </Text>

          <PaymentItem
            id="card"
            title="Credit / Debit Card"
            subtitle="Visa, Mastercard, AMEX"
            icon={<Ionicons name="card-outline" size={22} color={PRIMARY} />}
          />

          <PaymentItem
            id="bank"
            title="Bank Transfer"
            subtitle="Direct from your bank"
            icon={
              <MaterialCommunityIcons
                name="bank-outline"
                size={22}
                color={theme === "dark" ? "#CBD5E1" : "#6B7280"}
              />
            }
          />

          <PaymentItem
            id="paypal"
            title="PayPal"
            subtitle="Pay with your PayPal account"
            icon={
              <Feather
                name="credit-card"
                size={20}
                color={theme === "dark" ? "#CBD5E1" : "#6B7280"}
              />
            }
          />

          <PaymentItem
            id="wallet"
            title="Apple Pay / Google Pay"
            subtitle="Fast & secure digital wallet"
            icon={
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color={theme === "dark" ? "#CBD5E1" : "#6B7280"}
              />
            }
          />

          <View style={styles.cardPreview}>
            <View style={styles.cardPreviewTop}>
              <View style={styles.masterCircleWrap}>
                <View
                  style={[styles.masterCircle, { backgroundColor: "#FBBF24" }]}
                />
                <View
                  style={[styles.masterCircle, styles.masterCircleOverlap]}
                />
              </View>
              <Text style={styles.cardBrand}>VISA</Text>
            </View>

            <Text style={styles.cardPreviewNumber}>{maskedPreview}</Text>

            <View style={styles.cardPreviewBottom}>
              <View>
                <Text style={styles.cardPreviewLabel}>Card Holder</Text>
                <Text style={styles.cardPreviewValue}>
                  {cardholderName.trim() || "Full Name"}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.cardPreviewLabel}>Expires</Text>
                <Text style={styles.cardPreviewValue}>
                  {expiryDate || "MM/YY"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Card Number
            </Text>
            <TextInput
              value={formattedCardNumber}
              onChangeText={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                  borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                  color: colors.text,
                },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Cardholder Name
            </Text>
            <TextInput
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="John Smith"
              placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
              style={[
                styles.input,
                {
                  backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                  borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                  color: colors.text,
                },
              ]}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Expiry Date
              </Text>
              <TextInput
                value={expiryDate}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                CVV
              </Text>
              <TextInput
                value={cvv}
                onChangeText={handleCvvChange}
                placeholder="•••"
                placeholderTextColor={theme === "dark" ? "#64748B" : "#9CA3AF"}
                keyboardType="number-pad"
                secureTextEntry
                style={[
                  styles.input,
                  {
                    backgroundColor: theme === "dark" ? "#0F172A" : "#F9FAFB",
                    borderColor: theme === "dark" ? "#334155" : "#E5E7EB",
                    color: colors.text,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.securityRow}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={theme === "dark" ? "#94A3B8" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.securityText,
                { color: theme === "dark" ? "#94A3B8" : "#9CA3AF" },
              ]}
            >
              256-bit SSL encryption. Your payment is 100% secure.
            </Text>
          </View>

          <Pressable style={styles.payBtn} onPress={validateAndPay}>
            <Ionicons name="lock-closed-outline" size={16} color="#FFF" />
            <Text style={styles.payBtnText}>Pay ${orderTotal.toFixed(2)}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4ECE4" },

  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    fontFamily: SERIF_FONT,
  },

  summaryCardCompact: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    color: "#BFDBFE",
    fontSize: 12,
    marginBottom: 4,
    fontFamily: SERIF_FONT,
  },

  summaryAmount: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },

  summaryItems: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionMiniTitle: {
    fontSize: 12,
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 14,
    fontFamily: SERIF_FONT,
  },

  paymentItem: {
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  paymentItemActive: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_SOFT_BG,
  },

  paymentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  paymentIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  paymentIconBoxActive: {
    backgroundColor: PRIMARY_SOFT,
  },

  paymentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    fontFamily: SERIF_FONT,
  },

  paymentTitleActive: {
    color: PRIMARY_DARK,
  },

  paymentSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 3,
    fontFamily: SERIF_FONT,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterActive: {
    borderColor: PRIMARY,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  cardPreview: {
    marginTop: 16,
    borderRadius: 22,
    padding: 18,
    backgroundColor: PRIMARY,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },

  cardPreviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  masterCircleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  masterCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FCD34D",
  },

  masterCircleOverlap: {
    marginLeft: -8,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  cardBrand: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },

  cardPreviewNumber: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 28,
    marginBottom: 26,
    fontFamily: SERIF_FONT,
  },

  cardPreviewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardPreviewLabel: {
    color: "#BFDBFE",
    fontSize: 12,
    marginBottom: 4,
    fontFamily: SERIF_FONT,
  },

  cardPreviewValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: SERIF_FONT,
  },

  formGroup: {
    marginTop: 18,
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    fontFamily: SERIF_FONT,
  },

  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111827",
    fontFamily: SERIF_FONT,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },

  securityText: {
    fontSize: 12,
    color: "#9CA3AF",
    flex: 1,
    fontFamily: SERIF_FONT,
  },

  payBtn: {
    marginTop: 18,
    height: 54,
    borderRadius: 18,
    backgroundColor: PRIMARY_DARK,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  payBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: SERIF_FONT,
  },
});
