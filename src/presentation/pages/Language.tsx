import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LanguageScreen() {

  const [selectedLanguage, setSelectedLanguage] = useState("vi");

  const LanguageItem = ({ label, value }: any) => (

    <Pressable
      style={styles.item}
      onPress={()=>setSelectedLanguage(value)}
    >

      <Text style={styles.text}>
        {label}
      </Text>

      {selectedLanguage === value && (
        <Ionicons
          name="checkmark"
          size={22}
          color="#000"
        />
      )}

    </Pressable>

  );

  return (

    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Ngôn ngữ
        </Text>
      </View>

      {/* LIST */}

      <View style={styles.section}>

        <LanguageItem
          label="Tiếng Việt"
          value="vi"
        />

        <LanguageItem
          label="English"
          value="en"
        />

        <LanguageItem
          label="日本語"
          value="jp"
        />

        <LanguageItem
          label="한국어"
          value="kr"
        />

        <LanguageItem
          label="中文"
          value="cn"
        />

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

text:{
fontSize:16,
fontWeight:"500"
}

});