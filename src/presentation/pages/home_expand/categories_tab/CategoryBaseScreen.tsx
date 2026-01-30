import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import {
  CATEGORY_PRODUCTS,
  CategoryType,
  ProductItem,
} from "../../../../data/categoryProducts";

/* ================= CATEGORY BUTTONS ================= */

const CATEGORY_BUTTONS = [
  { key: "pho_thong", label: "Phổ thông" },
  { key: "trung_cap", label: "Trung cấp" },
  { key: "cao_cap", label: "Cao cấp" },
  { key: "o_to", label: "Ô tô" },
  { key: "phu_kien", label: "Phụ kiện" },
];

interface Props {
  category: CategoryType;
}

/* ================= SCREEN ================= */

export default function CategoryBaseScreen({ category }: Props) {
  const navigation = useNavigation<any>();
  const data = CATEGORY_PRODUCTS[category];

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }: { item: ProductItem }) => (
  <Pressable
    style={({ pressed }) => [
      styles.cardWrapper,
      pressed && { transform: [{ scale: 0.97 }] },
    ]}
    onPress={() => console.log("Click card:", item.id)}
  >
    <View style={styles.card}>
      {/* IMAGE TOP */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.subTitle}>Rose Garden</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${Math.round(item.price / 1_000_000)}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.addBtn}
          >
            <FontAwesome name="plus" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Pressable>
);


  return (
    <SafeAreaView style={styles.safe}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={18} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Danh mục</Text>

        <View style={{ width: 18 }} />
      </View>

      {/* ================= CATEGORY BAR ================= */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORY_BUTTONS}
        keyExtractor={(i) => i.key}
        contentContainerStyle={styles.categoryBar}
        renderItem={({ item }) => {
          const active = item.key === category;

          return (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                active && styles.categoryActive,
              ]}
              onPress={() =>
                navigation.navigate(`category_${item.key}`)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  active && styles.categoryTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* ================= PRODUCT GRID ================= */}
      <FlatList
        key={category} // ⭐ BẮT BUỘC để tránh lỗi numColumns
        data={data}
        numColumns={2}
        columnWrapperStyle={styles.column}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ===== HEADER ===== */

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  /* ===== CATEGORY BAR ===== */

  categoryBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },

  categoryBtn: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  categoryActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  /* ===== LIST ===== */

  list: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },

  column: {
    justifyContent: "space-between",
  },

  /* ===== CARD ===== */

  cardWrapper: {
  width: "48%",
  marginBottom: 18,
},

card: {
  backgroundColor: "#fff",
  borderRadius: 22,
  overflow: "hidden", // ⭐ RẤT QUAN TRỌNG
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
},

/* ===== IMAGE ===== */

imageContainer: {
  height: 120,                 // ⭐ chiếm nửa trên
  backgroundColor: "#f3f3f3",
  justifyContent: "center",
  alignItems: "center",
},

image: {
  width: "85%",
  height: "85%",
  resizeMode: "contain",
},

/* ===== CONTENT ===== */

content: {
  padding: 14,
},

title: {
  fontSize: 14,
  fontWeight: "700",
  color: "#111",
},

subTitle: {
  marginTop: 2,
  fontSize: 12,
  color: "#9e9e9e",
},

bottomRow: {
  marginTop: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

price: {
  fontSize: 16,
  fontWeight: "800",
  color: "#111",
},

addBtn: {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: "#FF8C00",
  justifyContent: "center",
  alignItems: "center",
},
});
