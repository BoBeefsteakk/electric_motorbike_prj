import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HelpCenterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help Center Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});