import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  ChevronRight,
  Play,
  Star
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Active Groups', value: '3', icon: Users, color: '#8B5CF6' },
    { label: 'Monthly Savings', value: '₹450', icon: DollarSign, color: '#10B981' },
    { label: 'Total Saved', value: '₹2,340', icon: TrendingUp, color: '#F59E0B' },
  ];

  const recentGroups = [
    {
      id: 1,
      name: 'Netflix Squad',
      platform: 'Netflix',
      members: 4,
      cost: 199,
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#E50914',
    },
    {
      id: 2,
      name: 'Prime Family',
      platform: 'Amazon Prime',
      members: 6,
      cost: 166,
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#00A8E1',
    },
  ];

  const trending = [
    {
      id: 1,
      title: 'Stranger Things 4',
      platform: 'Netflix',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'The Boys',
      platform: 'Prime Video',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: 'Stranger Things 4',
      platform: 'Netflix',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome!</Text>
            <Text style={styles.username}>Rajesh Kumar</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notificationBtn}>
            <Bell size={24} color="#6B7280" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/create-group')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#A78BFA']}
                style={styles.quickActionGradient}
              >
                <Plus size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Create Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/groups')}
            >
              <LinearGradient
                colors={['#3B82F6', '#60A5FA']}
                style={styles.quickActionGradient}
              >
                <Users size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Join Group</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <TouchableOpacity onPress={() => router.push('/groups')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              onPress={() => router.push(`/group-details?id=${group.id}`)}
            >
              <Image source={{ uri: group.image }} style={styles.groupImage} />
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupPlatform}>{group.platform}</Text>
                <View style={styles.groupMeta}>
                  <View style={styles.groupMembers}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.groupMemberCount}>{group.members} members</Text>
                  </View>
                  <Text style={styles.groupCost}>₹{group.cost}/month</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trending.map((item) => (
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
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 4,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  groupPlatform: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupMemberCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  groupCost: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  trendingCard: {
    width: 200,
    height: 120,
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
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
});