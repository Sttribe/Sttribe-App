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
import { ArrowLeft, CreditCard, Shield, CircleCheck as CheckCircle, IndianRupee, Users, Calendar, Star } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PaymentButton from '@/components/PaymentButton';
import { sendWhatsAppNotification, getNotificationTemplate } from '@/components/WhatsAppNotification';

export default function SubscriptionPurchaseScreen() {
  const router = useRouter();
  const { platform, plan, amount, groupId } = useLocalSearchParams();
  const [processing, setProcessing] = useState(false);

  const platformData = {
    Netflix: {
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#E50914',
      features: ['HD/4K Streaming', 'Multiple Devices', 'Offline Downloads', 'No Ads'],
    },
    'Disney+ Hotstar': {
      image: 'https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#1E40AF',
      features: ['Live Sports', 'Disney Content', 'Marvel & Star Wars', 'Regional Content'],
    },
    'Amazon Prime': {
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#00A8E1',
      features: ['Prime Video', 'Free Shipping', 'Prime Music', 'Prime Reading'],
    },
  };

  const currentPlatform = platformData[platform as string] || platformData.Netflix;

  const handlePurchase = async () => {
    setProcessing(true);
    
    try {
      // Simulate subscription purchase
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Send WhatsApp notifications to group members
      const message = getNotificationTemplate('subscription_purchased', {
        platform: platform as string,
        groupName: 'Your Group', // This would come from actual group data
      });
      
      // In a real app, you would get the actual group members
      const groupMembers = [
        { phone: '+919876543210', name: 'Member 1' },
        { phone: '+919876543211', name: 'Member 2' },
      ];
      
      // Send notifications
      for (const member of groupMembers) {
        await sendWhatsAppNotification({
          phone: member.phone,
          message,
          type: 'subscription_purchased',
        });
      }
      
      setProcessing(false);
      
      Alert.alert(
        'Subscription Activated!',
        `${platform} subscription has been successfully activated. All group members have been notified via WhatsApp.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace(`/group-details?id=${groupId}`),
          }
        ]
      );
    } catch (error) {
      setProcessing(false);
      Alert.alert('Error', 'Failed to activate subscription. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchase Subscription</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Platform Card */}
        <View style={styles.platformCard}>
          <LinearGradient
            colors={[currentPlatform.color + '20', currentPlatform.color + '10']}
            style={styles.platformGradient}
          >
            <Image source={{ uri: currentPlatform.image }} style={styles.platformImage} />
            <Text style={styles.platformName}>{platform}</Text>
            <Text style={styles.planName}>{plan} Plan</Text>
            <View style={styles.priceContainer}>
              <IndianRupee size={24} color={currentPlatform.color} />
              <Text style={[styles.priceText, { color: currentPlatform.color }]}>
                ₹{amount}
              </Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {currentPlatform.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Group Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Benefits</Text>
          <View style={styles.benefitCard}>
            <View style={styles.benefitItem}>
              <Users size={20} color="#8B5CF6" />
              <Text style={styles.benefitText}>Shared among group members</Text>
            </View>
            <View style={styles.benefitItem}>
              <IndianRupee size={20} color="#10B981" />
              <Text style={styles.benefitText}>Cost split automatically</Text>
            </View>
            <View style={styles.benefitItem}>
              <Calendar size={20} color="#F59E0B" />
              <Text style={styles.benefitText}>Auto-renewal management</Text>
            </View>
            <View style={styles.benefitItem}>
              <Shield size={20} color="#EF4444" />
              <Text style={styles.benefitText}>Secure credential sharing</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Subscription will be activated immediately after payment{'\n'}
            • Login credentials will be shared with group members{'\n'}
            • Auto-renewal can be managed from group settings{'\n'}
            • Refunds subject to platform policies{'\n'}
            • Group admin is responsible for subscription management
          </Text>
        </View>

        {/* Purchase Button */}
        <View style={styles.purchaseContainer}>
          <TouchableOpacity
            style={[styles.purchaseButton, processing && styles.purchaseButtonDisabled]}
            onPress={handlePurchase}
            disabled={processing}
          >
            <LinearGradient
              colors={processing ? ['#9CA3AF', '#9CA3AF'] : [currentPlatform.color, currentPlatform.color + 'CC']}
              style={styles.purchaseButtonGradient}
            >
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.purchaseButtonText}>
                {processing ? 'Activating...' : `Purchase for ₹${amount}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.securityText}>
            Secure payment powered by Razorpay. Your data is encrypted and protected.
          </Text>
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
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  platformCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  platformGradient: {
    padding: 24,
    alignItems: 'center',
  },
  platformImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  platformName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  pricePeriod: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  benefitCard: {
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
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 12,
  },
  termsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  termsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  purchaseContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  purchaseButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
    textAlign: 'center',
  },
});