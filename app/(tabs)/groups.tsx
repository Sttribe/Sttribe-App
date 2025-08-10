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
  Plus, 
  Users, 
  Search,
  MessageCircle,
  Settings,
  Crown,
  Calendar,
  IndianRupee
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function GroupsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const myGroups = [
    {
      id: 1,
      name: 'Netflix Squad',
      platform: 'Netflix',
      members: 4,
      maxMembers: 4,
      monthlyCost: 199,
      personalCost: 49.75,
      isOwner: true,
      nextBilling: '2024-01-15',
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#E50914',
      avatars: [
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=60',
      ],
    },
    {
      id: 2,
      name: 'Prime Family',
      platform: 'Amazon Prime',
      members: 6,
      maxMembers: 6,
      monthlyCost: 999,
      personalCost: 166.5,
      isOwner: false,
      nextBilling: '2024-01-20',
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#00A8E1',
      avatars: [
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60',
      ],
    },
    {
      id: 3,
      name: 'Disney+ Magic',
      platform: 'Disney+ Hotstar',
      members: 3,
      maxMembers: 4,
      monthlyCost: 299,
      personalCost: 99.67,
      isOwner: false,
      nextBilling: '2024-01-25',
      image: 'https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#1E40AF',
      avatars: [
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
      ],
    },
  ];

  const joinableGroups = [
    {
      id: 4,
      name: 'Sony LIV Fans',
      platform: 'Sony LIV',
      members: 2,
      maxMembers: 5,
      monthlyCost: 699,
      personalCost: 139.8,
      owner: 'Priya Sharma',
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#FF6B35',
    },
    {
      id: 5,
      name: 'Zee5 Premium',
      platform: 'Zee5',
      members: 1,
      maxMembers: 5,
      monthlyCost: 499,
      personalCost: 99.8,
      owner: 'Amit Patel',
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#8B5CF6',
    },
  ];

  const filteredGroups = [...myGroups, ...joinableGroups].filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Groups</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/create-group')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search groups or platforms..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* My Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Groups ({myGroups.length})</Text>
          {myGroups.map((group) => (
            <TouchableOpacity 
              key={group.id} 
              style={styles.groupCard}
              onPress={() => router.push(`/group-details?id=${group.id}`)}
            >
              <View style={styles.groupHeader}>
                <Image source={{ uri: group.image }} style={styles.groupImage} />
                <View style={styles.groupInfo}>
                  <View style={styles.groupTitleRow}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    {group.isOwner && (
                      <Crown size={16} color="#F59E0B" />
                    )}
                  </View>
                  <Text style={styles.groupPlatform}>{group.platform}</Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.groupMembers}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.groupMemberCount}>
                        {group.members}/{group.maxMembers}
                      </Text>
                    </View>
                    <View style={styles.nextBilling}>
                      <Calendar size={14} color="#6B7280" />
                      <Text style={styles.nextBillingText}>
                        Next: {new Date(group.nextBilling).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.groupActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/chat?groupId=${group.id}`)}
                >
                  <MessageCircle size={18} color="#8B5CF6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Settings size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.costInfo}>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Your Share</Text>
                  <View style={styles.costValue}>
                    <IndianRupee size={14} color="#059669" />
                    <Text style={styles.costAmount}>
                      {group.personalCost.toFixed(0)}
                    </Text>
                  </View>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Total</Text>
                  <View style={styles.costValue}>
                    <IndianRupee size={14} color="#6B7280" />
                    <Text style={styles.totalAmount}>
                      {group.monthlyCost}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.membersRow}>
                <View style={styles.memberAvatars}>
                  {group.avatars.map((avatar, index) => (
                    <Image
                      key={index}
                      source={{ uri: avatar }}
                      style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                    />
                  ))}
                  {group.members > group.avatars.length && (
                    <View style={[styles.memberAvatar, styles.extraMember]}>
                      <Text style={styles.extraMemberText}>
                        +{group.members - group.avatars.length}
                      </Text>
                    </View>
                  )}
                </View>
                <LinearGradient
                  colors={[group.color + '20', group.color + '10']}
                  style={styles.progressBar}
                >
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${(group.members / group.maxMembers) * 100}%`,
                        backgroundColor: group.color,
                      }
                    ]}
                  />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Joinable Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Groups</Text>
          {joinableGroups.map((group) => (
            <TouchableOpacity key={group.id} style={styles.joinableCard}>
              <View style={styles.groupHeader}>
                <Image source={{ uri: group.image }} style={styles.groupImage} />
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupPlatform}>{group.platform}</Text>
                  <Text style={styles.groupOwner}>by {group.owner}</Text>
                </View>
              </View>

              <View style={styles.joinInfo}>
                <View style={styles.joinCost}>
                  <IndianRupee size={16} color="#059669" />
                  <Text style={styles.joinCostAmount}>
                    ₹{group.personalCost.toFixed(0)}/month
                  </Text>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.availableSlots}>
                <Text style={styles.availableSlotsText}>
                  {group.maxMembers - group.members} slots available
                </Text>
                <View style={styles.slotIndicators}>
                  {Array.from({ length: group.maxMembers }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.slotIndicator,
                        index < group.members ? { backgroundColor: group.color } : null,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  createButton: {
    backgroundColor: '#8B5CF6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  groupPlatform: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  groupOwner: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  nextBilling: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBillingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  groupActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  costInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  costRow: {
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  costValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 2,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 2,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  extraMember: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraMemberText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  joinableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  joinInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  joinCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinCostAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  availableSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableSlotsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  slotIndicators: {
    flexDirection: 'row',
  },
  slotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
  },
});