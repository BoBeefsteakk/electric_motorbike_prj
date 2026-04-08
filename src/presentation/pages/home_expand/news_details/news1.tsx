import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../src/context/themeContext";
import { darkTheme, lightTheme } from "../../../../../src/theme/colors";

export default function News1() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        VinFast O2O triển khai nền tảng mua xe máy điện trực tuyến
      </Text>

      <Text
        style={[
          styles.intro,
          { color: theme === "dark" ? "#CBD5E1" : "#000000" },
        ]}
      >
        Nắm bắt xu hướng tiêu dùng số hóa, VinFast O2O chính thức triển khai nền
        tảng mua xe máy điện trực tuyến nhằm mang lại trải nghiệm mua sắm tiện
        lợi, nhanh chóng cho khách hàng.
      </Text>

      <Image
        source={require("../../../../../pic/home/news1.jpg")}
        style={styles.image}
      />

      <View style={styles.block}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          1. Tiện lợi trong tầm tay
        </Text>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Hình thức mua xe máy điện trực tuyến không chỉ là một lựa chọn mới mà
          còn là một trải nghiệm mua sắm thông minh, mang lại nhiều lợi ích
          thiết thực.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Chủ động mua sắm, tiết kiệm thời gian
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Khách hàng có thể dễ dàng tìm hiểu thông tin sản phẩm, giá bán và đặt
          cọc trực tuyến mọi lúc, mọi nơi.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Thanh toán đa dạng và linh hoạt
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          VinFast hỗ trợ nhiều hình thức thanh toán:
        </Text>

        <View style={styles.list}>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Thẻ tín dụng / ghi nợ
          </Text>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • ATM / Internet Banking
          </Text>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Chuyển khoản ngân hàng
          </Text>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Trả góp qua thẻ tín dụng
          </Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          2. Mạng lưới giao nhận linh hoạt
        </Text>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Điểm khác biệt của VinFast O2O là sự kết hợp với hệ thống Trung tâm
          Thương mại Vincom – nơi có vị trí giao thông thuận lợi và tích hợp đa
          tiện ích.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Vị trí vàng – Dễ dàng tiếp cận
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Các TTTM Vincom đều tọa lạc tại trung tâm các thành phố lớn, giúp
          khách hàng tiết kiệm thời gian di chuyển.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Tiện ích giải trí toàn diện
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Việc nhận xe có thể kết hợp mua sắm, ẩm thực và giải trí, mang lại
          trải nghiệm trọn vẹn cho cả gia đình.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Tích hợp hệ sinh thái xanh
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Các điểm nhận xe đều tích hợp trạm sạc VinFast, giúp khách hàng nhanh
          chóng làm quen với xe điện.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Các điểm nhận xe tiêu biểu
        </Text>
        <View style={styles.list}>
          {[
            "Hải Phòng: Vincom Plaza Imperia Hải Phòng",
            "Hà Nội: Vincom Mega Mall Ocean Park",
            "Hà Nội: Vincom Mega Mall Smart City",
            "Hà Nội: Vincom Mega Mall Royal City",
          ].map((item, index) => (
            <Text
              key={index}
              style={[
                styles.listItem,
                { color: theme === "dark" ? "#CBD5E1" : "#000000" },
              ]}
            >
              • {item}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          3. Mua xe dễ dàng với quy trình 5 bước
        </Text>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Quy trình mua xe máy điện trực tuyến trên website chính thức của
          VinFast được tối giản chỉ với 5 bước rõ ràng, thuận tiện:
        </Text>

        <View style={styles.list}>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            •{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>
              Bước 1:
            </Text>{" "}
            Truy cập website{" "}
            <Text
              style={[
                styles.link,
                { color: theme === "dark" ? "#93C5FD" : "#000000" },
              ]}
            >
              https://shop.vinfastauto.com
            </Text>
          </Text>

          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            •{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>
              Bước 2:
            </Text>{" "}
            Lựa chọn mẫu xe yêu thích, điền thông tin cá nhân và chọn địa điểm
            nhận xe.
          </Text>

          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            •{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>
              Bước 3:
            </Text>{" "}
            VinFast gửi email xác nhận và hướng dẫn theo dõi đơn hàng.
          </Text>

          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            •{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>
              Bước 4:
            </Text>{" "}
            Hoàn tất thủ tục thanh toán theo hướng dẫn.
          </Text>

          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            •{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>
              Bước 5:
            </Text>{" "}
            Nhận xe tại địa điểm đã đăng ký.
          </Text>
        </View>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Khách hàng mua xe trực tuyến được hưởng ưu đãi chuyển đổi xanh lên tới{" "}
          <Text style={[styles.highlight, { color: colors.text }]}>12%</Text>{" "}
          (áp dụng đến 31/12/2025).
        </Text>
      </View>

      <View
        style={[
          styles.footer,
          { borderTopColor: theme === "dark" ? "#334155" : "#333" },
        ]}
      >
        <View style={styles.footerLeft}>
          <View style={styles.socialBtn}>
            <Text style={styles.socialText}>👍 Like</Text>
            <Text style={styles.socialCount}>0</Text>
          </View>

          <View style={[styles.socialBtn, styles.shareBtn]}>
            <Text style={styles.socialText}>Share</Text>
          </View>
        </View>

        <View style={styles.footerCenter}>
          <Text style={[styles.date, { color: colors.text }]}>06/12/2025</Text>
        </View>

        <View style={styles.footerRight}>
          <View style={styles.iconRow}>
            {["f", "𝕏", "✉", "in"].map((icon, index) => (
              <Text
                key={index}
                style={[
                  styles.icon,
                  { color: theme === "dark" ? "#CBD5E1" : "#000000" },
                ]}
              >
                {icon}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 34,
    marginBottom: 12,
  },

  intro: {
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
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
  },

  list: {
    marginTop: 6,
    marginLeft: 8,
  },

  listItem: {
    fontSize: 15,
    lineHeight: 22,
  },

  boldInline: {
    fontWeight: "600",
  },

  link: {
    textDecorationLine: "underline",
  },

  highlight: {
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 20,
  },

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

  footerCenter: {
    alignItems: "center",
  },

  date: {
    fontSize: 13,
    fontWeight: "700",
  },

  footerRight: {
    alignItems: "flex-end",
  },

  iconRow: {
    flexDirection: "row",
  },

  icon: {
    fontSize: 14,
    marginLeft: 10,
  },
});
