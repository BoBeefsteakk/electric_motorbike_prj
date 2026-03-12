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

/* ── Types ── */
interface Voucher {
  id: number;
  title: string;
  description: string;
  code: string;
  image: string;
}

/* ── Skeleton ── */
const SkeletonCard = () => {
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
    <Animated.View style={[styles.card, { opacity: anim }]}>
      <View style={[styles.cardImage, { backgroundColor: "#EBEBEB" }]} />
      <View style={styles.cardBody}>
        <View style={{ height: 16, width: "75%", backgroundColor: "#EBEBEB", borderRadius: 6, marginBottom: 10 }} />
        <View style={{ height: 12, width: "95%", backgroundColor: "#F2F2F2", borderRadius: 6, marginBottom: 6 }} />
        <View style={{ height: 12, width: "70%", backgroundColor: "#F2F2F2", borderRadius: 6, marginBottom: 16 }} />
        <View style={{ height: 36, width: "50%", backgroundColor: "#EBEBEB", borderRadius: 10 }} />
      </View>
    </Animated.View>
  );
};

/* ── Copy button with feedback ── */
const CopyButton = ({ code }: { code: string }) => {
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
        style={[styles.codeBtn, copied && styles.codeBtnCopied]}
        onPress={handleCopy}
        activeOpacity={0.85}
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
  const navigation = useNavigation<any>();
  const insets     = useSafeAreaInsets();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/vouchers`)
      .then((r) => r.json())
      .then(setVouchers)
      .catch((e) => console.log("fetch vouchers error:", e))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item, index }: { item: Voucher; index: number }) => (
    <View style={styles.card}>
      {/* Ảnh voucher */}
      <View style={styles.imageBox}>
        <Image
          source={{ uri: `${API_URL}/images/${item.image}` }}
          style={styles.cardImage}
          resizeMode="cover"
          fadeDuration={200}
        />
        {/* Số thứ tự */}
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
      </View>

      {/* Nội dung */}
      <View style={styles.cardBody}>
        {/* Tiêu đề */}
        <Text style={styles.voucherTitle}>{item.title}</Text>

        {/* Mô tả */}
        <Text style={styles.voucherDesc} numberOfLines={3}>{item.description}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Code + copy */}
        <View style={styles.codeRow}>
          <Text style={styles.codeLabel}>Mã voucher</Text>
          <CopyButton code={item.code} />
        </View>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Banner text */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroEmoji}>🎁</Text>
        <View>
          <Text style={styles.heroTitle}>Ưu Đãi Đặc Biệt</Text>
          <Text style={styles.heroSub}>Dành riêng cho khách hàng VinFast</Text>
        </View>
      </View>
      <Text style={styles.countText}>{vouchers.length} voucher đang hoạt động</Text>
    </View>
  );

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-left" size={15} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voucher Ưu Đãi</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.skeletonList}>
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </View>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  /* Header */
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EBEBEB",
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },

  /* List header */
  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  heroEmoji:  { fontSize: 36 },
  heroTitle:  { fontSize: 18, fontWeight: "800", color: "#111" },
  heroSub:    { fontSize: 13, color: "#888", marginTop: 2 },
  countText:  { fontSize: 13, color: "#AAA", fontWeight: "500", paddingLeft: 4 },

  /* List */
  list:         { paddingHorizontal: 16 },
  skeletonList: { padding: 16, gap: 16 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageBox: { position: "relative" },
  cardImage: { width: "100%", height: 180 },
  indexBadge: {
    position: "absolute",
    top: 12, left: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  indexText: { fontSize: 12, fontWeight: "800", color: "#fff" },

  cardBody:     { padding: 16 },
  voucherTitle: { fontSize: 17, fontWeight: "800", color: "#111", marginBottom: 6 },
  voucherDesc:  { fontSize: 14, color: "#666", lineHeight: 21 },
  divider:      { height: 0.5, backgroundColor: "#F0F0F0", marginVertical: 14 },

  /* Code row */
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeLabel: { fontSize: 13, color: "#AAA", fontWeight: "500" },

  /* Copy button */
  codeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#FFF5E9",
    borderWidth: 1.5,
    borderColor: "#FF8C00",
    borderStyle: "dashed",
  },
  codeBtnCopied: {
    backgroundColor: "#FF8C00",
    borderStyle: "solid",
    borderColor: "#FF8C00",
  },
  codeText:       { fontSize: 14, fontWeight: "800", color: "#FF8C00", letterSpacing: 1.5 },
  codeTextCopied: { color: "#fff" },
});