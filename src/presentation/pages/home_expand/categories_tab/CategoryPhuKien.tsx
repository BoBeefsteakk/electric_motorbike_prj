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
interface Accessory {
  id: number;
  name: string;
  price: number;
  image: string;
}

/* ── Encode image path (handle spaces in filename) ── */
const encodeImagePath = (p: string) =>
  p.split("/").map(encodeURIComponent).join("/");

/* ── Skeleton ── */
const SkeletonRow = () => {
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
      <View style={[styles.imageBox, { backgroundColor: "#EBEBEB" }]} />
      <View style={styles.cardInfo}>
        <View style={{ height: 14, width: "80%", backgroundColor: "#EBEBEB", borderRadius: 6, marginBottom: 8 }} />
        <View style={{ height: 13, width: "55%", backgroundColor: "#F2F2F2", borderRadius: 6, marginBottom: 6 }} />
        <View style={{ height: 13, width: "40%", backgroundColor: "#F2F2F2", borderRadius: 6, marginBottom: 16 }} />
        <View style={{ height: 34, width: 110, backgroundColor: "#EBEBEB", borderRadius: 10 }} />
      </View>
    </Animated.View>
  );
};

/* ── Main Screen ── */
export default function CategoryPhuKien() {
  const navigation = useNavigation<any>();
  const insets     = useSafeAreaInsets();

  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading]         = useState(true);
  const [sort, setSort]               = useState<"default" | "asc" | "desc">("default");

  useEffect(() => {
    fetch(`${API_URL}/api/accessories`)
      .then((r) => r.json())
      .then(setAccessories)
      .catch((e) => console.log("fetch accessories error:", e))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...accessories].sort((a, b) => {
    if (sort === "asc")  return a.price - b.price;
    if (sort === "desc") return b.price - a.price;
    return 0;
  });

  const SORT_OPTIONS: { key: typeof sort; label: string }[] = [
    { key: "default", label: "Mặc định" },
    { key: "asc",     label: "Giá tăng dần" },
    { key: "desc",    label: "Giá giảm dần" },
  ];

  const renderItem = ({ item, index }: { item: Accessory; index: number }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => navigation.navigate("accessory_detail" as never, { id: item.id } as never)}>
      {/* Ảnh */}
      <View style={styles.imageBox}>
        <Image
          source={{ uri: `${API_URL}/${encodeImagePath(item.image)}` }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={200}
        />
        {/* Index badge */}
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Giá + Nút */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.fromLabel}>Giá bán</Text>
            <Text style={styles.price}>
              {Number(item.price).toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <TouchableOpacity style={styles.buyBtn} activeOpacity={0.8} onPress={() => navigation.navigate("accessory_detail" as never, { id: item.id } as never)}>
            <FontAwesome name="shopping-cart" size={13} color="#fff" />
            <Text style={styles.buyText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      {/* Hero strip */}
      <View style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>Phụ Kiện</Text>
          <Text style={styles.heroSub}>Chính hãng VinFast • Bảo hành 12 tháng</Text>
        </View>
        <FontAwesome name="wrench" size={28} color="#FF8C00" />
      </View>

      {/* Sort bar */}
      <View style={styles.sortBar}>
        <FontAwesome name="sort-amount-asc" size={13} color="#999" style={{ marginRight: 8 }} />
        {SORT_OPTIONS.map((o) => {
          const active = o.key === sort;
          return (
            <TouchableOpacity
              key={o.key}
              style={[styles.sortBtn, active && styles.sortActive]}
              onPress={() => setSort(o.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.sortText, active && styles.sortTextActive]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!loading && (
        <Text style={styles.countText}>{accessories.length} sản phẩm</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <FontAwesome name="chevron-left" size={15} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phụ Kiện Chính Hãng</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.skeletonList}>
          {[0,1,2,3].map((i) => <SkeletonRow key={i} />)}
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          removeClippedSubviews
          initialNumToRender={8}
        />
      )}
    </View>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F8FA" },

  header: {
    height: 56, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#EBEBEB",
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },

  /* List header */
  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },

  heroBanner: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#FFF5E9", borderRadius: 16,
    paddingHorizontal: 18, paddingVertical: 16, marginBottom: 14,
  },
  heroLeft:  {},
  heroTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  heroSub:   { fontSize: 13, color: "#999", marginTop: 3 },

  /* Sort bar */
  sortBar: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 10, flexWrap: "wrap", gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: "#EFEFEF",
  },
  sortActive:     { backgroundColor: "#111" },
  sortText:       { fontSize: 12, fontWeight: "600", color: "#777" },
  sortTextActive: { color: "#fff" },

  countText: { fontSize: 13, color: "#AAA", fontWeight: "500", marginBottom: 6, paddingLeft: 2 },

  /* List */
  list:         { paddingHorizontal: 16 },
  skeletonList: { padding: 16, gap: 14 },

  /* Card */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    height: 140,
  },
  imageBox: { width: 140, height: 140, position: "relative" },
  image:    { width: "100%", height: "100%", resizeMode: "cover" },
  indexBadge: {
    position: "absolute", top: 10, left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3,
  },
  indexText: { fontSize: 11, fontWeight: "800", color: "#fff" },

  cardInfo:  { flex: 1, padding: 14, justifyContent: "space-between" },
  itemName: {
    fontSize: 15, fontWeight: "700", color: "#111",
    lineHeight: 21,
  },
  divider: { height: 0.5, backgroundColor: "#F0F0F0", marginVertical: 8 },

  cardFooter: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  fromLabel:  { fontSize: 10, color: "#BBB", marginBottom: 1 },
  price:      { fontSize: 13, fontWeight: "800", color: "#FF8C00", flexShrink: 1, marginRight: 8 },

  buyBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#111",
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: 10, flexShrink: 0,
  },
  buyText: { fontSize: 11, color: "#fff", fontWeight: "700" },
});