import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HomeStackParamList } from "../../../navigation/types";
import BEST_PRICE_DATA, {
  BestPriceItem,
} from "../../../../data/bestPrice";

/* ================= TYPES ================= */

type RouteProps = RouteProp<HomeStackParamList, "best_price_detail">;

/* ================= SCREEN ================= */

export default function BestPriceDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { id } = route.params;

  const data: BestPriceItem | undefined = BEST_PRICE_DATA[id];

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Không tìm thấy sản phẩm
        </Text>
      </SafeAreaView>
    );
  }

  /* ================= STATE ================= */

  const [selectedColor, setSelectedColor] = useState<number>(
    data.colors[0].id
  );

  const selectedVariant = useMemo(
    () => data.colors.find((c) => c.id === selectedColor)!,
    [selectedColor, data.colors]
  );

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + "đ";

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ===== HEADER ===== */}
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
        {/* ===== IMAGE ===== */}
        <View style={styles.imageBox}>
          <Image source={data.image} style={styles.image} />
        </View>

        {/* ===== CONTENT ===== */}
        <View style={styles.content}>
          <Text style={styles.title}>{data.title}</Text>

          {/* RATING */}
          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={14} color="#F5A623" />
            <Text style={styles.rating}>{data.rating}</Text>
            <Text style={styles.ratingCount}>
              ({data.ratingCount})
            </Text>
          </View>

          {/* DESC */}
          <Text style={styles.desc}>{data.desc}</Text>

          {/* QUICK INFO */}
          <View style={styles.quickInfo}>
            {data.quickInfo.map((item, index) => (
              <View key={index} style={styles.quickItem}>
                <Text style={styles.quickValue}>{item.value}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* HIGHLIGHTS */}
          <View style={styles.highlightBox}>
            <Text style={styles.sectionTitle}>Ưu điểm nổi bật</Text>
            {data.highlights.map((text, index) => (
              <Text key={index} style={styles.bullet}>
                • {text}
              </Text>
            ))}
          </View>

          {/* SPECS */}
          <View style={styles.specBox}>
            <Text style={styles.sectionTitle}>Thông số chính</Text>
            {data.specs.map((item, index) => (
              <View key={index} style={styles.specRow}>
                <Text style={styles.specLabel}>{item.label}</Text>
                <Text style={styles.specValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        {/* LEFT */}
        <View style={{ flex: 1 }}>
          <Text style={styles.priceLabel}>Giá bán</Text>
          <Text style={styles.price}>
            {formatPrice(selectedVariant.price)}
          </Text>

          {/* COLOR PICKER */}
          <View style={styles.footerColorRow}>
            {data.colors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.footerColorItem,
                  selectedColor === item.id &&
                    styles.footerColorItemActive,
                ]}
                onPress={() => setSelectedColor(item.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.footerColorFill,
                    { backgroundColor: item.color },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RIGHT */}
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

  /* HEADER */
  header: {
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

  /* IMAGE */
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

  /* CONTENT */
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

  /* QUICK INFO */
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

  /* HIGHLIGHT */
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

  /* SPEC */
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

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
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

  /* COLOR PICKER */
  footerColorRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  footerColorItem: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  footerColorItemActive: {
    borderColor: "#C47A4A",
  },
  footerColorFill: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },

  /* BUY BUTTON */
  buyBtn: {
    marginLeft: 12,
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
