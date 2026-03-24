import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Định nghĩa kiểu dữ liệu cho từng mục Menu */
interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  rightElement?: React.ReactNode;
  isLogout?: boolean;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [avatarUri, setAvatarUri] = useState(
    'https://i.pinimg.com/736x/21/6b/03/216b036577589d7010a30b696f839634.jpg'
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Cần quyền truy cập ảnh!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const MenuItem = ({ icon, label, rightElement, isLogout, onPress }: MenuItemProps) => (
    <Pressable 
      style={({ pressed }) => [
        styles.menuItem,
        pressed && { backgroundColor: '#F5F5F5', borderRadius: 12 }
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconWrapper, isLogout && styles.logoutIconBg]}>
          <Ionicons
            name={icon}
            size={22}
            color={isLogout ? '#F75555' : '#212121'}
          />
        </View>
        <Text style={[styles.menuLabel, isLogout && styles.logoutLabel]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.menuRight}>
        {rightElement ? rightElement : (
          !isLogout && <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <Pressable>
            <Ionicons name="settings-outline" size={24} color="black" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <Pressable style={styles.editAvatarBtn} onPress={pickImage}>
              <Ionicons name="camera" size={16} color="white" />
            </Pressable>
          </View>
          <Text style={styles.userName}>Văn Thanh</Text>
          <Text style={styles.userPhone}>thanhvan@example.com</Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quản lý giao dịch</Text>
          <MenuItem 
            icon="receipt-outline" 
            label="Đơn hàng của tôi" 
            onPress={() => navigation.navigate('Order')} 
          />
          
          {/* === MỤC BẢO HÀNH MỚI THÊM === */}
          <MenuItem 
            icon="shield-checkmark-outline" 
            label="Thông tin bảo hành" 
            onPress={() => navigation.navigate('Warranty')} 
          />
          {/* ============================= */}

          <MenuItem icon="wallet-outline" label="Phương thức thanh toán" />

          <Text style={styles.sectionTitle}>Cài đặt hệ thống</Text>
          <MenuItem icon="person-outline" label="Chỉnh sửa hồ sơ" />
          <MenuItem icon="location-outline" label="Địa chỉ nhận hàng" />
          <MenuItem 
            icon="contrast-outline" 
            label="Chế độ tối" 
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#EEEEEE', true: '#000' }}
                thumbColor={'#FFF'}
              />
            }
          />

          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          <MenuItem icon="help-circle-outline" label="Trung tâm trợ giúp" />
          <MenuItem icon="information-circle-outline" label="Chính sách bảo mật" />
          
          <View style={{ marginTop: 10 }}>
            <MenuItem 
                icon="log-out-outline" 
                label="Đăng xuất" 
                isLogout={true} 
                onPress={() => Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn thoát?")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F5F5' },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00B14F', // Đổi màu xanh cho nổi bật
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: { fontSize: 20, fontWeight: '700', marginTop: 12, color: '#1A1A1A' },
  userPhone: { fontSize: 14, color: '#8C8C8C', marginTop: 4 },
  menuSection: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#BDBDBD',
    marginTop: 25,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  logoutLabel: { color: '#F75555' },
  logoutIconBg: { backgroundColor: '#FFF5F5' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
});