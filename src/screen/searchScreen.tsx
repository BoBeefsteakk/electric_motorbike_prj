import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import FilterModal from '../../components/ui/filtermodal';
import { carApi } from '../services/api/car.api';
import { motorbikeApi } from '../services/api/motorbikes.api';

// Giá trị mặc định cho bộ lọc
const DEFAULT_FILTERS = {
  type: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  minRating: 0,
  status: undefined,
};

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  // --- STATE QUẢN LÝ ---
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState(DEFAULT_FILTERS);

  // State cho dữ liệu mặc định và phân trang
  const [defaultData, setDefaultData] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  // Kiểm tra xem người dùng có đang áp dụng bộ lọc nào không
  const isFiltering = () => {
    return (
      currentFilters.type !== 'all' ||
      currentFilters.minPrice !== undefined ||
      currentFilters.maxPrice !== undefined ||
      currentFilters.status !== undefined
    );
  };

  // --- XỬ LÝ SỰ KIỆN ---
  
  // Khi người dùng gõ phím
  const handleTextChange = (text: string) => {
    setSearchText(text);
    if (isFiltering()) {
       setCurrentFilters(DEFAULT_FILTERS);
    }
  };

  // Khi người dùng bấm "Áp dụng" từ Filter Modal
  const handleApplyFilter = (filters: any) => {
    setCurrentFilters(filters);
  };

  // --- CORE LOGIC TÌM KIẾM & LỌC ---
  const fetchSearchResults = async (keyword: string, filters: any) => {
    if (!keyword.trim() && !isFiltering()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const params: any = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.status !== undefined && filters.status !== 'all') {
          params.status = filters.status;
      }
      if (filters.minRating) params.rating = filters.minRating;

      let dataFromApi: any[] = [];
      
      if (filters.type === 'car') {
        const res = await carApi.getList(params);
        dataFromApi = (res.data?.data || []).map((item: any) => ({...item, isCar: true}));
      } else if (filters.type === 'motorbike') {
        const res = await motorbikeApi.getList(params);
        dataFromApi = (res.data?.data || []).map((item: any) => ({...item, isCar: false}));
      } else {
        const [carRes, motoRes] = await Promise.all([
          carApi.getList(params).catch(() => ({ data: { data: [] } })),
          motorbikeApi.getList(params).catch(() => ({ data: { data: [] } }))
        ]);
        const cars = (carRes.data?.data || []).map((c: any) => ({ ...c, isCar: true }));
        const motos = (motoRes.data?.data || []).map((m: any) => ({ ...m, isCar: false }));
        dataFromApi = [...cars, ...motos];
      }
      
      let finalResults = dataFromApi;

      if (keyword.trim()) {
        const searchKey = keyword.trim().toLowerCase();
        finalResults = dataFromApi.filter(item => {
             const name = item.name ? item.name.toLowerCase() : '';
             return name.includes(searchKey); 
        });
      }
      
      setResults(finalResults);

    } catch (error) {
      console.error("Search Error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dữ liệu mặc định từ API khi chưa tìm kiếm
  useEffect(() => {
    const fetchDefault = async () => {
      try {
        // Gọi cả 2 API song song
        const [carRes, motoRes] = await Promise.all([
          carApi.getList({}).catch(() => ({ data: { data: [] } })),
          motorbikeApi.getList({}).catch(() => ({ data: { data: [] } }))
        ]);
        const cars = (carRes.data?.data || []).map((c: any) => ({ ...c, isCar: true }));
        const motos = (motoRes.data?.data || []).map((m: any) => ({ ...m, isCar: false }));
        const all = [...cars, ...motos];
        setDefaultData(all);
        setCurrentData(all.slice(0, PAGE_SIZE));
        setPage(1);
        setHasMore(all.length > PAGE_SIZE);
      } catch (e) {
        setDefaultData([]);
        setCurrentData([]);
        setHasMore(false);
      }
    };
    if (searchText.trim().length === 0 && !isFiltering()) {
      fetchDefault();
    }
  }, [searchText, currentFilters]);

  // Debounce: Chỉ gọi tìm kiếm sau khi ngừng gõ 0.5s để tránh spam API
  useEffect(() => {
    const timer = setTimeout(() => {
        if (searchText.trim().length > 0 || isFiltering()) {
            fetchSearchResults(searchText, currentFilters);
        } else {
            setResults([]);
        }
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchText, currentFilters]); 

  // Reset khi searchText thay đổi
  useEffect(() => {
    if (searchText.trim().length === 0 && !isFiltering()) {
      setCurrentData(defaultData.slice(0, 10));
      setPage(1);
      setHasMore(defaultData.length > 10);
    }
  }, [searchText, currentFilters]);

  // Lưu lịch sử tìm kiếm khi ấn Enter/Submit trên bàn phím
  const handleSearchSubmit = () => {
    if (searchText.trim().length > 0) {
      const trimmedText = searchText.trim();
      setHistory(prev => {
        const newHistory = [trimmedText, ...prev.filter(h => h !== trimmedText)];
        return newHistory.slice(0, 10);
      });
      Keyboard.dismiss();
    }
  };

  // Chọn từ khóa từ lịch sử -> Tìm kiếm & Reset Filter
  const handleHistorySelect = (text: string) => {
    setSearchText(text); 
    setCurrentFilters(DEFAULT_FILTERS);
  };

  const clearHistory = () => setHistory([]);

  // Xóa từng item trong lịch sử
  const removeHistoryItem = (itemToRemove: string) => {
    setHistory(prev => prev.filter(item => item !== itemToRemove));
  };

  // Khi không tìm kiếm thì load thêm dữ liệu mặc định khi scroll
  const loadMoreDefaultData = () => {
    if (!hasMore || searchText.trim().length > 0 || isFiltering()) return;
    const nextPage = page + 1;
    const nextData = defaultData.slice(0, nextPage * PAGE_SIZE);
    setCurrentData(nextData);
    setPage(nextPage);
    setHasMore(nextData.length < defaultData.length);
  };

  // Render từng item xe
  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemContainer}
       onPress={() => navigation.navigate('DetailScreen',{ item: item})}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemPrice}>
            {item.price ? item.price.toLocaleString('vi-VN') : 0} đ
        </Text>
        <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: '#F0F0F0' }]}>
                <Text style={styles.badgeText}>
                    {item.category?.name || (item.isCar ? "Ô tô" : "Xe máy")}
                </Text>
            </View>
            {item.status !== undefined && (
                 <View style={[
                   styles.badge, 
                   { 
                     backgroundColor: item.status === 1 ? '#E3F2FD' : '#FFEBEE', 
                     marginLeft: 8 
                   }
                 ]}>
                    <Text style={[
                      styles.badgeText, 
                      { color: item.status === 1 ? '#1976D2' : '#D32F2F' }
                    ]}>
                        {item.status === 1 ? "Xe Mới" : "Xe Cũ"}
                    </Text>
                </View>
            )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Xác định trạng thái hiển thị
  const showResults = results.length > 0;
  const showDefault = !showResults && !isLoading && !searchText && !isFiltering();
  const showHistory = !showResults && !isLoading && !searchText && !isFiltering() && !showDefault;
  const showEmpty = !showResults && !isLoading && (searchText || isFiltering());

  return (
    <View style={styles.container}>
      {/* --- HEADER TÌM KIẾM --- */}
      <View style={styles.headerWrapper}>
        <View style={styles.unifiedSearchBar}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
            <TextInput 
                placeholder="Tìm tên xe..." 
                style={styles.searchInput}
                value={searchText}
                onChangeText={handleTextChange} 
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={() => handleTextChange('')}>
                    <Ionicons name="close-circle" size={18} color="#ccc" />
                </TouchableOpacity>
            )}
            <View style={styles.verticalDivider} />
            <TouchableOpacity 
                style={styles.filterBtn}
                onPress={() => setFilterVisible(true)}
            >
                <Ionicons 
                    name="options-outline" 
                    size={22} 
                    color={isFiltering() ? "#007BFF" : "#333"} 
                />
            </TouchableOpacity>
        </View>
      </View>

      {/* --- BODY CONTENT --- */}
      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
          {/* 1. Dữ liệu mặc định khi chưa tìm kiếm */}
          {showDefault && (
            <FlatList
              data={currentData}
              keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
              renderItem={renderProductItem}
              contentContainerStyle={styles.listContent}
              onEndReached={loadMoreDefaultData}
              onEndReachedThreshold={0.2}
              ListFooterComponent={hasMore ? <ActivityIndicator size="small" color="#888" /> : null}
            />
          )}

          {/* 2. Lịch sử tìm kiếm */}
          {showHistory && (
             <View style={styles.historyContainer}>
                {history.length > 0 ? (
                  <>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
                      <TouchableOpacity onPress={clearHistory}>
                        <Text style={styles.clearHistoryText}>Xóa tất cả</Text>
                      </TouchableOpacity>
                    </View>
                    {history.map((item, index) => (
                      <View key={index} style={styles.historyItem}>
                        <TouchableOpacity 
                          style={styles.historyItemContent}
                          onPress={() => handleHistorySelect(item)}
                        >
                          <Ionicons name="time-outline" size={20} color="#888" style={{marginRight: 10}} />
                          <Text style={styles.historyText}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteHistoryBtn}
                          onPress={() => removeHistoryItem(item)}
                        >
                          <Ionicons name="close" size={20} color="#999" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
                ) : (
                   <View style={styles.centerContent}>
                      <Ionicons name="search-outline" size={48} color="#ddd" />
                      <Text style={styles.emptyText}>Nhập tên xe để tìm kiếm</Text>
                   </View>
                )}
             </View>
          )}

          {/* 3. Danh sách kết quả */}
          {showResults && (
            <FlatList
                data={results}
                keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
                renderItem={renderProductItem}
                contentContainerStyle={styles.listContent}
            />
          )}

          {/* 4. Không tìm thấy */}
          {showEmpty && (
             <View style={styles.centerContent}>
                <Text style={styles.emptyText}>Không tìm thấy kết quả nào.</Text>
             </View>
          )}
        </>
      )}

      {/* --- MODAL BỘ LỌC --- */}
      <FilterModal 
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilter}
        currentValues={currentFilters}
      />
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 50,
  },
  
  // --- Header Styles ---
  headerWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  unifiedSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingRight: 10,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  filterBtn: {
    padding: 4,
  },

  // --- Content Styles ---
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  centerContent: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },

  // --- Item (Card) Styles ---
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#009900',
    marginBottom: 6,
  },
  
  // --- Badge Styles ---
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // --- History Styles ---
  historyContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#FF3B30',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  historyText: {
    fontSize: 16,
    color: '#444',
  },
  deleteHistoryBtn: {
    padding: 10,
  },
});