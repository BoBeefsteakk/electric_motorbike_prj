import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function NotificationScreen() {

  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View style={styles.container}>

      <View style={styles.row}>

        <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
        />

        <Text style={styles.text}>
          Thông báo
        </Text>

        <Switch
          value={isEnabled}
          onValueChange={(value)=>setIsEnabled(value)}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#fff",
padding:20
},

row:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between"
},

text:{
fontSize:18,
flex:1,
marginLeft:15
}

});