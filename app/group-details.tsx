import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Users, IndianRupee, Calendar, Settings, MessageCircle, Crown, UserPlus, Copy, Share, Bell, CreditCard, Shield, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Wallet, Download } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function GroupDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, fetch based on id
  const groupData = {
    id: 1,
    name: 'Netflix Squad',
    platform: 'Netflix',
    plan: 'Standard',
    members: 4,
    maxMembers: 4,
    monthlyCost: 199,
    personalCost: 49.75,
    isOwner: true,
    nextBilling: '2024-01-15',
    createdDate: '2023-12-01',
    groupCode: 'NF2024',
    image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#E50914',
    status: 'active',
    totalCollected: 796, // 4 members * 199 = 796
    availableBalance: 796,
    credentials: {
      email: 'group@email.com',
      password: '••••••••'
    },
    membersList: [
      {
        id: 1,
        name: 'You',
        email: 'your@email.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
        role: 'Owner',
        joinedDate: '2023-12-01',
        paymentStatus: 'paid',
        isOwner: true,
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@email.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
        role: 'Member',
        joinedDate: '2023-12-05',
        paymentStatus: 'paid',
        isOwner: false,
      },
      {
        id: 3,
        name: 'Amit Patel',
        email: 'amit@email.com',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=60',
        role: 'Member',
        joinedDate: '2023-12-10',
        paymentStatus: 'paid',
        isOwner: false,
      },
      {
        id: 4,
        name: 'Sarah Khan',
        email: 'sarah@email.com',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60',
        role: 'Member',
        joinedDate: '2023-12-12',
        paymentStatus: 'paid',
        isOwner: false,
      },
    ],
    billingHistory: [
      { date: '2024-01-01', amount: 199, status: 'paid', method: 'UPI' },
      { date: '2023-12-01', amount: 199, status: 'paid', method: 'Card' },
      { date: '2023-11-01', amount: 199, status: 'paid', method: 'UPI' },
    ],
    withdrawalHistory: [
      { date: '2024-01-01', amount: 199, type: 'Netflix Subscription', status: 'completed' },
      { date: '2023-12-01', amount: 199, type: 'Netflix Subscription', status: 'completed' },
    ],
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'billing', label: 'Billing' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'settings', label: 'Settings' },
  ];

  const copyGroupCode = () => {
    Alert.alert('Copied!', 'Group code copied to clipboard');
  };

  const shareGroup = () => {
    Alert.alert('Share Group', 'Share link copied to clipboard');
  };

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Funds',
      `Withdraw ₹${groupData.availableBalance} to purchase ${groupData.platform} subscription?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Withdraw', 
          onPress: () => Alert.alert('Success', 'Funds withdrawn successfully!') 
        },
      ]
    );
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Group Info Card */}
      <View style={styles.infoCard}>
        <LinearGradient
          colors={[groupData.color + '20', groupData.color + '10']}
          style={styles.infoCardGradient}
        >
          <View style={styles.infoHeader}>
            <Image source={{ uri: groupData.image }} style={styles.groupImage} />
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{groupData.name}</Text>
              <Text style={styles.groupPlatform}>{groupData.platform} • {groupData.plan}</Text>
              <View style={styles.statusBadge}>
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            {groupData.isOwner && (
              <Crown size={20} color="#F59E0B" />
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{groupData.members}/{groupData.maxMembers}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statCard}>
          <IndianRupee size={20} color="#10B981" />
          <Text style={styles.statValue}>₹{groupData.personalCost.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Your Share</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={20} color="#F59E0B" />
          <Text style={styles.statValue}>
            {new Date(groupData.nextBilling).getDate()}
          </Text>
          <Text style={styles.statLabel}>Next Billing</Text>
        </View>
        <View style={styles.statCard}>
          <Wallet size={20} color="#059669" />
          <Text style={styles.statValue}>₹{groupData.availableBalance}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* Admin Withdrawal Section */}
      {groupData.isOwner && groupData.availableBalance > 0 && (
        <View style={styles.withdrawalCard}>
          <LinearGradient
            colors={['#059669', '#10B981']}
            style={styles.withdrawalGradient}
          >
            <Text style={styles.withdrawalTitle}>Ready to Purchase</Text>
            <Text style={styles.withdrawalSubtitle}>
              All members have paid. You can now purchase the {groupData.platform} subscription.
            </Text>
            <View style={styles.withdrawalAmount}>
              <IndianRupee size={20} color="#FFFFFF" />
              <Text style={styles.withdrawalAmountText}>₹{groupData.availableBalance}</Text>
            </View>
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Download size={16} color="#059669" />
              <Text style={styles.withdrawButtonText}>Withdraw & Purchase</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push(`/chat?groupId=${groupData.id}`)}
        >
          <MessageCircle size={20} color="#8B5CF6" />
          <Text style={styles.actionText}>Group Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={shareGroup}>
          <Share size={20} color="#10B981" />
          <Text style={styles.actionText}>Share Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Bell size={20} color="#F59E0B" />
          <Text style={styles.actionText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Group Code */}
      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>Group Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{groupData.groupCode}</Text>
          <TouchableOpacity onPress={copyGroupCode}>
            <Copy size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
        <Text style={styles.codeSubtitle}>Share this code with friends to invite them</Text>
      </View>
    </View>
  );

  const renderMembers = () => (
    <View style={styles.tabContent}>
      {groupData.isOwner && (
        <TouchableOpacity style={styles.inviteButton}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.inviteButtonGradient}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.inviteButtonText}>Invite Member</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {groupData.membersList.map((member) => (
        <View key={member.id} style={styles.memberCard}>
          <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
          <View style={styles.memberInfo}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>{member.name}</Text>
              {member.isOwner && <Crown size={14} color="#F59E0B" />}
            </View>
            <Text style={styles.memberEmail}>{member.email}</Text>
            <Text style={styles.memberJoined}>
              Joined {new Date(member.joinedDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.memberStatus}>
            {member.paymentStatus === 'paid' ? (
              <View style={styles.paidStatus}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.paidText}>Paid</Text>
              </View>
            ) : (
              <View style={styles.pendingStatus}>
                <Clock size={16} color="#F59E0B" />
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderBilling = () => (
    <View style={styles.tabContent}>
      {/* Next Payment */}
      <View style={styles.nextPaymentCard}>
        <LinearGradient
          colors={['#8B5CF6', '#A78BFA']}
          style={styles.nextPaymentGradient}
        >
          <Text style={styles.nextPaymentTitle}>Next Payment</Text>
          <Text style={styles.nextPaymentDate}>
            {new Date(groupData.nextBilling).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <View style={styles.nextPaymentAmount}>
            <IndianRupee size={20} color="#FFFFFF" />
            <Text style={styles.nextPaymentAmountText}>₹{groupData.personalCost.toFixed(0)}</Text>
          </View>
          <TouchableOpacity style={styles.payNowButton}>
            <Text style={styles.payNowText}>Pay Now</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Billing History */}
      <Text style={styles.sectionTitle}>Billing History</Text>
      {groupData.billingHistory.map((bill, index) => (
        <View key={index} style={styles.billCard}>
          <View style={styles.billIcon}>
            <CreditCard size={20} color="#8B5CF6" />
          </View>
          <View style={styles.billInfo}>
            <Text style={styles.billDate}>
              {new Date(bill.date).toLocaleDateString()}
            </Text>
            <Text style={styles.billMethod}>Paid via {bill.method}</Text>
          </View>
          <View style={styles.billAmount}>
            <Text style={styles.billAmountText}>₹{bill.amount}</Text>
            <CheckCircle size={16} color="#10B981" />
          </View>
        </View>
      ))}
    </View>
  );

  const renderWallet = () => (
    <View style={styles.tabContent}>
      {/* Wallet Balance */}
      <View style={styles.walletCard}>
        <LinearGradient
          colors={['#059669', '#10B981']}
          style={styles.walletGradient}
        >
          <Text style={styles.walletTitle}>Group Wallet</Text>
          <View style={styles.walletBalance}>
            <IndianRupee size={24} color="#FFFFFF" />
            <Text style={styles.walletBalanceText}>₹{groupData.availableBalance}</Text>
          </View>
          <Text style={styles.walletSubtitle}>
            Collected from {groupData.membersList.filter(m => m.paymentStatus === 'paid').length} members
          </Text>
        </LinearGradient>
      </View>

      {/* Wallet Stats */}
      <View style={styles.walletStats}>
        <View style={styles.walletStatCard}>
          <Text style={styles.walletStatValue}>₹{groupData.totalCollected}</Text>
          <Text style={styles.walletStatLabel}>Total Collected</Text>
        </View>
        <View style={styles.walletStatCard}>
          <Text style={styles.walletStatValue}>₹{groupData.totalCollected - groupData.availableBalance}</Text>
          <Text style={styles.walletStatLabel}>Total Spent</Text>
        </View>
      </View>

      {/* Admin Actions */}
      {groupData.isOwner && (
        <View style={styles.adminActions}>
          <TouchableOpacity style={styles.adminActionButton} onPress={handleWithdraw}>
            <Download size={20} color="#059669" />
            <Text style={styles.adminActionText}>Withdraw Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminActionButton}>
            <CreditCard size={20} color="#8B5CF6" />
            <Text style={styles.adminActionText}>Purchase Subscription</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Withdrawal History */}
      <Text style={styles.sectionTitle}>Withdrawal History</Text>
      {groupData.withdrawalHistory.map((withdrawal, index) => (
        <View key={index} style={styles.withdrawalHistoryCard}>
          <View style={styles.withdrawalIcon}>
            <Download size={20} color="#059669" />
          </View>
          <View style={styles.withdrawalInfo}>
            <Text style={styles.withdrawalDate}>
              {new Date(withdrawal.date).toLocaleDateString()}
            </Text>
            <Text style={styles.withdrawalType}>{withdrawal.type}</Text>
          </View>
          <View style={styles.withdrawalAmount}>
            <Text style={styles.withdrawalAmountText}>₹{withdrawal.amount}</Text>
            <CheckCircle size={16} color="#10B981" />
          </View>
        </View>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account Credentials</Text>
        <View style={styles.credentialCard}>
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Email</Text>
            <Text style={styles.credentialValue}>{groupData.credentials.email}</Text>
          </View>
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Password</Text>
            <Text style={styles.credentialValue}>{groupData.credentials.password}</Text>
          </View>
          <TouchableOpacity style={styles.viewCredentialsButton}>
            <Shield size={16} color="#8B5CF6" />
            <Text style={styles.viewCredentialsText}>View Full Credentials</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Group Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Group Info</Text>
          <Settings size={16} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Bell size={16} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Payment Settings</Text>
          <CreditCard size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {groupData.isOwner && (
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Owner Actions</Text>
          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
            <Text style={[styles.settingText, styles.dangerText]}>Delete Group</Text>
            <AlertCircle size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Details</Text>
        <TouchableOpacity>
          <Settings size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'settings' && renderSettings()}
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
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoCardGradient: {
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  groupPlatform: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  withdrawalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  withdrawalGradient: {
    padding: 20,
    alignItems: 'center',
  },
  withdrawalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  withdrawalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  withdrawalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawalAmountText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  withdrawButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  codeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    letterSpacing: 2,
  },
  codeSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  inviteButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  inviteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  inviteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  memberCard: {
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
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  memberEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  memberJoined: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  memberStatus: {
    alignItems: 'flex-end',
  },
  paidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  pendingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginLeft: 4,
  },
  nextPaymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  nextPaymentGradient: {
    padding: 20,
    alignItems: 'center',
  },
  nextPaymentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  nextPaymentDate: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  nextPaymentAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextPaymentAmountText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  payNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  payNowText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  billCard: {
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
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  billMethod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  billAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  walletCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  walletGradient: {
    padding: 20,
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  walletBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletBalanceText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  walletSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  walletStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  walletStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  walletStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  walletStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  adminActions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  adminActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adminActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 8,
  },
  withdrawalHistoryCard: {
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
  withdrawalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#059669' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  withdrawalInfo: {
    flex: 1,
  },
  withdrawalDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  withdrawalType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  settingsSection: {
    marginBottom: 24,
  },
  credentialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  credentialLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  credentialValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  viewCredentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  viewCredentialsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerText: {
    color: '#EF4444',
  },
});