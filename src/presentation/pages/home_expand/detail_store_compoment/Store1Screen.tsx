import { View, Text, StyleSheet } from "react-native";

export default function Store1Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết Cửa hàng 1</Text>
      <Text style={styles.desc}>
        Nội dung khuyến mãi / chiến dịch / sản phẩm
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: "#666",
  },
});