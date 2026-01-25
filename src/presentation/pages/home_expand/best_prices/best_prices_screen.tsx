import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const DATA = [
  {
    id: 1,
    name: "VinFast Feliz S",
    price: "29.900.000đ",
    image: require("../../../../../pic/home/bs1.png"),
  },
  {
    id: 2,
    name: "VinFast Klara S",
    price: "36.900.000đ",
    image: require("../../../../../pic/home/bs2.png")
  },
  {
    id: 3,
    name: "VinFast Vento",
    price: "56.350.000đ",
    image: require("../../../../../pic/home/bs3.png"),
  },
  // 👉 sau này nối API thì replace DATA
];

const BestPriceAllScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bán chạy</Text>

      <FlatList
        data={DATA}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BestPriceAllScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 16,
    color: "#111",
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },

  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },

  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E53935",
    marginTop: 4,
  },
});
