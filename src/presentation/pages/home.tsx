import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

/**
 * 40  = paddingHorizontal (20 * 2)
 * 24  = gap giữa 3 card (12 * 2)
 */
const CARD_WIDTH = (width - 40 - 24) / 3;

const HomeScreen = () => {
  const categories = [
    {
      id: 1,
      name: 'Special Voucher',
      type: 'special',
      color: '#FF8A5B',
    },
    { id: 2, name: 'Cookies', emoji: '🍪', color: '#F5E6D3' },
    { id: 3, name: 'Drinks', emoji: '🥤', color: '#FFE5E5' },
    { id: 4, name: 'Desserts', emoji: '🥐', color: '#FFF8F0' },
    { id: 5, name: 'Pizza', emoji: '🍕', color: '#FFF8E7' },
    { id: 6, name: 'Salads', emoji: '🥗', color: '#F0FFF0' },
  ];

  const places = [
    {
      id: 1,
      name: 'Sundown café',
      rating: 4.9,
      type: 'Italian food',
      time: '60 min',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    },
    {
      id: 2,
      name: 'The cozy cup',
      rating: 4.8,
      type: 'Breakfast, coffee',
      time: '35 min',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    },
  ];

  const bestPrices = [
    { id: 1, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300' },
    { id: 2, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300' },
    { id: 3, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300' },
  ];

  const renderCategoryCard = (cat: any) => {
  if (cat.type === 'special') {
    return (
      <TouchableOpacity
        key={cat.id}
        style={[styles.specialCard, { backgroundColor: cat.color }]}
      >
        {/* TITLE – 1 DÒNG */}
        <Text style={styles.specialTitle} numberOfLines={1}>
          Special Voucher
        </Text>

        {/* BADGES */}
        <View style={styles.discountBadges}>
          <View style={[styles.badge, { backgroundColor: '#5DADE2' }]}>
            <Text style={styles.badgeText}>-50%</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: '#58D68D' }]}>
            <Text style={styles.badgeText}>-25%</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: '#F8B4D9' }]}>
            <Text style={styles.badgeText}>-15%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      key={cat.id}
      style={[styles.categoryCard, { backgroundColor: cat.color }]}
    >
      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
      <Text style={styles.categoryName}>{cat.name}</Text>
    </TouchableOpacity>
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../../pic/home/vinfast_home.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryRow}>
            {categories.slice(0, 3).map(renderCategoryCard)}
          </View>
          <View style={styles.categoryRow}>
            {categories.slice(3, 6).map(renderCategoryCard)}
          </View>
        </View>

        {/* Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Places</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {places.map((place) => (
              <View key={place.id} style={styles.placeCard}>
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeType}>
                  ⭐ {place.rating} • {place.type} • {place.time}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Best Prices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best prices</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {bestPrices.map((item) => (
              <View key={item.id} style={styles.priceCard}>
                <Image source={{ uri: item.image }} style={styles.priceImage} />
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ======================= STYLE ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6c1cc',
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  headerImage: {
    width: 180,
    height: 55,
    marginTop: 30,
  },

  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  /** 🔥 FIX QUAN TRỌNG */
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  categoryCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  specialCard: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,

    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  specialTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
  },

  /** 🔥 FIX BADGE */
  discountBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },


  badge: {
    width: '48%',              // ⭐ BẮT BUỘC
    paddingVertical: 6,
    marginBottom: 6,           // ⭐ THAY gap
    borderRadius: 14,
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  categoryEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },

  categoryName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  section: {
    paddingLeft: 20,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 15,
  },

  placeCard: {
    width: 160,
    marginRight: 15,
  },

  placeImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
  },

  placeName: {
    fontSize: 16,
    fontWeight: '600',
  },

  placeType: {
    fontSize: 12,
    color: '#666',
  },

  priceCard: {
    width: 140,
    marginRight: 15,
  },

  priceImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },

  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF8A5B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
