import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator
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
import { router } from 'expo-router';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [freeContent, setFreeContent] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  // const [filteredContent, setFilteredContent] = useState([]);

  // const categories = ['All', 'Drama', 'TV Shows', 'Biography', 'Thriller', 'Comedy', 'Documentaries'];

  const platforms = [
    { name: 'Netflix', color: '#E50914', icon: 'netflix', lib: 'MaterialCommunityIcons' },
    { name: 'YouTube', color: '#FF0000', icon: 'youtube', lib: 'FontAwesome' },
    { name: 'JioHotstar', color: '#1E40AF', icon: 'movie-play', lib: 'MaterialCommunityIcons' },
    { name: 'SonyLIV', color: '#FF6B35', icon: 'television-classic', lib: 'MaterialCommunityIcons' },
    { name: 'Amazon', color: '#FF9900', icon: 'amazon', lib: 'FontAwesome' },
    { name: 'Spotify', color: '#1DB954', icon: 'spotify', lib: 'FontAwesome' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://api-s2onatgxwq-uc.a.run.app/api/free-streams");
        setFreeContent(res.data);
      } catch (error) {
        console.error("Error fetching free streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (freeContent.length > 0) {
      const uniqueGenres = [...new Set(
        freeContent.map(item =>
          item.genre?.charAt(0).toUpperCase() + item.genre?.slice(1)
        )
      )];
      setCategories(['All', ...uniqueGenres]);
    }
  }, [freeContent]);

  const filteredContent = freeContent.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.genre?.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1)); // handles plural

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre?.toLowerCase().includes(selectedCategory.toLowerCase())

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          {/* <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity> */}
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

        {/* Free Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free to Watch</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {filteredContent.map((item) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/movie-details',
                      params: { item: JSON.stringify(item) }
                    });
                  }}
                  key={item.id}
                  style={styles.contentCard}
                >
                  <Image source={{ uri: item.thumbnail }} style={styles.contentImage} />
                  <View style={styles.contentInfo}>
                    <Text style={styles.contentTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.metaText}>{item.genre}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    width: '48%', // two items per row
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentImage: {
    width: '100%',
    height: 200, // taller for poster look
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentInfo: {
    padding: 8,
  },
  contentTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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