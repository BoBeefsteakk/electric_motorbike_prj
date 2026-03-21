import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityScreen() {

  const [twoFactor, setTwoFactor] = useState(false);
  const [fingerPrint, setFingerPrint] = useState(false);
  const [appLock, setAppLock] = useState(false);

  return (

    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Bảo mật
        </Text>
      </View>

      {/* OPTIONS */}

      <View style={styles.section}>

        <Pressable style={styles.item}>

          <View style={styles.left}>

            <Ionicons
              name="key-outline"
              size={24}
            />

            <Text style={styles.text}>
              Đổi mật khẩu
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
          />

        </Pressable>

        <View style={styles.item}>

          <View style={styles.left}>

            <Ionicons
              name="shield-checkmark-outline"
              size={24}
            />

            <Text style={styles.text}>
              Xác thực 2 lớp
            </Text>

          </View>

          <Switch
            value={twoFactor}
            onValueChange={setTwoFactor}
          />

        </View>

        <View style={styles.item}>

          <View style={styles.left}>

            <Ionicons
              name="finger-print-outline"
              size={24}
            />

            <Text style={styles.text}>
              Mở khóa bằng vân tay
            </Text>

          </View>

          <Switch
            value={fingerPrint}
            onValueChange={setFingerPrint}
          />

        </View>

        <View style={styles.item}>

          <View style={styles.left}>

            <Ionicons
              name="lock-closed-outline"
              size={24}
            />

            <Text style={styles.text}>
              Khóa ứng dụng
            </Text>

          </View>

          <Switch
            value={appLock}
            onValueChange={setAppLock}
          />

        </View>

      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#fff"
},

header:{
alignItems:"center",
padding:20
},

headerTitle:{
fontSize:22,
fontWeight:"bold"
},

section:{
marginTop:10
},

item:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
padding:20,
borderBottomWidth:1,
borderColor:"#eee"
},

left:{
flexDirection:"row",
alignItems:"center",
gap:15
},

text:{
fontSize:16,
fontWeight:"500"
}

});