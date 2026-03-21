import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Address {
  id: number;
  address: string;
  street: string;
  postCode: string;
  apartment: string;
  label: string;
}

export default function AddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [postCode, setPostCode] = useState('');
  const [apartment, setApartment] = useState('');
  const [label, setLabel] = useState('Nhà riêng');

  const loadAddresses = async () => {
    try {
      console.log('Đang tải danh sách địa chỉ từ AsyncStorage...');
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        console.log('Danh sách địa chỉ đã tải:', savedAddresses);
        setAddresses(JSON.parse(savedAddresses));
      } else {
        console.log('Không tìm thấy địa chỉ nào trong AsyncStorage.');
      }
    } catch (error) {
      console.error('Không thể tải danh sách địa chỉ:', error);
    }
  };

  const saveAddress = async () => {
    if (!address || !street || !postCode || !apartment) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const newAddress = {
      id: addresses.length ? addresses[addresses.length - 1].id + 1 : 1,
      address,
      street,
      postCode,
      apartment,
      label,
    };

    const updatedAddresses = [...addresses, newAddress];

    try {
      console.log('Đang lưu địa chỉ mới:', newAddress);
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      console.log('Danh sách địa chỉ sau khi lưu:', updatedAddresses);
      setAddresses(updatedAddresses);
      Alert.alert('Thành công', 'Địa chỉ đã được lưu.');

      // Đảm bảo thông tin hiển thị trong danh sách
      setAddress('');
      setStreet('');
      setPostCode('');
      setApartment('');
      setLabel('Nhà riêng');
    } catch (error) {
      console.error('Không thể lưu địa chỉ:', error);
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ.');
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Địa Chỉ</Text>

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Nhập địa chỉ"
        placeholderTextColor="#B0B0B0"
      />

      <Text style={styles.label}>Đường</Text>
      <TextInput
        style={styles.input}
        value={street}
        onChangeText={setStreet}
        placeholder="Nhập tên đường"
        placeholderTextColor="#B0B0B0"
      />

      <View style={styles.rowContainer}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Mã bưu điện</Text>
          <TextInput
            style={styles.input}
            value={postCode}
            onChangeText={setPostCode}
            placeholder="Nhập mã bưu điện"
            placeholderTextColor="#B0B0B0"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.rowItem}>
          <Text style={styles.label}>Căn hộ</Text>
          <TextInput
            style={styles.input}
            value={apartment}
            onChangeText={setApartment}
            placeholder="Nhập số căn hộ"
            placeholderTextColor="#B0B0B0"
          />
        </View>
      </View>

      <Text style={styles.label}>Gắn nhãn</Text>
      <View style={styles.labelContainer}>
        {['Nhà riêng', 'Công ty', 'Khác'].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={[
              styles.labelButton,
              label === lbl && styles.selectedLabelButton,
            ]}
            onPress={() => setLabel(lbl)}
          >
            <Text
              style={
                label === lbl
                  ? styles.selectedLabelText
                  : styles.labelText
              }
            >
              {lbl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
        <Text style={styles.saveButtonText}>Lưu Địa Chỉ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 1,
    marginRight: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  labelButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedLabelButton: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  labelText: {
    color: '#333',
  },
  selectedLabelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#39B78D', // Màu xanh lá cây giống giao diện của EditProfile
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});