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

interface Store {
  id: number;
  name: string;
  address: string;
  rating: number;
  image: string;
  route: string;
}

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
    <Animated.View style={[styles.card, { opacity: anim, flexDirection: "row", height: 110 }]}>
      <View style={{ width: 110, backgroundColor: "#EBEBEB" }} />
      <View style={{ flex: 1, padding: 14, gap: 8 }}>
        <View style={{ height: 14, width: "70%", backgroundColor: "#EBEBEB", borderRadius: 6 }} />
        <View style={{ height: 12, width: "50%", backgroundColor: "#F2F2F2", borderRadius: 6 }} />
        <View style={{ height: 12, width: "90%", backgroundColor: "#F2F2F2", borderRadius: 6 }} />
      </View>
    </Animated.View>
  );
};

/* Rating stars */
const RatingStars = ({ rating }: { rating: number }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array(full).fill(0).map((_, i) => (
        <FontAwesome key={`f${i}`} name="star" size={11} color="#F5A623" style={i > 0 ? { marginLeft: 2 } : {}} />
      ))}
      {half === 1 && <FontAwesome name="star-half-empty" size={11} color="#F5A623" style={{ marginLeft: 2 }} />}
      {Array(empty).fill(0).map((_, i) => (
        <FontAwesome key={`e${i}`} name="star-o" size={11} color="#DDD" style={{ marginLeft: 2 }} />
      ))}
      <Text style={{ fontSize: 12, color: "#555", fontWeight: "600", marginLeft: 5 }}>{rating}</Text>
    </View>
  );
};

export default function HomeStoreList() {
  const navigation = useNavigation<any>();
  const insets     = useSafeAreaInsets();
  const [stores, setStores]   = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stores`)
      .then((r) => r.json())
      .then(setStores)
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item, index }: { item: Store; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={() => navigation.navigate(item.route as any)}
    >
      {/* Ảnh bên trái */}
      <View style={styles.imageBox}>
        <Image source={{ uri: `${API_URL}${item.image}` }} style={styles.image} />
        {/* Số thứ tự */}
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
      </View>

      {/* Nội dung */}
      <View style={styles.info}>
        <Text style={styles.storeName} numberOfLines={1}>{item.name}</Text>

        <RatingStars rating={item.rating} />

        <View style={styles.addressRow}>
          <FontAwesome name="map-marker" size={12} color="#BBB" />
          <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
        </View>

        <TouchableOpacity
          style={styles.viewBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(item.route as any)}
        >
          <Text style={styles.viewText}>Xem cửa hàng</Text>
          <FontAwesome name="arrow-right" size={11} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <FontAwesome name="chevron-left" size={15} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh Sách Cửa Hàng</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Sub-header count */}
      {!loading && (
        <View style={styles.subHeader}>
          <View style={styles.accentBar} />
          <Text style={styles.subTitle}>
            {stores.length} cửa hàng trên toàn quốc
          </Text>
        </View>
      )}

      {loading ? (
        <View style={{ padding: 16, gap: 14 }}>
          {[0,1,2,3].map((i) => <SkeletonRow key={i} />)}
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        />
      )}
    </View>
  );
}

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

  subHeader: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#F0F0F0",
  },
  accentBar: {
    width: 3, height: 18, borderRadius: 2,
    backgroundColor: "#FF8C00", marginRight: 10,
  },
  subTitle: { fontSize: 13, color: "#888", fontWeight: "500" },

  list: { padding: 16 },

  card: {
    flexDirection: "row",
    height: 130,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageBox: { width: 120, height: 130, position: "relative" },
  image:    { width: "100%", height: "100%", resizeMode: "cover" },
  indexBadge: {
    position: "absolute", top: 10, left: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
  },
  indexText: { fontSize: 11, fontWeight: "800", color: "#fff" },

  info: { flex: 1, padding: 14, justifyContent: "space-between" },
  storeName: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 4 },

  addressRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 6, gap: 5 },
  addressText: { flex: 1, fontSize: 12, color: "#999", lineHeight: 17 },

  viewBtn: {
    flexDirection: "row", alignItems: "center",
    alignSelf: "flex-start", gap: 6,
    marginTop: 10, paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 14, backgroundColor: "#111",
  },
  viewText: { fontSize: 12, color: "#fff", fontWeight: "600" },
});