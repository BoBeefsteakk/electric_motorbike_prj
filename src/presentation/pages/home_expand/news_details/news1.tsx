import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function News1() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== TITLE ===== */}
      <Text style={styles.title}>
        VinFast O2O triển khai nền tảng mua xe máy điện trực tuyến
      </Text>

      <Text style={styles.intro}>
        Nắm bắt xu hướng tiêu dùng số hóa, VinFast O2O chính thức triển khai nền
        tảng mua xe máy điện trực tuyến nhằm mang lại trải nghiệm mua sắm tiện
        lợi, nhanh chóng cho khách hàng.
      </Text>

      <Image
        source={require("../../../../../pic/home/news1.jpg")}
        style={styles.image}
      />

      {/* ===== SECTION 1 ===== */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>1. Tiện lợi trong tầm tay</Text>

        <Text style={styles.content}>
          Hình thức mua xe máy điện trực tuyến không chỉ là một lựa chọn mới mà
          còn là một trải nghiệm mua sắm thông minh, mang lại nhiều lợi ích thiết
          thực.
        </Text>

        <Text style={styles.subTitle}>Chủ động mua sắm, tiết kiệm thời gian</Text>
        <Text style={styles.content}>
          Khách hàng có thể dễ dàng tìm hiểu thông tin sản phẩm, giá bán và đặt
          cọc trực tuyến mọi lúc, mọi nơi.
        </Text>

        <Text style={styles.subTitle}>Thanh toán đa dạng và linh hoạt</Text>
        <Text style={styles.content}>
          VinFast hỗ trợ nhiều hình thức thanh toán:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>• Thẻ tín dụng / ghi nợ</Text>
          <Text style={styles.listItem}>• ATM / Internet Banking</Text>
          <Text style={styles.listItem}>• Chuyển khoản ngân hàng</Text>
          <Text style={styles.listItem}>• Trả góp qua thẻ tín dụng</Text>
        </View>
      </View>

      {/* ===== SECTION 2 ===== */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>2. Mạng lưới giao nhận linh hoạt</Text>

        <Text style={styles.content}>
          Điểm khác biệt của VinFast O2O là sự kết hợp với hệ thống Trung tâm
          Thương mại Vincom – nơi có vị trí giao thông thuận lợi và tích hợp đa
          tiện ích.
        </Text>

        <Text style={styles.subTitle}>Vị trí vàng – Dễ dàng tiếp cận</Text>
        <Text style={styles.content}>
          Các TTTM Vincom đều tọa lạc tại trung tâm các thành phố lớn, giúp khách
          hàng tiết kiệm thời gian di chuyển.
        </Text>

        <Text style={styles.subTitle}>Tiện ích giải trí toàn diện</Text>
        <Text style={styles.content}>
          Việc nhận xe có thể kết hợp mua sắm, ẩm thực và giải trí, mang lại trải
          nghiệm trọn vẹn cho cả gia đình.
        </Text>

        <Text style={styles.subTitle}>Tích hợp hệ sinh thái xanh</Text>
        <Text style={styles.content}>
          Các điểm nhận xe đều tích hợp trạm sạc VinFast, giúp khách hàng nhanh
          chóng làm quen với xe điện.
        </Text>

        <Text style={styles.subTitle}>Các điểm nhận xe tiêu biểu</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Hải Phòng: Vincom Plaza Imperia Hải Phòng
          </Text>
          <Text style={styles.listItem}>
            • Hà Nội: Vincom Mega Mall Ocean Park
          </Text>
          <Text style={styles.listItem}>
            • Hà Nội: Vincom Mega Mall Smart City
          </Text>
          <Text style={styles.listItem}>
            • Hà Nội: Vincom Mega Mall Royal City
          </Text>
        </View>
      </View>

      {/* ===== SECTION 3 ===== */}
      <View style={styles.block}>
        <Text style={styles.sectionTitle}>
          3. Mua xe dễ dàng với quy trình 5 bước
        </Text>

        <Text style={styles.content}>
          Quy trình mua xe máy điện trực tuyến trên website chính thức của VinFast
          được tối giản chỉ với 5 bước rõ ràng, thuận tiện:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • <Text style={styles.boldInline}>Bước 1:</Text> Truy cập website{" "}
            <Text style={styles.link}>https://shop.vinfastauto.com</Text>
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.boldInline}>Bước 2:</Text> Lựa chọn mẫu xe yêu
            thích, điền thông tin cá nhân và chọn địa điểm nhận xe.
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.boldInline}>Bước 3:</Text> VinFast gửi email xác
            nhận và hướng dẫn theo dõi đơn hàng.
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.boldInline}>Bước 4:</Text> Hoàn tất thủ tục
            thanh toán theo hướng dẫn.
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.boldInline}>Bước 5:</Text> Nhận xe tại địa điểm
            đã đăng ký.
          </Text>
        </View>

        <Text style={styles.content}>
          Khách hàng mua xe trực tuyến được hưởng ưu đãi chuyển đổi xanh lên tới{" "}
          <Text style={styles.highlight}>12%</Text> (áp dụng đến 31/12/2025).
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
          <Text style={styles.date}>06/12/2025</Text>
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
  marginBottom: 20
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
  fontWeight: "700"
},

/* RIGHT */
footerRight: {
  alignItems: "flex-end",
},

shareLabel: {
  color: "#000000",
  fontSize: 13,
  marginBottom: 4,
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
