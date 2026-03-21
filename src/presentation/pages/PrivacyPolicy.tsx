import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {

  return (

    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Chính sách bảo mật
        </Text>
      </View>

      <ScrollView style={styles.content}>

        <Text style={styles.text}>

Ứng dụng của chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng.
Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp và cải thiện
dịch vụ cho bạn.

{"\n\n"}

1. Thu thập thông tin  
Chúng tôi có thể thu thập các thông tin như tên, số điện thoại, email
và thông tin tài khoản khi bạn sử dụng ứng dụng.

{"\n\n"}

2. Sử dụng thông tin  
Thông tin của bạn được sử dụng để:
- Cung cấp dịch vụ tốt hơn  
- Cải thiện trải nghiệm người dùng  
- Hỗ trợ khách hàng khi cần thiết

{"\n\n"}

3. Bảo mật thông tin  
Chúng tôi áp dụng các biện pháp bảo mật để đảm bảo thông tin cá nhân
của bạn không bị truy cập trái phép.

{"\n\n"}

4. Chia sẻ thông tin  
Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba
trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.

{"\n\n"}

5. Cập nhật chính sách  
Chính sách bảo mật có thể được cập nhật theo thời gian để phù hợp
với quy định và cải thiện dịch vụ.

{"\n\n"}

Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ
với chúng tôi qua email hỗ trợ.

        </Text>

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

content:{
paddingHorizontal:20
},

text:{
fontSize:16,
lineHeight:24,
color:"#333"
}

});