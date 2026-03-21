import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert, Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ProfileStackParamList } from '../navigation/AppNavigation';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'edit_profile'
>;

type RouteParams = {
  updatedProfile?: {
    name: string;
    gender: string;
    email: string;
    phone: string;
    dob: string;
    avatarUri: string;
  };
};

import { RouteProp } from '@react-navigation/native';

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [avatarUri, setAvatarUri] = useState('https://via.placeholder.com/100');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cấp quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    } else {
      Alert.alert('Không thể chọn ảnh', 'Vui lòng thử lại.');
    }
  };

  const loadProfile = async () => {
    try {
      console.log('Loading profile from AsyncStorage...');
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        console.log('Profile loaded:', savedProfile);
        const profile = JSON.parse(savedProfile);
        setName(profile.name || '');
        setGender(profile.gender || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setDob(profile.dob || '');
        setAvatarUri(profile.avatarUri || 'https://via.placeholder.com/100');
      } else {
        console.log('No profile found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!name || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin trước khi lưu.');
      return;
    }

    const updatedProfile = {
      name,
      gender,
      email,
      phone,
      dob,
      avatarUri,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      Alert.alert('Thành công', 'Thông tin đã được lưu.');
      navigation.navigate('profile_main', { updatedProfile });
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin.');
    }
  };

  React.useEffect(() => {
    loadProfile();
  }, []);

  const route = useRoute<RouteProp<ProfileStackParamList, 'profile_main'>>();

  React.useEffect(() => {
    const updatedProfile = route.params?.updatedProfile;
    if (updatedProfile) {
      setName(updatedProfile.name || '');
      setGender(updatedProfile.gender || '');
      setEmail(updatedProfile.email || '');
      setPhone(updatedProfile.phone || '');
      setDob(updatedProfile.dob || '');
      setAvatarUri(updatedProfile.avatarUri || 'https://via.placeholder.com/100');
    } else {
      setName('');
      setGender('');
      setEmail('');
      setPhone('');
      setDob('');
      setAvatarUri('https://via.placeholder.com/100');
    }
  }, [route.params]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <Text style={styles.subtitle}>
        Quản lý những thông tin giúp ứng dụng hỗ trợ bạn hiệu quả hơn và quyết định thông tin nào người khác có thể nhìn thấy.
      </Text>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editAvatarButton} onPress={pickImage}>
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setAvatarUri(`https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=444&color=fff`);
            }}
            placeholder={name ? '' : 'Nhập tên của bạn'}
          />
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Giới tính</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
            placeholder={gender ? '' : 'Nhập giới tính'}
          />
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={email ? '' : 'Nhập email của bạn'}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder={phone ? '' : 'Nhập số điện thoại'}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder={dob ? '' : 'Nhập ngày sinh'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Lưu thông tin</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Màu nền trắng giống giao diện chính
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Màu chữ đen giống giao diện chính
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666', // Màu chữ phụ xám nhạt giống giao diện chính
    textAlign: 'center',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F2', // Màu nền avatar giống giao diện chính
  },
  editAvatarButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: '#F9F9F9', // Màu nền phần thông tin giống giao diện chính
    borderRadius: 10,
    padding: 15,
  },
  infoItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000', // Màu chữ nhãn đen giống giao diện chính
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF', // Màu nền input trắng giống giao diện chính
    color: '#000', // Màu chữ input đen giống giao diện chính
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC', // Màu viền input xám nhạt giống giao diện chính
  },
  saveButton: {
    backgroundColor: '#39B78D', // Màu xanh lá cây cho nút lưu giống giao diện chính
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff', // Màu chữ nút lưu trắng
    fontWeight: 'bold',
  },
});