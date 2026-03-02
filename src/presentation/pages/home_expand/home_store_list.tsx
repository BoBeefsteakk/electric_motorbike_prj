import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


export default function HomeStoreList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách cửa hàng</Text>
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
  },
});
