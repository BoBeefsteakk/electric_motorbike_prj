import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../src/context/themeContext";
import { darkTheme, lightTheme } from "../../../../../src/theme/colors";

export default function News3() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        VinFast triển khai dịch vụ giao xe toàn quốc: Linh hoạt, thuận tiện, tối
        ưu trải nghiệm
      </Text>

      <Text
        style={[styles.intro, { color: theme === "dark" ? "#CBD5E1" : "#555" }]}
      >
        Với mong muốn mang đến trải nghiệm mua xe thuận tiện và chu đáo, VinFast
        không ngừng nỗ lực cải tiến từng bước trong hành trình khách hàng.
      </Text>

      <Image
        source={require("../../../../../pic/home/news3.jpg")}
        style={styles.image}
      />

      <Text
        style={[
          styles.content,
          { color: theme === "dark" ? "#CBD5E1" : "#444" },
        ]}
      >
        VinFast triển khai dịch vụ giao xe linh hoạt trên toàn quốc, cho phép
        khách hàng lựa chọn nhận xe tại Trung tâm thương mại Vincom hoặc giao xe
        tận nhà, đáp ứng đa dạng nhu cầu sử dụng.
      </Text>

      <Text
        style={[
          styles.content,
          { color: theme === "dark" ? "#CBD5E1" : "#444" },
        ]}
      >
        Thông qua nền tảng O2O (Online to Offline), khách hàng có thể dễ dàng
        thực hiện toàn bộ quy trình mua xe trực tuyến và lựa chọn hình thức nhận
        xe phù hợp.
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Giao xe tận nhà: Tiện lợi tối đa
      </Text>

      <Text
        style={[
          styles.content,
          { color: theme === "dark" ? "#CBD5E1" : "#444" },
        ]}
      >
        Dịch vụ giao xe tận nhà giúp khách hàng tiết kiệm thời gian, công sức và
        tận hưởng trải nghiệm cá nhân hóa trong không gian riêng tư.
      </Text>

      <View style={styles.list}>
        {[
          "Tiết kiệm thời gian và công sức",
          "Trải nghiệm cá nhân hóa, riêng tư",
          "Thủ tục đơn giản, minh bạch",
        ].map((item, index) => (
          <Text
            key={index}
            style={[
              styles.listItem,
              { color: theme === "dark" ? "#CBD5E1" : "#444" },
            ]}
          >
            • {item}
          </Text>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Cam kết từ VinFast O2O
      </Text>

      <Text
        style={[
          styles.content,
          { color: theme === "dark" ? "#CBD5E1" : "#444" },
        ]}
      >
        Dù nhận xe tại Vincom hay tại nhà, VinFast O2O cam kết mang đến dịch vụ
        chuyên nghiệp, chu đáo và tối ưu trải nghiệm cho khách hàng trên toàn
        quốc.
      </Text>

      <Text
        style={[
          styles.footer,
          { color: theme === "dark" ? "#94A3B8" : "#666" },
        ]}
      >
        VinFast không chỉ cung cấp dịch vụ giao xe toàn quốc, mà còn khẳng định
        cam kết đồng hành lâu dài cùng cộng đồng người dùng xe điện hiện đại.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 12,
  },

  intro: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: 14,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },

  list: {
    marginLeft: 8,
    marginBottom: 16,
  },

  listItem: {
    fontSize: 15,
    lineHeight: 22,
  },

  footer: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
  },
});
