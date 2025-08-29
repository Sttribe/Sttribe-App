import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, Wallet as Edit, Star, Gift, Users, IndianRupee, ChevronRight, Phone, Mail, MapPin, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const userProfile = {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    joinedDate: '2023-12-01',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    totalSavings: 2340,
    activeGroups: 3,
    referralCode: 'RAJ2024',
  };

  const stats = [
    { label: 'Total Savings', value: `₹${userProfile.totalSavings}`, icon: IndianRupee, color: '#10B981' },
    { label: 'Active Groups', value: userProfile.activeGroups, icon: Users, color: '#8B5CF6' },
    { label: 'Referrals', value: '5', icon: Gift, color: '#F59E0B' },
  ];

  const menuItems = [
    {
      section: 'Account',
      items: [
        { id: 'edit-profile', label: 'Edit Profile', icon: Edit, action: () => router.push('/edit-profile') },
        { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard, action: () => router.push('/payment-methods') },
        { id: 'referrals', label: 'Refer Friends', icon: Gift, action: () => handleReferral() },
      ]
    },
    {
      section: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, hasSwitch: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { id: 'whatsapp', label: 'WhatsApp Notifications', icon: Phone, hasSwitch: true, value: whatsappNotifications, onToggle: setWhatsappNotifications },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield, action: () => router.push('/privacy') },
      ]
    },
    {
      section: 'Support',
      items: [
        { id: 'help', label: 'Help & Support', icon: HelpCircle, action: () => router.push('/help') },
        { id: 'rate', label: 'Rate App', icon: Star, action: () => handleRateApp() },
      ]
    },
    {
      section: 'Account Actions',
      items: [
        { id: 'logout', label: 'Logout', icon: LogOut, action: () => handleLogout(), danger: true },
      ]
    }
  ];

  const handleReferral = () => {
    Alert.alert(
      'Refer Friends',
      `Share your referral code: ${userProfile.referralCode}\n\nBoth you and your friend will get ₹50 when they join their first group!`,
      [
        { text: 'Copy Code', onPress: () => Alert.alert('Copied!', 'Referral code copied to clipboard') },
        { text: 'Share', onPress: () => Alert.alert('Share', 'Opening share options...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for using our app! Redirecting to app store...');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/login') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/wallet')}>
            <Edit size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.profileGradient}
          >
            <Image source={{ uri: userProfile.avatar }} style={styles.profileImage} />
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <View style={styles.profileInfo}>
              <View style={styles.profileInfoItem}>
                <Mail size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>{userProfile.email}</Text>
              </View>
              <View style={styles.profileInfoItem}>
                <Phone size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>{userProfile.phone}</Text>
              </View>
              <View style={styles.profileInfoItem}>
                <MapPin size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>{userProfile.location}</Text>
              </View>
              <View style={styles.profileInfoItem}>
                <Calendar size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>
                  Member since {new Date(userProfile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
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

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, item.danger && styles.dangerItem]}
                onPress={item.action}
                disabled={item.hasSwitch}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuItemIcon, item.danger && styles.dangerIcon]}>
                    <item.icon size={20} color={item.danger ? '#EF4444' : '#6B7280'} />
                  </View>
                  <Text style={[styles.menuItemText, item.danger && styles.dangerText]}>
                    {item.label}
                  </Text>
                </View>
                {item.hasSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                    thumbColor={item.value ? '#FFFFFF' : '#F3F4F6'}
                  />
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
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
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  menuItem: {
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  dangerText: {
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});