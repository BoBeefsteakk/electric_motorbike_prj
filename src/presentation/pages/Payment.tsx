import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {

  return (

    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Thanh toán
        </Text>

      </View>

      <ScrollView>

        {/* CARD */}

        <View style={styles.card}>

          <Text style={styles.cardNumber}>
            **** **** **** 4679
          </Text>

          <View style={styles.cardBottom}>

            <Text style={styles.cardName}>
              NGUYEN VAN A
            </Text>

            <Text style={styles.cardDate}>
              12/26
            </Text>

          </View>

        </View>

        {/* ADD PAYMENT */}

        <Pressable style={styles.addPayment}>

          <Ionicons
            name="add-circle-outline"
            size={24}
            color="#000"
          />

          <Text style={styles.addPaymentText}>
            Thêm phương thức thanh toán
          </Text>

        </Pressable>

        {/* PAYMENT OPTIONS */}

        <View style={styles.option}>

          <Ionicons name="logo-paypal" size={24}/>

          <Text style={styles.optionText}>
            PayPal
          </Text>

        </View>

        <View style={styles.option}>

          <Ionicons name="logo-google" size={24}/>

          <Text style={styles.optionText}>
            Google Pay
          </Text>

        </View>

        <View style={styles.option}>

          <Ionicons name="phone-portrait-outline" size={24}/>

          <Text style={styles.optionText}>
            Ví điện tử
          </Text>

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
alignItems:"center",
padding:20
},

headerTitle:{
fontSize:22,
fontWeight:"bold"
},

card:{
backgroundColor:"#000",
marginHorizontal:20,
marginTop:10,
padding:25,
borderRadius:16
},

cardNumber:{
color:"#fff",
fontSize:20,
letterSpacing:3,
marginBottom:20
},

cardBottom:{
flexDirection:"row",
justifyContent:"space-between"
},

cardName:{
color:"#fff",
fontSize:14
},

cardDate:{
color:"#fff",
fontSize:14
},

addPayment:{
flexDirection:"row",
alignItems:"center",
gap:10,
padding:20
},

addPaymentText:{
fontSize:16,
fontWeight:"600"
},

option:{
flexDirection:"row",
alignItems:"center",
gap:15,
padding:20,
borderTopWidth:1,
borderColor:"#eee"
},

optionText:{
fontSize:16
}

});