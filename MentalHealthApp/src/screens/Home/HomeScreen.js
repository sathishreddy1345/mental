import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  BounceIn,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';
import { getRandomQuote, getRandomAffirmation } from '../../constants/quotes';
import { StorageService } from '../../services/storage';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [quote, setQuote] = useState(null);
  const [affirmation, setAffirmation] = useState('');
  const [moodStreak, setMoodStreak] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  const scale = useSharedValue(1);

  useEffect(() => {
    loadHomeData();
    setGreeting(getGreeting());
  }, []);

  const loadHomeData = async () => {
    try {
      const newQuote = getRandomQuote();
      const newAffirmation = getRandomAffirmation();
      const streaks = await StorageService.getStreaks();
      
      setQuote(newQuote);
      setAffirmation(newAffirmation);
      setMoodStreak(streaks.mood?.count || 0);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleFeaturePress = (feature) => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    
    switch (feature) {
      case 'breathing':
        navigation.navigate('Breathing');
        break;
      case 'mood':
        navigation.navigate('Mood');
        break;
      case 'chat':
        navigation.navigate('Chat');
        break;
      case 'music':
        navigation.navigate('Music');
        break;
      default:
        break;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const FeatureCard = ({ title, icon, gradient, onPress, description }) => (
    <Animated.View
      entering={BounceIn.delay(Math.random() * 300)}
      style={[animatedStyle]}
    >
      <TouchableOpacity
        style={styles.featureCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradient}
          style={styles.featureGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={icon} size={DIMENSIONS.icon.large} color={COLORS.surface} />
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const WellnessCard = ({ title, children, icon }) => (
    <Animated.View 
      entering={FadeInUp.delay(200)}
      style={styles.wellnessCard}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={DIMENSIONS.icon.medium} color={COLORS.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <LinearGradient
            colors={COLORS.gradients.primary}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.greeting}>{greeting} 🌟</Text>
            <Text style={styles.welcomeText}>How are you feeling today?</Text>
            
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={20} color={COLORS.surface} />
              <Text style={styles.streakText}>
                {moodStreak} day{moodStreak !== 1 ? 's' : ''} streak
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness Tools</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              title="Breathe"
              icon="leaf-outline"
              gradient={COLORS.gradients.calming}
              description="Guided breathing exercises"
              onPress={() => handleFeaturePress('breathing')}
            />
            <FeatureCard
              title="Mood"
              icon="happy-outline"
              gradient={COLORS.gradients.mood}
              description="Track your emotions"
              onPress={() => handleFeaturePress('mood')}
            />
            <FeatureCard
              title="Chat"
              icon="chatbubble-outline"
              gradient={COLORS.gradients.primary}
              description="AI support companion"
              onPress={() => handleFeaturePress('chat')}
            />
            <FeatureCard
              title="Music"
              icon="musical-notes-outline"
              gradient={COLORS.gradients.sunset}
              description="Calming soundscapes"
              onPress={() => handleFeaturePress('music')}
            />
          </View>
        </Animated.View>

        {/* Daily Quote */}
        {quote && (
          <WellnessCard title="Daily Inspiration" icon="bulb-outline">
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </View>
          </WellnessCard>
        )}

        {/* Daily Affirmation */}
        <WellnessCard title="Daily Affirmation" icon="heart-outline">
          <View style={styles.affirmationContainer}>
            <Text style={styles.affirmationText}>{affirmation}</Text>
          </View>
        </WellnessCard>

        {/* Quick Wellness Tips */}
        <WellnessCard title="Wellness Reminders" icon="checkmark-circle-outline">
          <View style={styles.tipsContainer}>
            {[
              'Take 5 deep breaths',
              'Drink a glass of water',
              'Step outside for fresh air',
              'Practice gratitude',
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons 
                  name="water-outline" 
                  size={16} 
                  color={COLORS.primary} 
                />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </WellnessCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  headerGradient: {
    padding: DIMENSIONS.spacing.lg,
    paddingTop: DIMENSIONS.spacing.xl,
    borderBottomLeftRadius: DIMENSIONS.radius.xlarge,
    borderBottomRightRadius: DIMENSIONS.radius.xlarge,
  },
  greeting: {
    fontSize: DIMENSIONS.font.xxlarge,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  welcomeText: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.surface,
    opacity: 0.9,
    marginBottom: DIMENSIONS.spacing.md,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
    borderRadius: DIMENSIONS.radius.large,
    alignSelf: 'flex-start',
  },
  streakText: {
    color: COLORS.surface,
    fontWeight: '600',
    marginLeft: DIMENSIONS.spacing.sm,
  },
  section: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - DIMENSIONS.spacing.md * 3) / 2,
    marginBottom: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.large,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureGradient: {
    padding: DIMENSIONS.spacing.md,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    color: COLORS.surface,
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    marginTop: DIMENSIONS.spacing.sm,
  },
  featureDescription: {
    color: COLORS.surface,
    fontSize: DIMENSIONS.font.tiny,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: DIMENSIONS.spacing.xs,
  },
  wellnessCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.large,
    padding: DIMENSIONS.spacing.md,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  cardTitle: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  quoteContainer: {
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  quoteText: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  quoteAuthor: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.textLight,
    textAlign: 'right',
    fontWeight: '600',
  },
  affirmationContainer: {
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  affirmationText: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  tipsContainer: {
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  tipText: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.textSecondary,
    marginLeft: DIMENSIONS.spacing.sm,
  },
});

export default HomeScreen;