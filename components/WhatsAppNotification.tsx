import React from 'react';
import { Alert } from 'react-native';

interface WhatsAppNotificationProps {
  phone: string;
  message: string;
  type: string;
}

export const sendWhatsAppNotification = async ({ phone, message, type }: WhatsAppNotificationProps) => {
  try {
    const response = await fetch('/api/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        message,
        type,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('WhatsApp notification sent successfully');
      return true;
    } else {
      console.error('Failed to send WhatsApp notification:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};

export const getNotificationTemplate = (type: string, variables: Record<string, string>) => {
  const templates = {
    group_invite: `🎬 You've been invited to join '${variables.groupName}' on OTT Share! Split costs and enjoy ${variables.platform} together. Join now: ${variables.inviteLink}`,
    payment_reminder: `💳 Payment reminder for '${variables.groupName}'. Your share: ₹${variables.amount}. Due date: ${variables.dueDate}. Pay now: ${variables.paymentLink}`,
    payment_success: `✅ Payment successful! ₹${variables.amount} paid for '${variables.groupName}'. Transaction ID: ${variables.transactionId}`,
    group_created: `🎉 Group '${variables.groupName}' created successfully! Share this code with friends: ${variables.groupCode}`,
    subscription_purchased: `🎬 ${variables.platform} subscription activated for '${variables.groupName}'! Login details will be shared separately. Enjoy streaming!`,
  };

  return templates[type] || '';
};

export const notifyGroupMembers = async (members: any[], message: string, type: string) => {
  const notifications = members.map(member => 
    sendWhatsAppNotification({
      phone: member.phone || member.email, // Fallback to email if phone not available
      message,
      type,
    })
  );

  try {
    await Promise.all(notifications);
    Alert.alert('Success', 'All members have been notified via WhatsApp');
  } catch (error) {
    Alert.alert('Warning', 'Some notifications may not have been delivered');
  }
};