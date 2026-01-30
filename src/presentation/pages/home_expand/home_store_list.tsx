import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

/* ================= MOCK DATA ================= */

const STORES = [
  {
    id: 1,
    name: "Anthony Motors",
    address: "123 Nguyễn Trãi, Q.1",
    rating: 4.6,
    image: require("../../../../pic/home/bs1.png"),
  },
  {
    id: 2,
    name: "Long Bike Center",
    address: "45 Lê Văn Việt, Q.9",
    rating: 4.4,
    image: require("../../../../pic/home/bs1.png"),
  },
  {
    id: 3,
    name: "SpeedX Store",
    address: "88 Phan Văn Trị, Gò Vấp",
    rating: 4.8,
    image: require("../../../../pic/home/bs1.png"),
  },
];

/* ================= SCREEN ================= */

export default function HomeStoreList() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => {
        // navigation.navigate("store_detail", { id: item.id });
        console.log("Click store:", item.name);
      }}
    >
      {/* IMAGE */}
      <Image source={item.image} style={styles.image} />

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>

        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>

          <View style={styles.viewBtn}>
            <Text style={styles.viewText}>Xem cửa hàng</Text>
            <FontAwesome name="chevron-right" size={12} color="#fff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={18} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Danh sách cửa hàng</Text>

        <View style={{ width: 18 }} />
      </View>

      {/* ===== LIST ===== */}
      <FlatList
        data={STORES}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ===== HEADER ===== */

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  /* ===== LIST ===== */

  list: {
    padding: 16,
  },

  /* ===== CARD ===== */

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    resizeMode: "cover",
  },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  address: {
    marginTop: 2,
    fontSize: 12,
    color: "#888",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  rating: {
    fontSize: 13,
    fontWeight: "600",
  },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#000",
  },

  viewText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
});
