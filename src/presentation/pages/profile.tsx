import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
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

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  rightElement?: React.ReactNode;
  isLogout?: boolean;
  screen?: string;
}

export default function ProfileScreen() {

  const navigation:any = useNavigation();
  const route:any = useRoute();

  const updatedProfile = route.params?.updatedProfile;

  const [avatarUri, setAvatarUri] = useState(
    updatedProfile?.avatarUri ||
      'https://i.pinimg.com/736x/21/6b/03/216b036577589d7010a30b696f839634.jpg'
  );

  const [name] = useState(updatedProfile?.name || "Người dùng");
  const [phone] = useState(updatedProfile?.phone || "0123456789");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Bạn cần cho phép truy cập thư viện ảnh');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality:1
    });

    if(!result.canceled && result.assets.length>0){
      setAvatarUri(result.assets[0].uri)
    }
  };

  const MenuItem = ({
    icon,
    label,
    rightElement,
    isLogout,
    screen
  }: MenuItemProps) => (
    <Pressable
      style={styles.menuItem}
      onPress={()=>{
        if(screen){
          navigation.navigate(screen)
        }
      }}
    >
      <View style={styles.menuLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={isLogout ? "#F75555" : "#212121"}
        />
        <Text style={[styles.menuLabel, isLogout && styles.logoutLabel]}>
          {label}
        </Text>
      </View>

      <View style={styles.menuRight}>
        {rightElement ? rightElement : (
          !isLogout && (
            <Ionicons name="chevron-forward" size={20} color="#212121"/>
          )
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <Ionicons name="ellipsis-horizontal-circle" size={24} color="black"/>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{uri:avatarUri}} style={styles.avatar}/>

            <Pressable style={styles.editAvatarBtn} onPress={pickImage}>
              <Ionicons name="pencil" size={12} color="white"/>
            </Pressable>
          </View>

          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userPhone}>{phone}</Text>
        </View>

        <View style={styles.divider}/>

        <View style={styles.menuSection}>

          <MenuItem icon="person-outline" label="Chỉnh sửa hồ sơ" screen="edit_profile"/>

          <MenuItem
            icon="notifications-outline"
            label="Thông báo"
            rightElement={
              <Switch
                value={isNotificationOn}
                onValueChange={(value)=>setIsNotificationOn(value)}
              />
            }
          />

          <MenuItem icon="card-outline" label="Thanh toán" screen="payment"/>
          <MenuItem icon="shield-checkmark-outline" label="Bảo mật" screen="security"/>
          <MenuItem icon="language-outline" label="Ngôn ngữ" screen="language"/>

          <MenuItem
            icon="moon-outline"
            label="Chế độ tối"
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={(value)=>setIsDarkMode(value)}
              />
            }
          />

          <MenuItem icon="document-text-outline" label="Chính sách bảo mật" screen="privacy_policy"/>

          <MenuItem icon="log-out-outline" label="Đăng xuất" isLogout/>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#fff"
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    padding:20
  },

  headerTitle:{
    fontSize:24,
    fontWeight:"bold"
  },

  profileSection:{
    alignItems:"center",
    marginTop:20,
    marginBottom:25
  },

  avatarContainer:{
    position:"relative"
  },

  avatar:{
    width:120,
    height:120,
    borderRadius:60
  },

  editAvatarBtn:{
    position:"absolute",
    bottom:5,
    right:5,
    backgroundColor:"#000",
    padding:6,
    borderRadius:8
  },

  userName:{
    fontSize:24,
    fontWeight:"bold",
    marginTop:15
  },

  userPhone:{
    fontSize:14,
    color:"#616161",
    marginTop:8
  },

  divider:{
    height:1,
    backgroundColor:"#eee",
    marginHorizontal:20
  },

  menuSection:{
    paddingHorizontal:20,
    paddingVertical:10
  },

  menuItem:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingVertical:15
  },

  menuLeft:{
    flexDirection:"row",
    alignItems:"center",
    gap:15
  },

  menuLabel:{
    fontSize:18,
    fontWeight:"600"
  },

  logoutLabel:{
    color:"#F75555"
  },

  menuRight:{
    flexDirection:"row",
    alignItems:"center"
  }

});