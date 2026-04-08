import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import API_URL from "../../../../data/api/apis";
import { useTheme } from "../../../../context/themeContext";
import { darkTheme, lightTheme } from "../../../../theme/colors";

/* ── Types ── */
interface Voucher {
  id: number;
  title: string;
  description: string;
  code: string;
  image: string;
}

/* ── Encode image path (FIX lỗi khoảng trắng) ── */
const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

/* ── Skeleton ── */
const SkeletonCard = ({ theme }: { theme: "light" | "dark" }) => {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
          borderWidth: theme === "dark" ? 1 : 0,
          borderColor: theme === "dark" ? "#334155" : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.cardImage,
          { backgroundColor: theme === "dark" ? "#334155" : "#EBEBEB" },
        ]}
      />
      <View style={styles.cardBody}>
        <View style={{ height: 16, width: "75%", backgroundColor: "#EBEBEB", borderRadius: 6, marginBottom: 10 }} />
        <View style={{ height: 12, width: "95%", backgroundColor: "#F2F2F2", borderRadius: 6, marginBottom: 6 }} />
        <View style={{ height: 12, width: "70%", backgroundColor: "#F2F2F2", borderRadius: 6, marginBottom: 16 }} />
      </View>
    </Animated.View>
  );
};

/* ── Copy Button ── */
const CopyButton = ({ code, theme }: { code: string; theme: "light" | "dark" }) => {
  const [copied, setCopied] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handleCopy = () => {
    setCopied(true);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.codeBtn,
          copied && styles.codeBtnCopied,
          {
            backgroundColor: copied
              ? "#FF8C00"
              : theme === "dark"
              ? "#1F2937"
              : "#FFF5E9",
          },
        ]}
        onPress={handleCopy}
      >
        <Text style={[styles.codeText, copied && styles.codeTextCopied]}>
          {code}
        </Text>
        <FontAwesome
          name={copied ? "check" : "copy"}
          size={13}
          color={copied ? "#fff" : "#FF8C00"}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

/* ── Main Screen ── */
export default function CategorySpecial() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/vouchers`)
      .then((r) => r.json())
      .then(setVouchers)
      .catch((e) => console.log("fetch vouchers error:", e))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item, index }: { item: Voucher; index: number }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme === "dark" ? colors.card : "#fff",
          borderWidth: theme === "dark" ? 1 : 0,
          borderColor: theme === "dark" ? "#334155" : "transparent",
        },
      ]}
    >
      <View style={styles.imageBox}>
        <Image
          source={{
            uri: `${API_URL}/images/${encodeImagePath(item.image)}`,
          }}
          style={styles.cardImage}
        />

        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.voucherTitle, { color: colors.text }]}>
          {item.title}
        </Text>

        <Text
          style={[
            styles.voucherDesc,
            { color: theme === "dark" ? "#94A3B8" : "#666" },
          ]}
          numberOfLines={3}
        >
          {item.description}
        </Text>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme === "dark" ? "#334155" : "#F0F0F0" },
          ]}
        />

        <View style={styles.codeRow}>
          <Text
            style={[
              styles.codeLabel,
              { color: theme === "dark" ? "#94A3B8" : "#AAA" },
            ]}
          >
            Mã voucher
          </Text>
          <CopyButton code={item.code} theme={theme} />
        </View>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View
        style={[
          styles.heroBanner,
          {
            backgroundColor: theme === "dark" ? "#0F1E35" : "#FFF5E9",
          },
        ]}
      >
        <Text style={styles.heroEmoji}>🎁</Text>
        <View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Ưu Đãi Đặc Biệt
          </Text>
          <Text
            style={[
              styles.heroSub,
              { color: theme === "dark" ? "#94A3B8" : "#888" },
            ]}
          >
            Dành riêng cho khách hàng VinFast
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.countText,
          { color: theme === "dark" ? "#94A3B8" : "#AAA" },
        ]}
      >
        {vouchers.length} voucher đang hoạt động
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.safe,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: theme === "dark" ? "#243041" : "#EBEBEB",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: theme === "dark" ? "#1F2937" : "#F5F5F5",
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome
            name="chevron-left"
            size={15}
            color={theme === "dark" ? "#FFF" : "#111"}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Voucher Ưu Đãi
        </Text>

        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.skeletonList}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} theme={theme} />
          ))}
        </View>
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700" },

  listHeader: { paddingHorizontal: 16, paddingTop: 16 },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontSize: 18, fontWeight: "800" },
  heroSub: { fontSize: 13, marginTop: 2 },
  countText: { fontSize: 13, fontWeight: "500", paddingLeft: 4 },

  list: { paddingHorizontal: 16 },
  skeletonList: { padding: 16, gap: 16 },

  card: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  imageBox: { position: "relative" },
  cardImage: { width: "100%", height: 180 },

  indexBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  indexText: { fontSize: 12, fontWeight: "800", color: "#fff" },

  cardBody: { padding: 16 },
  voucherTitle: { fontSize: 17, fontWeight: "800", marginBottom: 6 },
  voucherDesc: { fontSize: 14, lineHeight: 21 },

  divider: { height: 0.5, marginVertical: 14 },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeLabel: { fontSize: 13, fontWeight: "500" },

  codeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF8C00",
    borderStyle: "dashed",
  },
  codeBtnCopied: {
    borderStyle: "solid",
    borderColor: "#FF8C00",
  },
  codeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FF8C00",
    letterSpacing: 1.5,
  },
  codeTextCopied: { color: "#fff" },
});