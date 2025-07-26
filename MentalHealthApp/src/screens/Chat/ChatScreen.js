import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  BounceIn,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';
import { StorageService } from '../../services/storage';

const STARTER_MESSAGES = [
  "How are you feeling today?",
  "I'd like to talk about stress",
  "I'm feeling anxious",
  "Help me with sleep issues",
  "I need motivation",
  "I'm having a hard time",
];

const SOS_KEYWORDS = [
  'emergency', 'crisis', 'suicide', 'kill myself', 'end it all', 
  'hopeless', 'no point', 'better off dead', 'hurt myself', 'self harm'
];

const MENTAL_HEALTH_RESPONSES = {
  anxiety: [
    "I understand you're feeling anxious. Remember, anxiety is temporary and you can get through this. Try taking 5 deep breaths with me.",
    "Anxiety can feel overwhelming, but you're stronger than you know. What's one small thing that usually helps you feel calmer?",
    "It's okay to feel anxious sometimes. Let's focus on what's in your control right now. Can you name 3 things you can see around you?"
  ],
  stress: [
    "Stress is your body's way of responding to challenges. You're not alone in feeling this way. What's causing you the most stress right now?",
    "When stress feels overwhelming, remember to take it one moment at a time. Have you tried any relaxation techniques today?",
    "I hear that you're stressed. That takes courage to share. What's one thing you could do today to be kind to yourself?"
  ],
  sadness: [
    "It's completely okay to feel sad. Your emotions are valid, and I'm here to listen. Would you like to talk about what's on your mind?",
    "Sadness is a natural part of the human experience. You don't have to go through this alone. What brings you even a tiny bit of comfort?",
    "Thank you for trusting me with your feelings. Sadness can be heavy, but it's also temporary. What's one thing you're grateful for today?"
  ],
  depression: [
    "I'm really glad you reached out. Depression can make everything feel harder, but seeking support shows incredible strength. How are you taking care of yourself today?",
    "Depression can feel isolating, but you're not alone. Every small step counts, even just talking to me right now. What's one tiny thing you accomplished today?",
    "Your feelings matter, and so do you. Depression is treatable, and there are people who want to help. Have you been able to connect with a mental health professional?"
  ],
  sleep: [
    "Sleep issues can really affect how we feel during the day. A good bedtime routine might help. What does your evening usually look like?",
    "Quality sleep is so important for mental health. Have you tried any relaxation techniques before bed, like gentle breathing or meditation?",
    "Sleep troubles are more common than you might think. Creating a calm environment and limiting screen time before bed can help. What time do you usually try to sleep?"
  ],
  motivation: [
    "Sometimes motivation feels hard to find, and that's completely normal. What's one small thing you could do today that might make you feel a little bit accomplished?",
    "Motivation often comes after action, not before. What's the smallest possible step you could take toward something that matters to you?",
    "You've overcome challenges before, even if it doesn't feel that way right now. What gave you strength in the past that you might be able to draw on today?"
  ],
  positive: [
    "I'm so glad to hear you're feeling good! What's contributing to these positive feelings?",
    "That's wonderful! Celebrating the good moments is important. What's been the highlight of your day?",
    "Your positive energy is contagious! What advice would you give to someone who might be struggling today?"
  ],
  general: [
    "Thank you for sharing that with me. I'm here to listen and support you. What would be most helpful for you right now?",
    "I appreciate you opening up. Your feelings are valid, and it's brave to talk about them. How can I best support you today?",
    "Everyone deserves to feel heard and supported. I'm glad you're here. What's on your mind?",
    "Taking time to check in with yourself is really important. What's one thing you need to hear right now?"
  ]
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    loadChatHistory();
    addBotMessage("Hello! I'm here to support you on your mental health journey. How are you feeling today? 💚");
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await StorageService.getChatHistory();
      if (history.length > 0) {
        setMessages(history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const addMessage = async (message) => {
    const newMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    await StorageService.saveChatMessage(newMessage);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addBotMessage = (text, isEmergency = false) => {
    addMessage({
      text,
      isBot: true,
      isEmergency,
    });
  };

  const addUserMessage = (text) => {
    addMessage({
      text,
      isBot: false,
    });
  };

  const detectMood = (text) => {
    const lowerText = text.toLowerCase();
    
    // Check for SOS keywords first
    const hasSOSKeywords = SOS_KEYWORDS.some(keyword => 
      lowerText.includes(keyword)
    );
    
    if (hasSOSKeywords) {
      return 'emergency';
    }
    
    // Mood detection
    if (lowerText.includes('anxious') || lowerText.includes('anxiety') || lowerText.includes('worried') || lowerText.includes('panic')) {
      return 'anxiety';
    }
    if (lowerText.includes('stressed') || lowerText.includes('stress') || lowerText.includes('overwhelmed') || lowerText.includes('pressure')) {
      return 'stress';
    }
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('upset') || lowerText.includes('crying')) {
      return 'sadness';
    }
    if (lowerText.includes('depressed') || lowerText.includes('depression') || lowerText.includes('hopeless') || lowerText.includes('empty')) {
      return 'depression';
    }
    if (lowerText.includes('sleep') || lowerText.includes('insomnia') || lowerText.includes('tired') || lowerText.includes('exhausted')) {
      return 'sleep';
    }
    if (lowerText.includes('motivation') || lowerText.includes('lazy') || lowerText.includes('procrastinate') || lowerText.includes('unmotivated')) {
      return 'motivation';
    }
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('good') || lowerText.includes('excited') || lowerText.includes('wonderful')) {
      return 'positive';
    }
    
    return 'general';
  };

  const generateResponse = (mood) => {
    const responses = MENTAL_HEALTH_RESPONSES[mood] || MENTAL_HEALTH_RESPONSES.general;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    addUserMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    // Detect mood and check for emergency
    const mood = detectMood(userMessage);
    
    if (mood === 'emergency') {
      setShowSOS(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(
          "I'm concerned about what you've shared. You matter, and there are people who want to help. Would you like me to show you some immediate support resources?",
          true
        );
      }, 1000);
      return;
    }

    // Generate appropriate response
    setTimeout(() => {
      setIsTyping(false);
      const response = generateResponse(mood);
      addBotMessage(response);
      
      // Add follow-up suggestions based on mood
      setTimeout(() => {
        addFollowUpSuggestions(mood);
      }, 1500);
    }, 1000 + Math.random() * 1000); // Random delay to simulate thinking
  };

  const addFollowUpSuggestions = (mood) => {
    if (mood === 'anxiety' || mood === 'stress') {
      addBotMessage("Would you like to try a breathing exercise? I can guide you through one, or you can check out the Breathing tab in the app.");
    } else if (mood === 'sadness' || mood === 'depression') {
      addBotMessage("Remember, it's okay to not be okay sometimes. Have you been able to do something nice for yourself today?");
    } else if (mood === 'sleep') {
      addBotMessage("Creating a calming bedtime routine can really help. Would you like some tips for better sleep?");
    }
  };

  const handleStarterMessage = (message) => {
    setInputText(message);
  };

  const handleSOSAction = (action) => {
    setShowSOS(false);
    
    if (action === 'resources') {
      addBotMessage("Here are some immediate support resources:\n\n🆘 National Suicide Prevention Lifeline: 988\n💬 Crisis Text Line: Text HOME to 741741\n🌐 International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/");
    } else if (action === 'breathing') {
      addBotMessage("Let's try a quick calming exercise. Take a deep breath in for 4 counts... hold for 4... and slowly exhale for 6. You're doing great. 🌸");
    } else if (action === 'call') {
      Alert.alert(
        "Emergency Support",
        "I'm going to help you connect with emergency support. Your safety matters.",
        [
          { text: "Call 911", onPress: () => {} },
          { text: "Call Crisis Line", onPress: () => {} },
          { text: "Later", style: "cancel" }
        ]
      );
    }
  };

  const MessageBubble = ({ message, index }) => {
    const isBot = message.isBot;
    const AnimationComponent = isBot ? FadeInLeft : FadeInRight;
    
    return (
      <Animated.View
        entering={AnimationComponent.delay(index * 100)}
        style={[
          styles.messageContainer,
          isBot ? styles.botMessageContainer : styles.userMessageContainer
        ]}
      >
        <View style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
          message.isEmergency && styles.emergencyBubble
        ]}>
          <Text style={[
            styles.messageText,
            isBot ? styles.botText : styles.userText,
            message.isEmergency && styles.emergencyText
          ]}>
            {message.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={COLORS.gradients.primary}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.botAvatar}>
                <Ionicons name="heart" size={24} color={COLORS.surface} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Mental Health Companion</Text>
                <Text style={styles.headerSubtitle}>
                  {isTyping ? 'Typing...' : 'Here to support you'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && (
            <View style={styles.starterContainer}>
              <Text style={styles.starterTitle}>Start a conversation</Text>
              <View style={styles.starterMessages}>
                {STARTER_MESSAGES.map((message, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.starterMessage}
                    onPress={() => handleStarterMessage(message)}
                  >
                    <Text style={styles.starterMessageText}>{message}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
          
          {isTyping && (
            <Animated.View entering={FadeInLeft} style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* SOS Panel */}
        {showSOS && (
          <Animated.View entering={BounceIn} style={styles.sosPanel}>
            <LinearGradient
              colors={[COLORS.sos.emergency, COLORS.sos.emergencyLight]}
              style={styles.sosPanelGradient}
            >
              <Text style={styles.sosTitle}>🆘 Immediate Support</Text>
              <Text style={styles.sosText}>
                You're not alone. Help is available right now.
              </Text>
              <View style={styles.sosButtons}>
                <TouchableOpacity
                  style={styles.sosButton}
                  onPress={() => handleSOSAction('resources')}
                >
                  <Ionicons name="call" size={20} color={COLORS.surface} />
                  <Text style={styles.sosButtonText}>Crisis Lines</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sosButton}
                  onPress={() => handleSOSAction('breathing')}
                >
                  <Ionicons name="leaf" size={20} color={COLORS.surface} />
                  <Text style={styles.sosButtonText}>Calm Down</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sosButton}
                  onPress={() => handleSOSAction('call')}
                >
                  <Ionicons name="medical" size={20} color={COLORS.surface} />
                  <Text style={styles.sosButtonText}>Emergency</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Share what's on your mind..."
              placeholderTextColor={COLORS.textLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={inputText.trim() ? COLORS.gradients.primary : [COLORS.textLight, COLORS.textLight]}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={20} color={COLORS.surface} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    marginBottom: DIMENSIONS.spacing.sm,
  },
  headerGradient: {
    paddingTop: DIMENSIONS.spacing.md,
    paddingBottom: DIMENSIONS.spacing.lg,
    paddingHorizontal: DIMENSIONS.spacing.md,
    borderBottomLeftRadius: DIMENSIONS.radius.xlarge,
    borderBottomRightRadius: DIMENSIONS.radius.xlarge,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DIMENSIONS.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  headerSubtitle: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.surface,
    opacity: 0.9,
    marginTop: DIMENSIONS.spacing.xs,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.spacing.md,
  },
  starterContainer: {
    alignItems: 'center',
    paddingVertical: DIMENSIONS.spacing.xl,
  },
  starterTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  starterMessages: {
    width: '100%',
  },
  starterMessage: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.large,
    padding: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.sm,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  starterMessageText: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  messageContainer: {
    marginBottom: DIMENSIONS.spacing.md,
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.large,
  },
  botBubble: {
    backgroundColor: COLORS.chat.bot,
    borderBottomLeftRadius: DIMENSIONS.radius.small,
  },
  userBubble: {
    backgroundColor: COLORS.chat.user,
    borderBottomRightRadius: DIMENSIONS.radius.small,
  },
  emergencyBubble: {
    backgroundColor: COLORS.sos.emergencyLight,
    borderColor: COLORS.sos.emergency,
    borderWidth: 1,
  },
  messageText: {
    fontSize: DIMENSIONS.font.medium,
    lineHeight: 20,
  },
  botText: {
    color: COLORS.chat.botText,
  },
  userText: {
    color: COLORS.chat.userText,
  },
  emergencyText: {
    color: COLORS.sos.emergency,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.textLight,
    marginTop: DIMENSIONS.spacing.xs,
    marginHorizontal: DIMENSIONS.spacing.sm,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: DIMENSIONS.spacing.md,
  },
  typingBubble: {
    backgroundColor: COLORS.chat.bot,
    borderRadius: DIMENSIONS.radius.large,
    borderBottomLeftRadius: DIMENSIONS.radius.small,
    padding: DIMENSIONS.spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
    marginHorizontal: 2,
  },
  sosPanel: {
    margin: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.large,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sosPanelGradient: {
    padding: DIMENSIONS.spacing.lg,
  },
  sosTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  sosText: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: DIMENSIONS.spacing.lg,
    opacity: 0.9,
  },
  sosButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sosButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: DIMENSIONS.radius.medium,
    padding: DIMENSIONS.spacing.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  sosButtonText: {
    color: COLORS.surface,
    fontSize: DIMENSIONS.font.tiny,
    fontWeight: '600',
    marginTop: DIMENSIONS.spacing.xs,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: DIMENSIONS.spacing.md,
    paddingHorizontal: DIMENSIONS.spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.radius.large,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.text,
    maxHeight: 100,
    marginRight: DIMENSIONS.spacing.sm,
  },
  sendButton: {
    borderRadius: DIMENSIONS.radius.round,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;