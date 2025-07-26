import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
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
import { LineChart } from 'react-native-chart-kit';

import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';
import { StorageService } from '../../services/storage';

const { width } = Dimensions.get('window');

const MOODS = [
  { id: 'excellent', emoji: '😄', label: 'Excellent', value: 5, color: COLORS.mood.excellent },
  { id: 'good', emoji: '😊', label: 'Good', value: 4, color: COLORS.mood.good },
  { id: 'neutral', emoji: '😐', label: 'Neutral', value: 3, color: COLORS.mood.neutral },
  { id: 'poor', emoji: '😔', label: 'Poor', value: 2, color: COLORS.mood.poor },
  { id: 'terrible', emoji: '😢', label: 'Terrible', value: 1, color: COLORS.mood.terrible },
];

const MoodScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scaleValues = MOODS.reduce((acc, mood) => {
    acc[mood.id] = useSharedValue(1);
    return acc;
  }, {});

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = async () => {
    try {
      const entries = await StorageService.getMoodEntries();
      setMoodEntries(entries);
      setShowChart(entries.length > 1);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    
    // Animate selected mood
    Object.keys(scaleValues).forEach(key => {
      scaleValues[key].value = withSpring(key === mood.id ? 1.2 : 0.9);
    });
    
    setTimeout(() => {
      Object.keys(scaleValues).forEach(key => {
        scaleValues[key].value = withSpring(1);
      });
    }, 200);
  };

  const saveMoodEntry = async () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood', 'Choose how you\'re feeling today');
      return;
    }

    setIsLoading(true);
    try {
      const moodEntry = {
        id: Date.now().toString(),
        mood: selectedMood.id,
        value: selectedMood.value,
        note: note.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };

      await StorageService.saveMoodEntry(moodEntry);
      await StorageService.updateStreak('mood');
      
      Alert.alert(
        'Mood Saved! 🎉',
        'Thank you for checking in with yourself today.',
        [{ text: 'OK', onPress: () => {
          setSelectedMood(null);
          setNote('');
          loadMoodEntries();
        }}]
      );
    } catch (error) {
      console.error('Error saving mood entry:', error);
      Alert.alert('Error', 'Failed to save mood entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    if (moodEntries.length === 0) return null;

    const last7Days = moodEntries
      .slice(0, 7)
      .reverse()
      .map(entry => entry.value);

    const labels = moodEntries
      .slice(0, 7)
      .reverse()
      .map(entry => {
        const date = new Date(entry.timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

    return {
      labels,
      datasets: [{
        data: last7Days,
        color: (opacity = 1) => `rgba(107, 115, 255, ${opacity})`,
        strokeWidth: 3,
      }],
    };
  };

  const getMoodAnimatedStyle = (moodId) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{ scale: scaleValues[moodId].value }],
      };
    });
  };

  const getTodaysMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.find(entry => entry.date === today);
  };

  const todaysMood = getTodaysMood();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <LinearGradient
            colors={COLORS.gradients.mood}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerTitle}>How are you feeling?</Text>
            <Text style={styles.headerSubtitle}>
              Take a moment to check in with yourself
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Today's Mood Status */}
        {todaysMood && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.todayCard}>
            <View style={styles.todayHeader}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={styles.todayTitle}>Today's Check-in Complete</Text>
            </View>
            <View style={styles.todayMood}>
              <Text style={styles.todayMoodEmoji}>
                {MOODS.find(m => m.id === todaysMood.mood)?.emoji}
              </Text>
              <Text style={styles.todayMoodLabel}>
                You felt {MOODS.find(m => m.id === todaysMood.mood)?.label.toLowerCase()}
              </Text>
            </View>
            {todaysMood.note && (
              <Text style={styles.todayNote}>"{todaysMood.note}"</Text>
            )}
          </Animated.View>
        )}

        {/* Mood Selection */}
        {!todaysMood && (
          <Animated.View entering={FadeInUp.delay(300)} style={styles.moodSection}>
            <Text style={styles.sectionTitle}>Select Your Mood</Text>
            <View style={styles.moodGrid}>
              {MOODS.map((mood, index) => (
                <Animated.View
                  key={mood.id}
                  entering={BounceIn.delay(index * 100)}
                  style={getMoodAnimatedStyle(mood.id)}
                >
                  <TouchableOpacity
                    style={[
                      styles.moodButton,
                      selectedMood?.id === mood.id && styles.selectedMoodButton,
                      { borderColor: mood.color }
                    ]}
                    onPress={() => handleMoodSelect(mood)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Note Section */}
            {selectedMood && (
              <Animated.View entering={FadeInUp.delay(100)} style={styles.noteSection}>
                <Text style={styles.noteTitle}>
                  What's on your mind? (Optional)
                </Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Share your thoughts, feelings, or what contributed to your mood today..."
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  numberOfLines={4}
                  value={note}
                  onChangeText={setNote}
                  maxLength={500}
                />
                <Text style={styles.characterCount}>{note.length}/500</Text>
              </Animated.View>
            )}

            {/* Save Button */}
            {selectedMood && (
              <Animated.View entering={FadeInUp.delay(200)} style={styles.saveSection}>
                <TouchableOpacity
                  style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  onPress={saveMoodEntry}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={COLORS.gradients.primary}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons 
                      name="heart" 
                      size={20} 
                      color={COLORS.surface} 
                    />
                    <Text style={styles.saveButtonText}>
                      {isLoading ? 'Saving...' : 'Save Mood'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Mood History Chart */}
        {showChart && (
          <Animated.View entering={FadeInUp.delay(400)} style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Your Mood Journey</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={getChartData()}
                width={width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: COLORS.surface,
                  backgroundGradientFrom: COLORS.surface,
                  backgroundGradientTo: COLORS.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(107, 115, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
                  style: {
                    borderRadius: DIMENSIONS.radius.large,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: COLORS.primary
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartLegendText}>
                📈 Last 7 days • Higher is better
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Recent Entries */}
        {moodEntries.length > 0 && (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Check-ins</Text>
            {moodEntries.slice(0, 5).map((entry, index) => {
              const mood = MOODS.find(m => m.id === entry.mood);
              const date = new Date(entry.timestamp);
              
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyMood}>
                    <Text style={styles.historyEmoji}>{mood?.emoji}</Text>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyLabel}>{mood?.label}</Text>
                      <Text style={styles.historyDate}>
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Text>
                    </View>
                  </View>
                  {entry.note && (
                    <Text style={styles.historyNote} numberOfLines={2}>
                      "{entry.note}"
                    </Text>
                  )}
                </View>
              );
            })}
          </Animated.View>
        )}

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
  headerTitle: {
    fontSize: DIMENSIONS.font.xxlarge,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  headerSubtitle: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.surface,
    opacity: 0.9,
  },
  todayCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.radius.large,
    padding: DIMENSIONS.spacing.md,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  todayTitle: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  todayMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  todayMoodEmoji: {
    fontSize: 32,
    marginRight: DIMENSIONS.spacing.md,
  },
  todayMoodLabel: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.text,
    fontWeight: '600',
  },
  todayNote: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: DIMENSIONS.spacing.sm,
  },
  moodSection: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: DIMENSIONS.spacing.lg,
  },
  moodButton: {
    width: DIMENSIONS.moodButton,
    height: DIMENSIONS.moodButton,
    borderRadius: DIMENSIONS.radius.large,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DIMENSIONS.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedMoodButton: {
    borderWidth: 3,
    elevation: 4,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  moodLabel: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.text,
    fontWeight: '600',
  },
  noteSection: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  noteTitle: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.sm,
  },
  noteInput: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.medium,
    padding: DIMENSIONS.spacing.md,
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 100,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  characterCount: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: DIMENSIONS.spacing.xs,
  },
  saveSection: {
    alignItems: 'center',
  },
  saveButton: {
    borderRadius: DIMENSIONS.radius.large,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DIMENSIONS.spacing.md,
    paddingHorizontal: DIMENSIONS.spacing.xl,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    marginLeft: DIMENSIONS.spacing.sm,
  },
  chartSection: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  chartContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.large,
    padding: DIMENSIONS.spacing.sm,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chart: {
    borderRadius: DIMENSIONS.radius.large,
  },
  chartLegend: {
    alignItems: 'center',
    marginTop: DIMENSIONS.spacing.sm,
  },
  chartLegendText: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.textLight,
  },
  historySection: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.medium,
    padding: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.sm,
    elevation: 1,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: DIMENSIONS.spacing.md,
  },
  historyDetails: {
    flex: 1,
  },
  historyLabel: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyDate: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.textLight,
    marginTop: DIMENSIONS.spacing.xs,
  },
  historyNote: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default MoodScreen;