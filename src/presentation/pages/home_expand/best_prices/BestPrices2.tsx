import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BestPrices2() {
  const navigation = useNavigation();
  const [selectedColor, setSelectedColor] = useState(2);

  const variants = [
    {
      id: 1,
      label: "Đỏ",
      color: "#C0392B",
      price: 29900000,
    },
    {
      id: 2,
      label: "Xanh đậm",
      color: "#2C3E50",
      price: 30500000,
    },
    {
      id: 3,
      label: "Nâu đồng",
      color: "#B97745",
      price: 31200000,
    },
  ];

  const selectedVariant = variants.find((item) => item.id === selectedColor)!;

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={20} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi Tiết</Text>

        <TouchableOpacity>
          <FontAwesome name="heart-o" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* IMAGE */}
        <View style={styles.imageBox}>
          <Image
            source={require("../../../../../pic/home/bs2.png")}
            style={styles.image}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title}>VinFast Klara S</Text>

          {/* RATING */}
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#F5A623" />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.ratingCount}>(230)</Text>
          </View>

          {/* DESC */}
          <Text style={styles.desc}>
            VinFast Feliz S là mẫu xe máy điện hiện đại, phù hợp di chuyển hằng
            ngày trong đô thị với khả năng vận hành êm ái và tiết kiệm chi phí.
          </Text>

          {/* QUICK INFO */}
          <View style={styles.quickInfo}>
            <View style={styles.quickItem}>
              <Text style={styles.quickValue}>198km</Text>
              <Text style={styles.quickLabel}>1 lần sạc</Text>
            </View>
            <View style={styles.quickItem}>
              <Text style={styles.quickValue}>78km/h</Text>
              <Text style={styles.quickLabel}>Tối đa</Text>
            </View>
            <View style={styles.quickItem}>
              <Text style={styles.quickValue}>LFP</Text>
              <Text style={styles.quickLabel}>Pin an toàn</Text>
            </View>
          </View>

          {/* HIGHLIGHT */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionTitle}>Ưu điểm nổi bật</Text>
            <Text style={styles.bullet}>• Vận hành êm ái, không tiếng ồn</Text>
            <Text style={styles.bullet}>• Tiết kiệm chi phí nhiên liệu</Text>
            <Text style={styles.bullet}>• Thiết kế trẻ trung, hiện đại</Text>
          </View>

          {/* SPEC */}
          <View style={styles.specBox}>
            <Text style={styles.sectionTitle}>Thông số chính</Text>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Bảo hành</Text>
              <Text style={styles.specValue}>5 năm</Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Thời gian sạc</Text>
              <Text style={styles.specValue}>~6 giờ</Text>
            </View>
          </View>

          {/* COLOR */}
          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Màu sắc</Text>

            <View style={styles.colorRow}>
              {variants.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.colorItem,
                    selectedColor === item.id && styles.colorItemActive,
                  ]}
                  onPress={() => setSelectedColor(item.id)}
                >
                  <View
                    style={[styles.colorFill, { backgroundColor: item.color }]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Giá bán</Text>
          <Text style={styles.price}>{formatPrice(selectedVariant.price)}</Text>

          <View style={styles.colorInfo}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: selectedVariant.color },
              ]}
            />
            <Text style={styles.colorText}>Màu {selectedVariant.label}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buyBtn} activeOpacity={0.85}>
          <Text style={styles.buyText}>ĐĂNG KÝ MUA XE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    marginTop: 50,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  imageBox: {
    margin: 16,
    height: 240,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    marginLeft: 6,
    fontWeight: "600",
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 12,
    color: "#999",
  },

  desc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 18,
  },

  quickInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  quickItem: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
  },
  quickValue: {
    fontWeight: "700",
    fontSize: 15,
  },
  quickLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },

  highlightBox: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

  specBox: {
    marginBottom: 22,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  specLabel: {
    color: "#777",
  },
  specValue: {
    fontWeight: "600",
  },

  colorSection: {
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorItem: {
    width: "30%",
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  colorItemActive: {
    borderColor: "#C47A4A",
  },
  colorFill: {
    width: "85%",
    height: "65%",
    borderRadius: 10,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  priceLabel: {
    fontSize: 12,
    color: "#888",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C0392B",
  },

  colorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  colorText: {
    fontSize: 12,
    color: "#777",
  },

  buyBtn: {
    backgroundColor: "#C47A4A",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
  },
  buyText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
