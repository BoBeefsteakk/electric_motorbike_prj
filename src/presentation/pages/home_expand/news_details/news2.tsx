import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function News2() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== TITLE ===== */}
      <Text style={styles.title}>
        VinFast ra mắt 4 mẫu xe máy điện mới, hoàn thiện lắp đặt 4.500 trạm đổi pin đầu tiên
      </Text>

      <Text style={styles.intro}>
        Hà Nội, ngày 15/01/2026 – VinFast chính thức công bố ra mắt 4 mẫu xe máy điện
        mới, đồng thời hoàn tất lắp đặt 4.500 trạm đổi pin đầu tiên, sẵn sàng cho giai
        đoạn mở rộng toàn quốc trong năm 2026.
      </Text>

      {/* ===== MAIN IMAGE ===== */}
      <Image
        source={require("../../../../../pic/home/news2.jpg")}
        style={styles.image}
      />

      {/* ===== SECTION 1 ===== */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>1. Hoàn thiện hạ tầng đổi pin quy mô lớn</Text>

        <Text style={styles.content}>
          Song song với việc phát triển sản phẩm, VinFast và V-Green đã hoàn tất
          lắp đặt 4.500 trạm đổi pin đầu tiên tại 34 tỉnh, thành phố trên cả nước.
        </Text>

        <Text style={styles.content}>
          Dự kiến trong Quý I/2026, số lượng trạm đổi pin sẽ tiếp tục được mở rộng
          lên 45.000 trạm, tạo nền tảng hạ tầng vững chắc cho người dùng xe máy điện.
        </Text>

        <Text style={styles.content}>
          Hệ thống trạm đổi pin được bố trí tại các khu dân cư, tuyến phố lớn,
          trung tâm thương mại và điểm giao thông công cộng, đảm bảo khả năng tiếp cận
          thuận tiện cho người dùng.
        </Text>
      </View>

      {/* ===== SECTION 2 ===== */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>2. Ra mắt 4 mẫu xe máy điện mới</Text>

        <Text style={styles.content}>
          VinFast chính thức giới thiệu 4 mẫu xe máy điện mới gồm: Evo, Feliz II,
          Viper và Amio, đáp ứng đa dạng nhu cầu di chuyển của nhiều nhóm khách hàng.
        </Text>

        <Text style={styles.subTitle}>Các dòng xe đổi pin</Text>
        <Text style={styles.content}>
          Evo, Feliz II và Viper đều được trang bị 2 khay pin trong cốp, sử dụng pin
          LFP dung lượng 1,5 kWh, đảm bảo độ an toàn cao và tuổi thọ bền bỉ.
        </Text>

        <Text style={styles.content}>
          Trong đó, Evo có thể di chuyển quãng đường lên tới 165 km sau mỗi lần sạc,
          trong khi Feliz II và Viper đạt quãng đường tối đa khoảng 156 km.
        </Text>

        <Text style={styles.subTitle}>Mẫu xe không cần bằng lái</Text>
        <Text style={styles.content}>
          Amio là mẫu xe điện nhỏ gọn, không yêu cầu bằng lái, phù hợp với học sinh
          và người di chuyển quãng đường ngắn trong đô thị.
        </Text>
      </View>

      {/* ===== SECTION 3 ===== */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>3. Chính sách bán hàng & ưu đãi</Text>

        <Text style={styles.content}>
          VinFast triển khai chương trình “Mãnh liệt tinh thần Xanh” trên toàn quốc,
          áp dụng nhiều ưu đãi hấp dẫn cho khách hàng mua xe máy điện.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Miễn phí đổi pin tại các trạm sạc công cộng V-Green đến hết 31/05/2027
          </Text>
          <Text style={styles.listItem}>
            • Hỗ trợ trả góp 0% lãi suất
          </Text>
          <Text style={styles.listItem}>
            • Ưu đãi chuyển đổi xanh lên đến <Text style={styles.boldInline}>12%</Text>
          </Text>
          <Text style={styles.listItem}>
            • Chính sách bảo hành pin lên tới <Text style={styles.boldInline}>12 tháng</Text>
          </Text>
        </View>

        <Text style={styles.content}>
          Ngoài ra, VinFast cũng triển khai chương trình đặt cọc sớm cho dòng Evo
          với mức giá ưu đãi và dự kiến bàn giao những chiếc xe đầu tiên từ tháng 2/2026.
        </Text>
      </View>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        {/* Left */}
        <View style={styles.footerLeft}>
          <View style={styles.socialBtn}>
            <Text style={styles.socialText}>👍 Like</Text>
            <Text style={styles.socialCount}>0</Text>
          </View>

          <View style={[styles.socialBtn, styles.shareBtn]}>
            <Text style={styles.socialText}>Share</Text>
          </View>
        </View>

        {/* Center */}
        <View style={styles.footerCenter}>
          <Text style={styles.date}>15/01/2026</Text>
        </View>

        {/* Right */}
        <View style={styles.footerRight}>
          <View style={styles.iconRow}>
            <Text style={styles.icon}>f</Text>
            <Text style={styles.icon}>𝕏</Text>
            <Text style={styles.icon}>✉</Text>
            <Text style={styles.icon}>in</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d5d3d3",
    padding: 16,
  },

  title: {
    color: "#000000",
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 34,
    marginBottom: 12,
  },

  intro: {
    color: "#000000",
    fontSize: 15,
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },

  block: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  subTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },

  content: {
    color: "#000000",
    fontSize: 15,
    lineHeight: 22,
  },

  list: {
    marginTop: 6,
    marginLeft: 8,
  },

  listItem: {
    color: "#000000",
    fontSize: 15,
    lineHeight: 22,
  },

  boldInline: {
    color: "#000000",
    fontWeight: "600",
  },

  link: {
    color: "#000000",
    textDecorationLine: "underline",
  },

  highlight: {
    color: "#000000",
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 20,
  },

  /* LEFT */
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1877f2",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },

  shareBtn: {
    backgroundColor: "#1b74e4",
  },

  socialText: {
    color: "#fff",
    fontSize: 13,
    marginRight: 4,
  },

  socialCount: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  /* CENTER */
  footerCenter: {
    alignItems: "center",
  },

  date: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
  },

  /* RIGHT */
  footerRight: {
    alignItems: "flex-end",
  },

  iconRow: {
    flexDirection: "row",
  },

  icon: {
    color: "#000000",
    fontSize: 14,
    marginLeft: 10,
  },
});
