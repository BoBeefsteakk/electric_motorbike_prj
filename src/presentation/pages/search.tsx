import { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ===== DATABASE GIẢ ===== */
const PRODUCTS = [
  {
    id: "1",
    name: "Xe máy điện VinFast Feliz",
    price: "29.900.000đ",
    rating: 4.8,
    image:
      "https://vinfastauto.com/themes/custom/vinfast/images/feliz.png",
  },
  {
    id: "2",
    name: "Xe máy điện VinFast Klara",
    price: "39.900.000đ",
    rating: 4.7,
    image:
      "https://vinfastauto.com/themes/custom/vinfast/images/klara.png",
  },
  {
    id: "3",
    name: "Xe máy điện DatBike Weaver",
    price: "42.000.000đ",
    rating: 4.6,
    image:
      "https://datbike.vn/wp-content/uploads/2023/07/weaver.png",
  },
];

const HOT_KEYWORDS = ["VinFast", "DatBike", "Yadea", "Xe 50cc", "Xe pin LFP"];

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);

  /* ===== HÀM CHUNG: LƯU VÀO LỊCH SỬ ===== */
  const saveToHistory = (text: string) => {
    const value = text.trim();
    if (value === "") return;

    setHistory((prev) => {
      // Xóa trùng lặp cũ rồi thêm mới vào đầu
      const newList = prev.filter((item) => item !== value);
      return [value, ...newList].slice(0, 10);
    });
  };

  /* ===== SEARCH (KHI GÕ VÀ ENTER) ===== */
  const handleSearch = (text: string) => {
    setKeyword(text);
    saveToHistory(text);
  };

  /* ===== BẤM VÀO SẢN PHẨM (MỚI THÊM) ===== */
  const handleSelectProduct = (productName: string) => {

    saveToHistory(productName);
    /* ===== Khi nào thêm database sẽ làm thêm ===== */
    setKeyword(""); 
  };

  /* ===== DELETE ONE HISTORY ===== */
  const removeHistoryItem = (item: string) => {
    setHistory((prev) => prev.filter((h) => h !== item));
  };

  /* ===== DELETE ALL ===== */
  const clearAllHistory = () => {
    setHistory([]);
    setShowAllHistory(false);
  };

  /* ===== FILTER ===== */
  const filteredProducts = PRODUCTS.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const displayHistory = showAllHistory ? history : history.slice(0, 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ===== SEARCH BAR ===== */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Tìm xe máy điện..."
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={() => handleSearch(keyword)}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {keyword !== "" && (
          <Pressable onPress={() => setKeyword("")}>
            <Text style={styles.clear}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* ===== MÀN HÌNH CHỜ (LỊCH SỬ + GỢI Ý) ===== */}
      {keyword === "" && (
        <ScrollView keyboardShouldPersistTaps="handled">
          
          {/* 1. LỊCH SỬ TÌM KIẾM */}
          {history.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                <Pressable onPress={clearAllHistory}>
                  <Text style={styles.clearAll}>Xóa tất cả</Text>
                </Pressable>
              </View>

              {displayHistory.map((item, index) => (
                <View key={index} style={styles.historyRow}>
                  <Pressable
                    style={{ flexDirection: "row", flex: 1, alignItems: 'center' }}
                    onPress={() => setKeyword(item)}
                  >
                    <Text style={styles.clock}>🕘</Text>
                    <Text style={styles.historyText}>{item}</Text>
                  </Pressable>

                  <Pressable onPress={() => removeHistoryItem(item)} style={{padding: 5}}>
                    <Text style={styles.delete}>✕</Text>
                  </Pressable>
                </View>
              ))}

              {history.length > 5 && (
                <Pressable
                  onPress={() => setShowAllHistory(!showAllHistory)}
                >
                  <Text style={styles.viewMore}>
                    {showAllHistory ? "Thu gọn" : "Xem tất cả"}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* 2. GỢI Ý (HOT KEYWORDS) */}
          <View style={[styles.sectionContainer, { marginTop: history.length > 0 ? 20 : 0 }]}>
            <Text style={styles.sectionTitle}>Gợi ý phổ biến</Text>
            
            <View style={styles.tagsContainer}>
              {HOT_KEYWORDS.map((tag) => (
                <Pressable
                  key={tag}
                  style={styles.tag}
                  onPress={() => handleSearch(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>

        </ScrollView>
      )}

      {/* ===== KẾT QUẢ TÌM KIẾM ===== */}
      {keyword !== "" && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // Bọc Card trong Pressable để bắt sự kiện click
            <Pressable 
              style={styles.card} 
              onPress={() => handleSelectProduct(item.name)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.name}>
                  {item.name}
                </Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Không tìm thấy sản phẩm</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

/* ===== STYLE (GIỮ NGUYÊN NHƯ CŨ) ===== */
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, height: "100%", fontSize: 15 },
  clear: { fontSize: 18, color: '#999', padding: 4 },

  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  clearAll: {
    color: "#ee4d2d",
    fontSize: 13,
    marginBottom: 12,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  clock: { marginRight: 10, fontSize: 16 },
  historyText: { fontSize: 15, color: "#333" },
  delete: { fontSize: 14, color: "#bbb" },

  viewMore: {
    textAlign: "center",
    padding: 12,
    color: "#0a7ea4",
    fontSize: 14,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tagText: {
    color: "#333",
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  image: { width: 90, height: 90, marginRight: 12, resizeMode: 'contain' },
  name: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
  price: { color: "#ee4d2d", fontWeight: "bold", fontSize: 15 },
  rating: { color: "#777", fontSize: 13, marginTop: 4 },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },
});