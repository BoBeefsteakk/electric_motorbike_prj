// App.tsx
import { StyleSheet } from 'react-native';

// Import file Login của bạn từ đường dẫn src
import { AppNavigation } from './src/presentation/navigation/AppNavigation';

export default function App() {
  return (
    <AppNavigation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Màu nền mặc định
  },
});