import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Nhớ đường dẫn hook reset của bạn
import { useResetOnLeave } from "../../../hooks/use-clean-search";

/* ===== DỮ LIỆU GIẢ ===== */
const PRODUCTS = [
  { id: "1", name: "VinFast Feliz S", price: 29900000, priceStr: "29.900.000đ", rating: 4.8, brand: "VinFast", condition: "Mới", image: "https://vinfastauto.com/themes/custom/vinfast/images/feliz.png" },
  { id: "2", name: "VinFast Klara S", price: 39900000, priceStr: "39.900.000đ", rating: 4.7, brand: "VinFast", condition: "Cũ", image: "https://vinfastauto.com/themes/custom/vinfast/images/klara.png" },
  { id: "3", name: "DatBike Weaver++", price: 65000000, priceStr: "65.000.000đ", rating: 4.6, brand: "DatBike", condition: "Mới", image: "https://datbike.vn/wp-content/uploads/2023/07/weaver.png" },
  { id: "4", name: "Yadea Odora", price: 18000000, priceStr: "18.000.000đ", rating: 4.5, brand: "Yadea", condition: "Cũ", image: "https://img.websosanh.vn/v2/users/review/images/xe-may-dien-yadea-odora-s1/s4r3w8j5x8j5x.jpg" },
  { id: "5", name: "Pega New Tech", price: 25000000, priceStr: "25.000.000đ", rating: 4.2, brand: "Pega", condition: "Mới", image: "https://pega.com.vn/uploads/product/2020/01/11/5e19485202688-mau-trang.png" },
];

const HOT_KEYWORDS = ["VinFast", "DatBike", "Yadea", "Xe 50cc", "Pin LFP"];
const BRANDS = ["Tất cả", "VinFast", "DatBike", "Yadea", "Pega"];
const CONDITIONS = ["Tất cả", "Mới", "Cũ"];
const PRICES = ["Tất cả", "< 20 triệu", "20 - 40 triệu", "> 40 triệu"];
const RATINGS = ["Tất cả", "5 sao", "4 sao", "3 sao"];

const DEFAULT_FILTERS = {
  brand: "Tất cả",
  condition: "Tất cả",
  price: "Tất cả",
  rating: "Tất cả"
};

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // False: Hiện Lịch sử/Gợi ý | True: Hiện Kết quả
  const [isResultMode, setIsResultMode] = useState(false);

  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [tempFilters, setTempFilters] = useState({ ...DEFAULT_FILTERS });

  // Hàm reset về mặc định (dùng cho cả nút Back và khi thoát trang)
  const resetAllData = useCallback(() => {
    setKeyword("");
    setFilters({ ...DEFAULT_FILTERS });
    setTempFilters({ ...DEFAULT_FILTERS });
    setIsResultMode(false);
    setModalVisible(false);
    Keyboard.dismiss(); // Ẩn bàn phím nếu đang hiện
  }, []);

  // Hook tự động reset khi thoát trang
  useResetOnLeave(resetAllData);

  const handleOpenModal = () => {
    setTempFilters({ ...filters }); 
    setModalVisible(true);
  };

  const getFilteredProducts = () => {
    return PRODUCTS.filter((item) => {
      const matchKeyword = keyword === "" || item.name.toLowerCase().includes(keyword.toLowerCase());
      
      const matchBrand = filters.brand === "Tất cả" || item.brand === filters.brand;
      const matchCondition = filters.condition === "Tất cả" || item.condition === filters.condition;
      
      let matchPrice = true;
      if (filters.price === "< 20 triệu") matchPrice = item.price < 20000000;
      if (filters.price === "20 - 40 triệu") matchPrice = item.price >= 20000000 && item.price <= 40000000;
      if (filters.price === "> 40 triệu") matchPrice = item.price > 40000000;

      let matchRating = true;
      if (filters.rating === "5 sao") matchRating = item.rating >= 5;
      if (filters.rating === "4 sao") matchRating = item.rating >= 4;
      if (filters.rating === "3 sao") matchRating = item.rating >= 3;

      return matchKeyword && matchBrand && matchCondition && matchPrice && matchRating;
    });
  };

  const filteredProducts = getFilteredProducts();

  const saveToHistory = (text: string) => {
    const value = text.trim();
    if (value === "") return;
    setHistory((prev) => {
      const newList = prev.filter((item) => item !== value);
      return [value, ...newList].slice(0, 10);
    });
  };

  const handleSearch = (text: string) => {
    setKeyword(text);
    if (text.trim() !== "") {
        setIsResultMode(true);
        saveToHistory(text);
    } else {
        const isFiltering = filters.brand !== "Tất cả" || filters.condition !== "Tất cả" || filters.price !== "Tất cả" || filters.rating !== "Tất cả";
        if (!isFiltering) setIsResultMode(false);
    }
  };

  const handleClearText = () => {
    setKeyword("");
    // Chỉ xóa text, giữ nguyên bộ lọc (nếu có)
    const isFiltering = filters.brand !== "Tất cả" || filters.condition !== "Tất cả" || filters.price !== "Tất cả" || filters.rating !== "Tất cả";
    if (!isFiltering) setIsResultMode(false);
  };

  const handleApplyFilter = () => {
    setFilters({ ...tempFilters });
    setIsResultMode(true);
    setModalVisible(false);
  };

  const handleResetFilterInModal = () => {
    setTempFilters({ ...DEFAULT_FILTERS });
  };

  const isFiltering = filters.brand !== "Tất cả" || filters.condition !== "Tất cả" || filters.price !== "Tất cả" || filters.rating !== "Tất cả";
  const displayHistory = showAllHistory ? history : history.slice(0, 5);

  const FilterChip = ({ label, selected, onPress }: any) => (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ===== SEARCH BAR ===== */}
      <View style={styles.searchBar}>
        
        {/* LOGIC ICON BACK/SEARCH */}
        {isResultMode ? (
          // Nếu đang xem kết quả -> Hiện nút Back để quay về trang đầu
          <Pressable onPress={resetAllData} style={{ marginRight: 8, padding: 4 }}>
             <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
        ) : (
          // Nếu đang ở trang đầu -> Hiện icon kính lúp
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8, marginLeft: 4 }} />
        )}

        <TextInput
          placeholder="Tìm xe máy điện..."
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
          onSubmitEditing={() => handleSearch(keyword)}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        
        {keyword !== "" && (
          <Pressable onPress={handleClearText} style={{marginRight: 5}}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </Pressable>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.divider} /> 
            <Pressable onPress={handleOpenModal} style={{ position: 'relative' }}>
              <Ionicons name="options" size={24} color={isFiltering ? "#000" : "#333"} />
              {isFiltering && <View style={styles.badge} />}
            </Pressable>
        </View>
      </View>

      {/* ===== MÀN HÌNH CHỜ (Lịch sử & Gợi ý) ===== */}
      {!isResultMode && (
        <ScrollView keyboardShouldPersistTaps="handled">
          {history.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                <Pressable onPress={() => { setHistory([]); setShowAllHistory(false); }}>
                  <Text style={styles.clearAll}>Xóa tất cả</Text>
                </Pressable>
              </View>
              {displayHistory.map((item, index) => (
                <View key={index} style={styles.historyRow}>
                  <Pressable style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => handleSearch(item)}>
                    <Ionicons name="time-outline" size={18} color="#666" style={{marginRight: 10}} />
                    <Text style={styles.historyText}>{item}</Text>
                  </Pressable>
                  <Pressable onPress={() => setHistory(prev => prev.filter(h => h !== item))}>
                    <Ionicons name="close" size={18} color="#bbb" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.sectionContainer, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Gợi ý phổ biến</Text>
            <View style={styles.tagsContainer}>
              {HOT_KEYWORDS.map((tag) => (
                <Pressable key={tag} style={styles.tag} onPress={() => handleSearch(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* ===== MÀN HÌNH KẾT QUẢ ===== */}
      {isResultMode && (
        <View style={{ flex: 1 }}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {keyword ? `Kết quả cho "${keyword}"` : "Kết quả lọc"}
            </Text>
            <Text style={styles.resultCount}>{filteredProducts.length} tìm thấy</Text>
          </View>

          {isFiltering && (
            <View style={styles.activeFilters}>
               <Text style={{fontSize: 12, color: '#666', marginRight: 5}}>Đang lọc:</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {filters.brand !== "Tất cả" && <Text style={styles.filterTag}>{filters.brand}</Text>}
                  {filters.condition !== "Tất cả" && <Text style={styles.filterTag}>{filters.condition}</Text>}
                  {filters.price !== "Tất cả" && <Text style={styles.filterTag}>{filters.price}</Text>}
                  {filters.rating !== "Tất cả" && <Text style={styles.filterTag}>{filters.rating}</Text>}
               </ScrollView>
            </View>
          )}

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => { saveToHistory(item.name); Alert.alert("Chọn", item.name); }}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{item.priceStr}</Text>
                  <View style={{flexDirection: 'row', gap: 10, marginTop: 4}}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                    <Text style={styles.conditionTag}>{item.condition}</Text>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy sản phẩm phù hợp</Text>}
          />
        </View>
      )}

      {/* ===== MODAL ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ Lọc</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={26} color="#333" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.filterLabel}>Hãng xe</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {BRANDS.map((brand) => (
                  <FilterChip key={brand} label={brand} selected={tempFilters.brand === brand} onPress={() => setTempFilters({...tempFilters, brand: brand})} />
                ))}
              </ScrollView>

              <Text style={styles.filterLabel}>Tình trạng xe</Text>
              <View style={styles.wrapContainer}>
                {CONDITIONS.map((cond) => (
                  <FilterChip key={cond} label={cond} selected={tempFilters.condition === cond} onPress={() => setTempFilters({...tempFilters, condition: cond})} />
                ))}
              </View>

              <Text style={styles.filterLabel}>Khoảng giá</Text>
              <View style={styles.wrapContainer}>
                {PRICES.map((p) => (
                  <FilterChip key={p} label={p} selected={tempFilters.price === p} onPress={() => setTempFilters({...tempFilters, price: p})} />
                ))}
              </View>

              <Text style={styles.filterLabel}>Đánh giá</Text>
              <View style={styles.wrapContainer}>
                {RATINGS.map((r) => (
                  <FilterChip key={r} label={r} selected={tempFilters.rating === r} onPress={() => setTempFilters({...tempFilters, rating: r})} />
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable style={styles.btnReset} onPress={handleResetFilterInModal}>
                <Text style={styles.btnResetText}>Làm mới</Text>
              </Pressable>
              <Pressable style={styles.btnApply} onPress={handleApplyFilter}>
                <Text style={styles.btnApplyText}>Áp dụng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", margin: 16, borderRadius: 8, paddingHorizontal: 12, height: 46 },
  searchInput: { flex: 1, height: "100%", fontSize: 15 },
  divider: { width: 1, height: 24, backgroundColor: '#ddd', marginHorizontal: 10 },
  badge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', borderWidth: 1, borderColor: '#fff' },

  sectionContainer: { paddingHorizontal: 16, marginBottom: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#333", marginBottom: 12 },
  clearAll: { color: "#ee4d2d", fontSize: 13, marginBottom: 12 },
  historyRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#f0f0f0" },
  historyText: { fontSize: 15, color: "#333" },
  
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#f5f5f5", borderRadius: 20, borderWidth: 1, borderColor: "#e0e0e0" },
  tagText: { color: "#333", fontSize: 14 },
  
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0', backgroundColor: '#fff' },
  resultTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1 },
  resultCount: { fontSize: 14, color: '#ee4d2d', fontWeight: '600' },
  
  activeFilters: {flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 10, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee'},
  filterTag: { fontSize: 12, backgroundColor: '#eef', color: '#007AFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 6, overflow: 'hidden' },

  card: { flexDirection: "row", padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  image: { width: 90, height: 90, marginRight: 12, resizeMode: 'contain' },
  name: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
  price: { color: "#ee4d2d", fontWeight: "bold", fontSize: 15 },
  rating: { color: "#777", fontSize: 13 },
  conditionTag: { fontSize: 12, backgroundColor: '#eee', paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', color: '#555' },
  empty: { textAlign: "center", marginTop: 40, color: "#999", fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "85%" },
  dragHandle: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2, alignSelf: "center", marginBottom: 10 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  filterLabel: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 12, color: "#333" },
  horizontalScroll: { flexDirection: "row", marginBottom: 5 },
  wrapContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#fff", marginRight: 10, marginBottom: 10 },
  chipSelected: { backgroundColor: "#000", borderColor: "#000" },
  chipText: { fontSize: 14, color: "#333", fontWeight: "500" },
  chipTextSelected: { color: "#fff" },

  modalFooter: { flexDirection: "row", marginTop: 20, gap: 15 },
  btnReset: { flex: 1, paddingVertical: 14, borderRadius: 30, backgroundColor: "#f2f2f2", alignItems: "center" },
  btnResetText: { fontSize: 16, fontWeight: "600", color: "#666" },
  btnApply: { flex: 1, paddingVertical: 14, borderRadius: 30, backgroundColor: "#000", alignItems: "center" },
  btnApplyText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});