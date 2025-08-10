import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  Filter,
  Play,
  Star,
  Clock,
  Eye,
  Heart,
  Share,
  Bookmark
} from 'lucide-react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Movies', 'TV Shows', 'Documentaries', 'Kids', 'Sports'];

  const platforms = [
    { name: 'Netflix', color: '#E50914', icon: 'netflix', lib: 'MaterialCommunityIcons' },
    { name: 'YouTube', color: '#FF0000', icon: 'youtube', lib: 'FontAwesome' },
    { name: 'JioHotstar', color: '#1E40AF', icon: 'movie-play', lib: 'MaterialCommunityIcons' },
    { name: 'SonyLIV', color: '#FF6B35', icon: 'television-classic', lib: 'MaterialCommunityIcons' }, // SonyLIV doesn't have official icon
    { name: 'Amazon', color: '#FF9900', icon: 'amazon', lib: 'FontAwesome' },
    { name: 'Spotify', color: '#1DB954', icon: 'spotify', lib: 'FontAwesome' },
  ];

  const freeContent = [
    {
      id: 1,
      title: 'The Kashmir Files',
      type: 'Movie',
      platform: 'YouTube',
      duration: '2h 50m',
      rating: 4.8,
      views: '2.5M',
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A gripping drama based on true events in Kashmir',
      genre: 'Drama',
      year: 2022,
      isPremium: false,
    },
    {
      id: 2,
      title: 'Scam 1992',
      type: 'TV Show',
      platform: 'SonyLIV',
      duration: '10 episodes',
      rating: 4.9,
      views: '5.2M',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The story of Harshad Mehta and the 1992 securities scam',
      genre: 'Biography',
      year: 2020,
      isPremium: false,
    },
    {
      id: 3,
      title: 'Free Guy',
      type: 'Movie',
      platform: 'Disney+ Hotstar',
      duration: '1h 55m',
      rating: 4.6,
      views: '8.1M',
      image: 'https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A bank teller discovers he is a background character in a video game',
      genre: 'Comedy',
      year: 2021,
      isPremium: false,
    },
    {
      id: 4,
      title: 'National Geographic Wild',
      type: 'Documentary',
      platform: 'YouTube',
      duration: '45m',
      rating: 4.7,
      views: '1.8M',
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Wildlife documentaries from around the world',
      genre: 'Documentary',
      year: 2023,
      isPremium: false,
    },
  ];

  const trendingNow = [
    {
      id: 1,
      title: 'Wednesday',
      platform: 'Netflix',
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'The Bear',
      platform: 'Disney+',
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'House of Dragons',
      platform: 'HBO Max',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.7,
    },
  ];

  const filteredContent = freeContent.filter(item =>
    (selectedCategory === 'All' || item.type === selectedCategory) &&
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, shows, platforms..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Now */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingNow.map((item) => (
              <TouchableOpacity key={item.id} style={styles.trendingCard}>
                <Image source={{ uri: item.image }} style={styles.trendingImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.trendingOverlay}
                />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingTitle}>{item.title}</Text>
                  <View style={styles.trendingMeta}>
                    <Star size={12} color="#F59E0B" />
                    <Text style={styles.trendingRating}>{item.rating}</Text>
                    <Text style={styles.trendingPlatform}>{item.platform}</Text>
                  </View>
                </View>
                <View style={styles.playButton}>
                  <Play size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Free Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free to Watch</Text>
          {filteredContent.map((item) => (
            <TouchableOpacity key={item.id} style={styles.contentCard}>
              <Image source={{ uri: item.image }} style={styles.contentImage} />
              <View style={styles.contentInfo}>
                <View style={styles.contentHeader}>
                  <Text style={styles.contentTitle}>{item.title}</Text>
                  <View style={styles.contentActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Heart size={20} color="#EF4444" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Bookmark size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Share size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.contentMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>{item.platform}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Star size={14} color="#F59E0B" />
                    <Text style={styles.metaText}>{item.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Eye size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{item.views}</Text>
                  </View>
                </View>

                <Text style={styles.contentDescription}>{item.description}</Text>

                <View style={styles.contentGenre}>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreText}>{item.genre}</Text>
                  </View>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreText}>{item.year}</Text>
                  </View>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreText}>{item.type}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.watchButton}>
                  <LinearGradient
                    colors={['#8B5CF6', '#A78BFA']}
                    style={styles.watchButtonGradient}
                  >
                    <Play size={16} color="#FFFFFF" />
                    <Text style={styles.watchButtonText}>Watch Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Recommendations</Text>
          <View style={styles.platformsGrid}>
            {platforms.map((platform, index) => (
              <TouchableOpacity key={index} style={styles.platformCard}>
                <LinearGradient
                  colors={[platform.color + '20', platform.color + '10']}
                  style={styles.platformGradient}
                >
                  {/* Render Icon */}
                  {platform.lib === 'FontAwesome' ? (
                    <FontAwesome name={platform.icon} size={28} color={platform.color} />
                  ) : (
                    <MaterialCommunityIcons name={platform.icon} size={28} color={platform.color} />
                  )}

                  <Text style={styles.platformName}>{platform.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  trendingCard: {
    width: 160,
    height: 240,
    borderRadius: 12,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trendingInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingRating: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  trendingPlatform: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    marginLeft: 8,
  },
  playButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentImage: {
    width: 120,
    height: 160,
  },
  contentInfo: {
    flex: 1,
    padding: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  contentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
  contentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  contentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  contentGenre: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  watchButton: {
    alignSelf: 'flex-start',
  },
  watchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  watchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '48%',
    marginBottom: 12,
  },
  platformGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  platformName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  platformContent: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});