import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../src/context/themeContext";
import { darkTheme, lightTheme } from "../../../../../src/theme/colors";

export default function News2() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        VinFast ra mắt 4 mẫu xe máy điện mới, hoàn thiện lắp đặt 4.500 trạm đổi
        pin đầu tiên
      </Text>

      <Text
        style={[
          styles.intro,
          { color: theme === "dark" ? "#CBD5E1" : "#000000" },
        ]}
      >
        Hà Nội, ngày 15/01/2026 – VinFast chính thức công bố ra mắt 4 mẫu xe máy
        điện mới, đồng thời hoàn tất lắp đặt 4.500 trạm đổi pin đầu tiên, sẵn
        sàng cho giai đoạn mở rộng toàn quốc trong năm 2026.
      </Text>

      <Image
        source={require("../../../../../pic/home/news2.jpg")}
        style={styles.image}
      />

      <View style={styles.block}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          1. Hoàn thiện hạ tầng đổi pin quy mô lớn
        </Text>

        {[
          "Song song với việc phát triển sản phẩm, VinFast và V-Green đã hoàn tất lắp đặt 4.500 trạm đổi pin đầu tiên tại 34 tỉnh, thành phố trên cả nước.",
          "Dự kiến trong Quý I/2026, số lượng trạm đổi pin sẽ tiếp tục được mở rộng lên 45.000 trạm, tạo nền tảng hạ tầng vững chắc cho người dùng xe máy điện.",
          "Hệ thống trạm đổi pin được bố trí tại các khu dân cư, tuyến phố lớn, trung tâm thương mại và điểm giao thông công cộng, đảm bảo khả năng tiếp cận thuận tiện cho người dùng.",
        ].map((text, index) => (
          <Text
            key={index}
            style={[
              styles.content,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            {text}
          </Text>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          2. Ra mắt 4 mẫu xe máy điện mới
        </Text>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          VinFast chính thức giới thiệu 4 mẫu xe máy điện mới gồm: Evo, Feliz
          II, Viper và Amio, đáp ứng đa dạng nhu cầu di chuyển của nhiều nhóm
          khách hàng.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Các dòng xe đổi pin
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Evo, Feliz II và Viper đều được trang bị 2 khay pin trong cốp, sử dụng
          pin LFP dung lượng 1,5 kWh, đảm bảo độ an toàn cao và tuổi thọ bền bỉ.
        </Text>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Trong đó, Evo có thể di chuyển quãng đường lên tới 165 km sau mỗi lần
          sạc, trong khi Feliz II và Viper đạt quãng đường tối đa khoảng 156 km.
        </Text>

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Mẫu xe không cần bằng lái
        </Text>
        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Amio là mẫu xe điện nhỏ gọn, không yêu cầu bằng lái, phù hợp với học
          sinh và người di chuyển quãng đường ngắn trong đô thị.
        </Text>
      </View>

      <View style={styles.block}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          3. Chính sách bán hàng & ưu đãi
        </Text>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          VinFast triển khai chương trình “Mãnh liệt tinh thần Xanh” trên toàn
          quốc, áp dụng nhiều ưu đãi hấp dẫn cho khách hàng mua xe máy điện.
        </Text>

        <View style={styles.list}>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Miễn phí đổi pin tại các trạm sạc công cộng V-Green đến hết
            31/05/2027
          </Text>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Hỗ trợ trả góp 0% lãi suất
          </Text>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Ưu đãi chuyển đổi xanh lên đến{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>12%</Text>
          </Text>
          <Text
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#000000" },
            ]}
          >
            • Chính sách bảo hành pin lên tới{" "}
            <Text style={[styles.boldInline, { color: colors.text }]}>
              12 tháng
            </Text>
          </Text>
        </View>

        <Text
          style={[
            styles.content,
            { color: theme === "dark" ? "#CBD5E1" : "#000000" },
          ]}
        >
          Ngoài ra, VinFast cũng triển khai chương trình đặt cọc sớm cho dòng
          Evo với mức giá ưu đãi và dự kiến bàn giao những chiếc xe đầu tiên từ
          tháng 2/2026.
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
          <Text style={[styles.date, { color: colors.text }]}>15/01/2026</Text>
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
