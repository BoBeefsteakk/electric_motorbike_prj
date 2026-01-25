import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function News3() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* ===== TITLE ===== */}
      <Text style={styles.title}>
        VinFast triển khai dịch vụ giao xe toàn quốc: Linh hoạt, thuận tiện, tối
        ưu trải nghiệm
      </Text>

      {/* ===== INTRO ===== */}
      <Text style={styles.intro}>
        Với mong muốn mang đến trải nghiệm mua xe thuận tiện và chu đáo, VinFast
        không ngừng nỗ lực cải tiến từng bước trong hành trình khách hàng.
      </Text>

      {/* ===== IMAGE ===== */}
      <Image
        source={require("../../../../../pic/home/news3.jpg")}
        style={styles.image}
      />

      {/* ===== CONTENT ===== */}
      <Text style={styles.content}>
        VinFast triển khai dịch vụ giao xe linh hoạt trên toàn quốc, cho phép
        khách hàng lựa chọn nhận xe tại Trung tâm thương mại Vincom hoặc giao xe
        tận nhà, đáp ứng đa dạng nhu cầu sử dụng.
      </Text>

      <Text style={styles.content}>
        Thông qua nền tảng O2O (Online to Offline), khách hàng có thể dễ dàng
        thực hiện toàn bộ quy trình mua xe trực tuyến và lựa chọn hình thức nhận
        xe phù hợp.
      </Text>

      {/* ===== SECTION ===== */}
      <Text style={styles.sectionTitle}>Giao xe tận nhà: Tiện lợi tối đa</Text>

      <Text style={styles.content}>
        Dịch vụ giao xe tận nhà giúp khách hàng tiết kiệm thời gian, công sức và
        tận hưởng trải nghiệm cá nhân hóa trong không gian riêng tư.
      </Text>

      {/* ===== BULLET LIST ===== */}
      <View style={styles.list}>
        <Text style={styles.listItem}>• Tiết kiệm thời gian và công sức</Text>
        <Text style={styles.listItem}>• Trải nghiệm cá nhân hóa, riêng tư</Text>
        <Text style={styles.listItem}>• Thủ tục đơn giản, minh bạch</Text>
      </View>

      {/* ===== SECTION ===== */}
      <Text style={styles.sectionTitle}>Cam kết từ VinFast O2O</Text>

      <Text style={styles.content}>
        Dù nhận xe tại Vincom hay tại nhà, VinFast O2O cam kết mang đến dịch vụ
        chuyên nghiệp, chu đáo và tối ưu trải nghiệm cho khách hàng trên toàn
        quốc.
      </Text>

      {/* ===== FOOTER ===== */}
      <Text style={styles.footer}>
        VinFast không chỉ cung cấp dịch vụ giao xe toàn quốc, mà còn khẳng định
        cam kết đồng hành lâu dài cùng cộng đồng người dùng xe điện hiện đại.
      </Text>
    </ScrollView>
  );
}

/* ===================== STYLE (THEO NEWS 1 / 2) ===================== */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    padding: 16,
    paddingBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#E6C38A",
    lineHeight: 30,
    marginBottom: 12,
  },

  intro: {
    fontSize: 14,
    color: "#bbb",
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
    color: "#ddd",
    lineHeight: 22,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4da3ff",
    marginTop: 12,
    marginBottom: 8,
  },

  list: {
    marginLeft: 8,
    marginBottom: 16,
  },

  listItem: {
    fontSize: 15,
    color: "#ddd",
    lineHeight: 22,
  },

  footer: {
    fontSize: 13,
    color: "#888",
    lineHeight: 20,
    marginTop: 16,
  },
});
