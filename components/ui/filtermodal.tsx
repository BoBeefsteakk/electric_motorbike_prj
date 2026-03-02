import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

// --- INTERFACE ---
// Định nghĩa kiểu dữ liệu cho Props để code rõ ràng và an toàn hơn
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  // Nhận giá trị hiện tại từ màn hình cha (SearchScreen)
  // Giúp Modal hiển thị đúng trạng thái đang lọc (hoặc đã reset)
  currentValues: {
    type: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  };
}

const FilterModal = ({ isVisible, onClose, onApply, currentValues }: FilterModalProps) => {
  // --- STATE NỘI BỘ (LOCAL STATE) ---
  // Dùng để lưu tạm các thay đổi khi người dùng đang thao tác trong Modal
  // Chỉ khi bấm "Áp dụng" mới gửi ra ngoài.
  const [type, setType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [status, setStatus] = useState<string>('all');

  // --- ĐỒNG BỘ DỮ LIỆU (SYNC DATA) ---
  // Logic: Khi Modal mở ra (isVisible = true) HOẶC khi bộ lọc bên ngoài thay đổi (currentValues thay đổi)
  // -> Cập nhật lại State nội bộ cho khớp với bên ngoài.
  // Ví dụ: Bên ngoài reset về Default -> Modal cũng phải reset về Default.
  useEffect(() => {
    if (isVisible || currentValues) {
      setType(currentValues.type || 'all');
      // Chuyển đổi number sang string để hiển thị trong TextInput
      setMinPrice(currentValues.minPrice ? currentValues.minPrice.toString() : '');
      setMaxPrice(currentValues.maxPrice ? currentValues.maxPrice.toString() : '');
      setStatus(currentValues.status || 'all');
    }
  }, [isVisible, currentValues]);

  // --- XỬ LÝ SỰ KIỆN ---

  // Khi bấm nút "Áp dụng"
  const handleApply = () => {
    const filters = {
      type: type,
      // Chuyển lại string sang number khi gửi đi
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      status: status === 'all' ? undefined : status,
    };
    onApply(filters);
    onClose();
  };

  // Khi bấm nút "Đặt lại"
  const handleReset = () => {
    setType('all');
    setMinPrice('');
    setMaxPrice('');
    setStatus('all');
    // Lưu ý: Nút này chỉ reset giao diện trong Modal, người dùng vẫn phải bấm "Áp dụng" để thực thi
  };

  // Helper chọn nhanh giá
  const handleQuickPrice = (min: string, max: string) => {
      setMinPrice(min);
      setMaxPrice(max);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet" // Hiệu ứng dạng card trên iOS
      onRequestClose={onClose}
    >
      {/* TouchableWithoutFeedback để bấm ra ngoài input sẽ ẩn bàn phím */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* 1. HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bộ lọc tìm kiếm</Text>
            {/* Nút đóng (chỉ hiện icon rõ ràng trên Android, iOS có thể vuốt xuống) */}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
               <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
            
            {/* 2. LOẠI PHƯƠNG TIỆN (Segment Control Style) */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Loại phương tiện</Text>
                <View style={styles.segmentContainer}>
                {['all', 'car', 'motorbike'].map((item) => (
                    <TouchableOpacity 
                        key={item}
                        style={[styles.segmentBtn, type === item && styles.segmentBtnActive]}
                        onPress={() => setType(item)}
                    >
                        <Text style={[styles.segmentText, type === item && styles.segmentTextActive]}>
                            {item === 'all' ? 'Tất cả' : item === 'car' ? 'Ô tô' : 'Xe máy'}
                        </Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>

            <View style={styles.divider} />

            {/* 3. KHOẢNG GIÁ */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Khoảng giá (VNĐ)</Text>
                <View style={styles.priceRow}>
                    <View style={styles.priceInputWrapper}>
                        <TextInput
                        style={styles.priceInput}
                        placeholder="Thấp nhất"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={minPrice}
                        onChangeText={setMinPrice}
                        />
                    </View>
                    <Text style={styles.dash}>-</Text>
                    <View style={styles.priceInputWrapper}>
                        <TextInput
                        style={styles.priceInput}
                        placeholder="Cao nhất"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                        />
                    </View>
                </View>
                
                {/* Chip chọn nhanh giá */}
                <View style={styles.chipRow}>
                    <TouchableOpacity onPress={() => handleQuickPrice('0', '50000000')} style={styles.chipItem}>
                        <Text style={styles.chipText}>&lt; 50tr</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleQuickPrice('100000000', '800000000')} style={styles.chipItem}>
                        <Text style={styles.chipText}>100-800tr</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            {/* 4. TÌNH TRẠNG */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Tình trạng xe</Text>
                <View style={styles.segmentContainer}>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, status === 'all' && styles.segmentBtnActive]}
                        onPress={() => setStatus('all')}
                    >
                        <Text style={[styles.segmentText, status === 'all' && styles.segmentTextActive]}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, status === '1' && styles.segmentBtnActive]}
                        onPress={() => setStatus('1')}
                    >
                        <Text style={[styles.segmentText, status === '1' && styles.segmentTextActive]}>Xe Mới</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.segmentBtn, status === '2' && styles.segmentBtnActive]}
                        onPress={() => setStatus('2')}
                    >
                        <Text style={[styles.segmentText, status === '2' && styles.segmentTextActive]}>Xe Cũ</Text>
                    </TouchableOpacity>
                </View>
            </View>

          </ScrollView>

          {/* 5. FOOTER BUTTONS */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  
  // --- Header ---
  header: { 
    flexDirection: 'row', 
    justifyContent: 'center', // Canh giữa title
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700',
    color: '#111'
  },
  closeBtn: {
      position: 'absolute',
      right: 20,
      padding: 5,
  },

  // --- Content Layout ---
  content: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionContainer: {
      marginTop: 15,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12, 
    color: '#333' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F5F5F5', 
    marginVertical: 20 
  },

  // --- Segment Buttons (Loại xe / Tình trạng) ---
  segmentContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F7F7F7', 
    padding: 4, 
    borderRadius: 12 
  },
  segmentBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 10 
  },
  segmentBtnActive: { 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 3, 
    shadowOffset: { width: 0, height: 1 },
    elevation: 2 
  },
  segmentText: { 
    fontSize: 14, 
    color: '#888', 
    fontWeight: '500' 
  },
  segmentTextActive: { 
    color: '#000', 
    fontWeight: '700' 
  },

  // --- Price Inputs ---
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  priceInputWrapper: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    height: 48,
    backgroundColor: '#FFF'
  },
  priceInput: { 
    flex: 1, 
    fontSize: 15,
    color: '#333'
  },
  dash: { 
    marginHorizontal: 10, 
    color: '#BBB',
    fontWeight: 'bold'
  },
  
  // --- Chips (Giá nhanh) ---
  chipRow: { 
    flexDirection: 'row', 
    gap: 10,
    flexWrap: 'wrap'
  },
  chipItem: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA'
  },
  chipText: { 
    fontSize: 13, 
    color: '#555',
    fontWeight: '500'
  },

  // --- Footer ---
  footer: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingTop: 15,
    borderTopWidth: 1, 
    borderTopColor: '#F0F0F0',
    // Xử lý Safe Area cho các dòng iPhone đời mới
    paddingBottom: Platform.OS === 'ios' ? 40 : 20 
  },
  resetBtn: { 
    flex: 1, 
    padding: 15, 
    alignItems: 'center', 
    marginRight: 10,
    borderRadius: 12,
  },
  resetBtnText: { 
    fontSize: 16, 
    color: '#666', 
    fontWeight: '600' 
  },
  applyBtn: { 
    flex: 2, 
    backgroundColor: '#000', 
    padding: 15, 
    alignItems: 'center', 
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2}
  },
  applyBtnText: { 
    fontSize: 16, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});

export default FilterModal;