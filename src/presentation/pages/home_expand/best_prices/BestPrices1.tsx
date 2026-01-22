import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BestPrices1() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>VinFast Feliz S</Text>

        <View style={{ width: 20 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <Image
          source={require("../../../../../pic/home/bs1.png")}
          style={styles.mainImage}
        />

        {/* PRICE */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Giá bán</Text>
          <Text style={styles.price}>29.900.000đ</Text>
        </View>

        {/* INFO */}
        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>Thông tin nổi bật</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quãng đường</Text>
            <Text style={styles.infoValue}>198 km / lần sạc</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tốc độ tối đa</Text>
            <Text style={styles.infoValue}>78 km/h</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pin</Text>
            <Text style={styles.infoValue}>LFP – Chống cháy nổ</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bảo hành</Text>
            <Text style={styles.infoValue}>5 năm</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.descBox}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.desc}>
            VinFast Feliz S là mẫu xe máy điện hiện đại, phù hợp di chuyển
            hằng ngày trong đô thị với thiết kế trẻ trung, vận hành êm ái,
            tiết kiệm chi phí và thân thiện môi trường.
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyBtn} activeOpacity={0.85}>
          <Text style={styles.buyText}>ĐĂNG KÝ MUA XE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1B1D",
  },

  /* HEADER */
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* IMAGE */
  mainImage: {
    width: "100%",
    height: 260,
    resizeMode: "contain",
    backgroundColor: "#000",
  },

  /* PRICE */
  priceBox: {
    padding: 20,
    backgroundColor: "#121212",
  },

  priceLabel: {
    color: "#AAA",
    fontSize: 13,
  },

  price: {
    fontSize: 26,
    fontWeight: "700",
    color: "#E53935",
    marginTop: 6,
  },

  /* INFO */
  infoBox: {
    padding: 20,
    backgroundColor: "#0F1B1D",
  },

  sectionTitle: {
    color: "#E6D5C3",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#2A3A3D",
  },

  infoLabel: {
    color: "#AAA",
    fontSize: 14,
  },

  infoValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },

  /* DESC */
  descBox: {
    padding: 20,
    paddingBottom: 100,
  },

  desc: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 22,
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#000",
    borderTopWidth: 0.5,
    borderTopColor: "#2A3A3D",
  },

  buyBtn: {
    backgroundColor: "#2F80ED",
    paddingVertical: 14,
    borderRadius: 10,
  },

  buyText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
