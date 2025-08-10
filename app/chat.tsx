import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Send,
  Plus,
  Smile,
  Image as ImageIcon,
  Video,
  Star,
  Heart,
  ThumbsUp,
  Users,
  Bookmark,
  Share
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'text',
      content: 'Hey everyone! Welcome to Netflix Squad 🎬',
      sender: 'You',
      senderId: 1,
      timestamp: '2024-01-10T10:00:00Z',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
    },
    {
      id: 2,
      type: 'text',
      content: 'Thanks for adding me! Excited to save on Netflix costs 😊',
      sender: 'Priya Sharma',
      senderId: 2,
      timestamp: '2024-01-10T10:05:00Z',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60',
    },
    {
      id: 3,
      type: 'recommendation',
      content: {
        title: 'Stranger Things 4',
        type: 'TV Series',
        rating: 4.8,
        genre: 'Sci-Fi, Horror',
        platform: 'Netflix',
        image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'The fourth season of the supernatural drama series continues the story in the 1980s.',
      },
      sender: 'Amit Patel',
      senderId: 3,
      timestamp: '2024-01-10T10:15:00Z',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=60',
    },
    {
      id: 4,
      type: 'text',
      content: 'Great recommendation! I\'ve been wanting to watch this 👍',
      sender: 'Sarah Khan',
      senderId: 4,
      timestamp: '2024-01-10T10:20:00Z',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60',
    },
    {
      id: 5,
      type: 'system',
      content: 'Payment reminder: Next billing date is January 15, 2024. Your share: ₹49.75',
      timestamp: '2024-01-10T12:00:00Z',
    },
  ]);

  const groupData = {
    name: 'Netflix Squad',
    memberCount: 4,
    platform: 'Netflix',
  };

  const quickRecommendations = [
    {
      title: 'Wednesday',
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.9,
    },
    {
      title: 'The Crown',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.7,
    },
    {
      title: 'Money Heist',
      image: 'https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.8,
    },
  ];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'text',
        content: message,
        sender: 'You',
        senderId: 1,
        timestamp: new Date().toISOString(),
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const sendRecommendation = (recommendation) => {
    const newMessage = {
      id: messages.length + 1,
      type: 'recommendation',
      content: {
        title: recommendation.title,
        type: 'Movie/TV Series',
        rating: recommendation.rating,
        genre: 'Drama',
        platform: groupData.platform,
        image: recommendation.image,
        description: `Check out this amazing content on ${groupData.platform}!`,
      },
      sender: 'You',
      senderId: 1,
      timestamp: new Date().toISOString(),
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
    };
    setMessages([...messages, newMessage]);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = (msg) => {
    if (msg.type === 'system') {
      return (
        <View key={msg.id} style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{msg.content}</Text>
          <Text style={styles.systemMessageTime}>{formatTime(msg.timestamp)}</Text>
        </View>
      );
    }

    if (msg.type === 'recommendation') {
      const isOwnMessage = msg.senderId === 1;
      return (
        <View key={msg.id} style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
          {!isOwnMessage && (
            <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
          )}
          <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
            {!isOwnMessage && (
              <Text style={styles.senderName}>{msg.sender}</Text>
            )}
            <View style={styles.recommendationCard}>
              <Image source={{ uri: msg.content.image }} style={styles.recommendationImage} />
              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationTitle}>{msg.content.title}</Text>
                <Text style={styles.recommendationType}>{msg.content.type} • {msg.content.genre}</Text>
                <View style={styles.recommendationRating}>
                  <Star size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{msg.content.rating}</Text>
                  <Text style={styles.platformText}>{msg.content.platform}</Text>
                </View>
                <Text style={styles.recommendationDescription}>{msg.content.description}</Text>
                <View style={styles.recommendationActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Heart size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Bookmark size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
          </View>
          {isOwnMessage && (
            <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
          )}
        </View>
      );
    }

    // Regular text message
    const isOwnMessage = msg.senderId === 1;
    return (
      <View key={msg.id} style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        {!isOwnMessage && (
          <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          {!isOwnMessage && (
            <Text style={styles.senderName}>{msg.sender}</Text>
          )}
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {msg.content}
          </Text>
          <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
        </View>
        {isOwnMessage && (
          <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{groupData.name}</Text>
            <View style={styles.headerSubtitle}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.memberCount}>{groupData.memberCount} members</Text>
              <Text style={styles.platform}>• {groupData.platform}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Video size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Quick Recommendations */}
        <View style={styles.quickRecommendations}>
          <Text style={styles.quickRecommendationsTitle}>Quick Recommendations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickRecommendations.map((recommendation, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickRecommendationCard}
                onPress={() => sendRecommendation(recommendation)}
              >
                <Image source={{ uri: recommendation.image }} style={styles.quickRecommendationImage} />
                <Text style={styles.quickRecommendationTitle}>{recommendation.title}</Text>
                <View style={styles.quickRecommendationRating}>
                  <Star size={10} color="#F59E0B" />
                  <Text style={styles.quickRatingText}>{recommendation.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Plus size={20} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Smile size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Send size={18} color={message.trim() ? "#FFFFFF" : "#9CA3AF"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  memberCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  platform: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessageBubble: {
    backgroundColor: '#8B5CF6',
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginHorizontal: 40,
  },
  systemMessageText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  systemMessageTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  recommendationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  recommendationImage: {
    width: '100%',
    height: 120,
  },
  recommendationInfo: {
    padding: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  recommendationType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  recommendationRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  platformText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  recommendationDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  recommendationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 8,
  },
  quickRecommendations: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickRecommendationsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  quickRecommendationCard: {
    width: 80,
    marginRight: 12,
    alignItems: 'center',
  },
  quickRecommendationImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickRecommendationTitle: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickRecommendationRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickRatingText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
    marginLeft: 2,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginRight: 8,
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#8B5CF6',
  },
});