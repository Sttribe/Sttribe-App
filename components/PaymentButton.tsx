import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface PaymentButtonProps {
  amount: number;
  description?: string;
  groupId?: string;
  type?: string;
  onSuccess?: () => void;
  style?: any;
}

export default function PaymentButton({ 
  amount, 
  description, 
  groupId, 
  type = 'payment',
  onSuccess,
  style 
}: PaymentButtonProps) {
  const router = useRouter();

  const handlePayment = () => {
    const params = new URLSearchParams({
      amount: amount.toString(),
      type,
      ...(description && { description }),
      ...(groupId && { groupId }),
    });

    router.push(`/payment-gateway?${params.toString()}`);
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handlePayment}>
      <LinearGradient
        colors={['#10B981', '#34D399']}
        style={styles.gradient}
      >
        <CreditCard size={20} color="#FFFFFF" />
        <Text style={styles.text}>Pay ₹{amount}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});