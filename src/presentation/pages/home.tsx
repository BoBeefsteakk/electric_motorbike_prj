import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ======================= CONSTANT ======================= */

const { width } = Dimensions.get("window");

/**
 * 40 = paddingHorizontal (20 * 2)
 * 24 = gap giữa 3 card (12 * 2)
 */
const CARD_WIDTH = (width - 40 - 24) / 3;

/* ======================= SCREEN ======================= */

const HomeScreen = () => {
  /* ======================= DATA ======================= */

  const categories = [
    { id: 1, name: "Special Voucher", type: "special", color: "#FF8A5B" },
    {
      id: 2,
      name: "Phổ Thông",
      image: require("../../../pic/home/phothong.png"),
      color: "#F5E6D3",
    },
    {
      id: 3,
      name: "Trung Cấp",
      image: require("../../../pic/home/trungcap.png"),
      color: "#FFE5E5",
    },
    {
      id: 4,
      name: "Cao Cấp",
      image: require("../../../pic/home/caocap.png"),
      color: "#FFF8F0",
    },
    {
      id: 5,
      name: "Ô Tô",
      image: require("../../../pic/home/oto.png"),
      color: "#FFF8E7",
    },
    {
      id: 6,
      name: "Phụ Kiện",
      image: require("../../../pic/home/phukien.png"),
      color: "#F0FFF0",
    },
  ];

  const places = [
    {
      id: 1,
      name: "VIN3S VĨNH THÀNH 2",
      rating: 4.9,
      address: "Số 27 Định Công, Hoàng Mai, Hà Nội",
      image: require("../../../pic/home/store1.jpg"),
    },
    {
      id: 2,
      name: "VIN3S NGỌC HỒI",
      rating: 4.8,
      address: "Số 9 Ngọc Hồi, Hoàng Mai, Hà Nội",
      image: require("../../../pic/home/store2.jpg"),
    },
    {
      id: 3,
      name: "VINFAST PHẠM NGỌC THẠCH",
      rating: 4.8,
      address: "Vincom Center Phạm Ngọc Thạch, Đống Đa, Hà Nội",
      image: require("../../../pic/home/store3.jpg"),
    },
    {
      id: 4,
      name: "VINFAST TRÀNG AN",
      rating: 4.8,
      address: "Số 68 Lê Văn Lương, Thanh Xuân, Hà Nội",
      image: require("../../../pic/home/store4.jpg"),
    },
    {
      id: 5,
      name: "VINFAST VIỆT THANH",
      rating: 4.8,
      address: "165B Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
      image: require("../../../pic/home/store5.jpg"),
    },
  ];

  const bestPrices = [
    {
      id: 1,
      image: require("../../../pic/home/bs1.png"),
    },
    {
      id: 2,
      image: require("../../../pic/home/bs2.png"),
    },
    {
      id: 3,
      image: require("../../../pic/home/bs3.png"),
    },
  ];

  /* ======================= RENDER ======================= */

  const renderCategoryCard = (cat: any) => {
    if (cat.type === "special") {
      return (
        <TouchableOpacity
          key={cat.id}
          style={[styles.specialCard, { backgroundColor: cat.color }]}
        >
          <Text style={styles.specialTitle} numberOfLines={1}>
            Special Voucher
          </Text>

          <View style={styles.discountBadges}>
            <View style={[styles.badge, { backgroundColor: "#5DADE2" }]}>
              <Text style={styles.badgeText}>-50%</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#58D68D" }]}>
              <Text style={styles.badgeText}>-25%</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#F8B4D9" }]}>
              <Text style={styles.badgeText}>-15%</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={cat.id}
        style={[styles.categoryCard, { backgroundColor: cat.color }]}
      >
        <Image source={cat.image} style={styles.categoryIcon} />
        <Text style={styles.categoryName}>{cat.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../../pic/home/vinfast_home.png")}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CATEGORIES */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryRow}>
            {categories.slice(0, 3).map(renderCategoryCard)}
          </View>
          <View style={styles.categoryRow}>
            {categories.slice(3, 6).map(renderCategoryCard)}
          </View>
        </View>

        {/* PLACES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cửa Hàng</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {places.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                <Image source={place.image} style={styles.placeImage} />

                <Text style={styles.placeName} numberOfLines={2}>
                  {place.name}
                </Text>

                <View style={styles.placeInfoRow}>
                  <Text style={styles.rating}>⭐ {place.rating}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.placeAddress} numberOfLines={1}>
                    {place.address}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* BEST PRICES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bán Chạy</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bestPrices.map((item) => (
              <View key={item.id} style={styles.priceCard}>
                <Image source={item.image} style={styles.priceImage} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ======================= STYLE ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b6c1cc",
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  headerImage: {
    width: 180,
    height: 55,
    marginTop: 30,
  },

  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  categoryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  categoryCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  specialCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: "flex-start",
  },

  specialTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 10,
  },

  discountBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  badge: {
    width: "48%",
    paddingVertical: 6,
    marginBottom: 6,
    borderRadius: 14,
    alignItems: "center",
  },

  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },

  categoryIcon: {
    width: 100,
    height: 60,
    marginBottom: 6,
    resizeMode: "contain",
  },

  categoryName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },

  section: {
    paddingLeft: 20,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 15,
  },

  placeCard: {
    width: 180,
    marginRight: 15,
  },

  placeImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
  },

  placeName: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    height: 36, // khóa 2 dòng
    marginBottom: 4,
  },

  placeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    fontSize: 12,
    color: "#333",
  },

  dot: {
    marginHorizontal: 4,
    color: "#999",
  },

  placeAddress: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },

  priceCard: {
    width: 140,
    marginRight: 15,
  },

  priceImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
});
