import { FontAwesome } from "@expo/vector-icons";
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
      name: "VinFast Feliz S",
      price: "29.900.000đ",
      image: require("../../../pic/home/bs1.png"),
    },
    {
      id: 2,
      name: "VinFast Klara S",
      price: "36.900.000đ",
      image: require("../../../pic/home/bs2.png"),
    },
    {
      id: 3,
      name: "VinFast Vento",
      price: "56.350.000đ",
      image: require("../../../pic/home/bs3.png"),
    },
  ];

  const news = [
    {
      id: 1,
      title: "VinFast O2O triển khai nền tảng mua xe máy điện trực tuyến",
      image: require("../../../pic/home/news1.jpg"),
    },
    {
      id: 2,
      title:
        "Vinfast ra mắt 4 mẫu xe máy điện mới, hoàn thiện lắp đặt 4500 trạm đổi pin đầu tiên",
      image: require("../../../pic/home/news2.jpg"),
    },
    {
      id: 3,
      title:
        "VinFast triển khai dịch vụ giao xe toàn quốc: Linh hoạt, thuận tiện, tối ưu trải nghiệm",
      image: require("../../../pic/home/news3.jpg"),
    },
  ];

  const consultOptions = [
    {
      id: 1,
      title: "Tư vấn mua xe",
      desc: "Hỗ trợ chọn xe phù hợp nhu cầu",
      icon: "user",
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
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerDark}>
          <View style={styles.headerTop}>
            <Image
              source={require("../../../pic/home/vinfast_home_2.png")}
              style={styles.headerImage}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.7}
            >
              <FontAwesome name="bell" size={22} color="#fff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER – layout bình thường */}
        <View style={styles.bannerWrapper}>
          <Image
            source={require("../../../pic/home/banner.png")}
            style={styles.bannerImage}
          />
        </View>

        {/* ================= CONTENT ================= */}
        {/* CATEGORIES */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {categories.slice(0, 3).map(renderCategoryCard)}
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            {categories.slice(3, 6).map(renderCategoryCard)}
          </View>
        </View>

        {/* PLACES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cửa Hàng</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.seeAllText}>Xem thêm</Text>
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 4, top: 1.5 }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {places.map((place) => (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.7}
                style={styles.placeCard}
              >
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* BEST PRICES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bán Chạy</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.seeAllText}>Xem thêm</Text>
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 4, top: 1.5 }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {bestPrices.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.priceCard}
              >
                <Image source={item.image} style={styles.priceImage} />
                <Text style={styles.priceName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.priceText}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* NEWS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tin Tức</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.seeAllText}>Xem thêm</Text>
              <FontAwesome
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 4, top: 1.5 }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {news.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.newsCard}
              >
                <Image source={item.image} style={styles.newsImage} />
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CONSULT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tư vấn</Text>

          <TouchableOpacity style={styles.consultMainCard} activeOpacity={0.7}>
            <FontAwesome name="user" size={28} color="#2C3E50" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.consultTitle}>Tư vấn mua xe</Text>
              <Text style={styles.consultDesc}>
                Hỗ trợ chọn xe phù hợp nhu cầu
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.consultActions}>
            <TouchableOpacity
              style={styles.consultActionBtn}
              activeOpacity={0.6}
            >
              <FontAwesome name="phone" size={20} color="#fff" />
              <Text style={styles.consultActionText}>Gọi ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.consultActionBtn, { backgroundColor: "#0EC143" }]}
              activeOpacity={0.6}
            >
              <FontAwesome name="comment" size={20} color="#fff" />
              <Text style={styles.consultActionText}>Chat Zalo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ======================= STYLE ======================= */

const styles = StyleSheet.create({
  /* ================= CONTAINER ================= */
  container: {
    flex: 1,
    backgroundColor: "#b6c1cc", // nền content
  },

  /* ================= HEADER ================= */
  headerWrapper: {
    backgroundColor: "#000",
    paddingBottom: 80, // chừa chỗ cho banner nổi
  },

  headerDark: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 80,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerImage: {
    width: 140,
    height: 120,
  },

  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },

  /* ================= BANNER FLOAT ================= */
  bannerWrapper: {
    marginHorizontal: 16,
    marginTop: -90, // 👈 đè giữa vùng đen & trắng
    borderRadius: 16,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  bannerImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },

  fixedBanner: {
    position: "absolute",
    top: 90, // 👈 nằm ngay dưới header
    left: 16,
    right: 16,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    zIndex: 1000,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  /* ================= SECTION ================= */
  section: {
    paddingLeft: 20,
    marginTop: 30, // 👈 đẩy content xuống dưới banner
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  seeAllText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  /* ================= CATEGORIES ================= */
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
    justifyContent: "space-between",
  },

  specialTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
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
    width: 80,
    height: 60,
    resizeMode: "contain",
    marginBottom: 6,
  },

  categoryName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },

  /* ================= PLACES ================= */
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
    height: 36,
    marginBottom: 4,
    color: "#111",
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

  /* ================= BEST PRICE ================= */
  priceCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  priceImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },

  priceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  priceText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E53935",
    marginTop: 4,
  },

  /* ================= NEWS ================= */
  newsCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  newsImage: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },

  newsTitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    color: "#222",
  },

  /* ================= CONSULT ================= */
  consultMainCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginRight: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  consultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  consultDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  consultActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginRight: 20,
  },

  consultActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    borderRadius: 12,
  },

  consultActionText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
