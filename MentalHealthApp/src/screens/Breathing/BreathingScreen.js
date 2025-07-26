import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';

const { width, height } = Dimensions.get('window');

const BREATHING_EXERCISES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Inhale for 4, hold for 4, exhale for 4, hold for 4',
    icon: 'square-outline',
    pattern: [4, 4, 4, 4], // inhale, hold, exhale, hold
    steps: ['Inhale', 'Hold', 'Exhale', 'Hold'],
    color: COLORS.breathing.inhale,
    gradient: COLORS.gradients.ocean,
    benefits: 'Reduces stress and anxiety, improves focus',
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    icon: 'moon-outline',
    pattern: [4, 7, 8, 0],
    steps: ['Inhale', 'Hold', 'Exhale', ''],
    color: COLORS.breathing.exhale,
    gradient: COLORS.gradients.calming,
    benefits: 'Promotes sleep and relaxation',
  },
  {
    id: 'calm',
    name: 'Calm Breathing',
    description: 'Inhale for 6, exhale for 6',
    icon: 'leaf-outline',
    pattern: [6, 0, 6, 0],
    steps: ['Inhale', '', 'Exhale', ''],
    color: COLORS.breathing.hold,
    gradient: COLORS.gradients.primary,
    benefits: 'General stress relief and mindfulness',
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Inhale for 3, hold for 3, exhale for 3',
    icon: 'flash-outline',
    pattern: [3, 3, 3, 0],
    steps: ['Inhale', 'Hold', 'Exhale', ''],
    color: COLORS.secondary,
    gradient: COLORS.gradients.sunset,
    benefits: 'Increases alertness and energy',
  },
];

const BreathingScreen = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const outerRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(scale.value, [0.8, 1.2], [1, 1.1]) }],
      opacity: interpolate(opacity.value, [0.3, 1], [0.1, 0.3]),
    };
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setCurrentStep(0);
    setCountdown(exercise.pattern[0]);
    setCycleCount(0);
    startTimeRef.current = Date.now();
    
    startBreathingAnimation(exercise);
    startTimer(exercise);
  };

  const stopExercise = () => {
    setIsActive(false);
    setSelectedExercise(null);
    setCurrentStep(0);
    setCountdown(0);
    setCycleCount(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    cancelAnimation(scale);
    cancelAnimation(opacity);
    
    scale.value = withTiming(1, { duration: 500 });
    opacity.value = withTiming(0.3, { duration: 500 });
    
    // Calculate total session time
    if (startTimeRef.current) {
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTotalDuration(sessionTime);
    }
  };

  const startBreathingAnimation = (exercise) => {
    const totalCycleDuration = exercise.pattern.reduce((sum, duration) => sum + duration, 0) * 1000;
    
    scale.value = 1;
    opacity.value = 0.3;
    
    const animateStep = (stepIndex) => {
      const stepDuration = exercise.pattern[stepIndex] * 1000;
      
      if (stepIndex === 0 || stepIndex === 2) { // Inhale or Exhale
        const targetScale = stepIndex === 0 ? 1.3 : 0.8;
        const targetOpacity = stepIndex === 0 ? 1 : 0.3;
        
        scale.value = withTiming(targetScale, {
          duration: stepDuration,
          easing: Easing.inOut(Easing.ease),
        });
        
        opacity.value = withTiming(targetOpacity, {
          duration: stepDuration,
          easing: Easing.inOut(Easing.ease),
        });
      } else { // Hold
        // Keep current values during hold
      }
    };

    const runCycle = () => {
      exercise.pattern.forEach((duration, index) => {
        if (duration > 0) {
          setTimeout(() => {
            animateStep(index);
          }, exercise.pattern.slice(0, index).reduce((sum, d) => sum + d, 0) * 1000);
        }
      });
    };

    runCycle();
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: exercise.pattern[0] * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.3, { duration: exercise.pattern[1] * 1000 }),
        withTiming(0.8, { duration: exercise.pattern[2] * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: exercise.pattern[3] * 1000 }),
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: exercise.pattern[0] * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: exercise.pattern[1] * 1000 }),
        withTiming(0.3, { duration: exercise.pattern[2] * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: exercise.pattern[3] * 1000 }),
      ),
      -1,
      false
    );
  };

  const startTimer = (exercise) => {
    let stepIndex = 0;
    let timeLeft = exercise.pattern[stepIndex];
    let cycles = 0;

    intervalRef.current = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft === 0) {
        // Haptic feedback on step change
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Move to next step
        stepIndex = (stepIndex + 1) % exercise.pattern.length;
        
        // Skip steps with 0 duration
        while (exercise.pattern[stepIndex] === 0 && stepIndex < exercise.pattern.length) {
          stepIndex = (stepIndex + 1) % exercise.pattern.length;
        }
        
        setCurrentStep(stepIndex);
        timeLeft = exercise.pattern[stepIndex];
        
        // If we completed a full cycle
        if (stepIndex === 0) {
          cycles++;
          setCycleCount(cycles);
          
          // Stronger haptic feedback on cycle completion
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    }, 1000);
  };

  const ExerciseCard = ({ exercise }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => !isActive && startExercise(exercise)}
      disabled={isActive}
    >
      <LinearGradient
        colors={exercise.gradient}
        style={styles.exerciseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.exerciseHeader}>
          <Ionicons name={exercise.icon} size={32} color={COLORS.surface} />
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          </View>
        </View>
        <Text style={styles.exerciseBenefits}>{exercise.benefits}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const BreathingCircle = () => (
    <View style={styles.circleContainer}>
      {/* Outer rings */}
      <Animated.View style={[styles.outerRing, outerRingStyle]}>
        <LinearGradient
          colors={selectedExercise?.gradient || COLORS.gradients.primary}
          style={styles.ringGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View style={[styles.middleRing, animatedStyle]}>
        <LinearGradient
          colors={selectedExercise?.gradient || COLORS.gradients.primary}
          style={styles.ringGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Center circle with text */}
      <View style={styles.centerCircle}>
        <Text style={styles.stepText}>
          {selectedExercise?.steps[currentStep] || 'Breathe'}
        </Text>
        <Text style={styles.countdownText}>{countdown}</Text>
        <Text style={styles.cycleText}>Cycle {cycleCount}</Text>
      </View>
    </View>
  );

  if (selectedExercise && isActive) {
    return (
      <SafeAreaView style={styles.activeContainer}>
        <LinearGradient
          colors={selectedExercise.gradient}
          style={styles.activeBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.activeHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={stopExercise}
            >
              <Ionicons name="close" size={24} color={COLORS.surface} />
            </TouchableOpacity>
            <Text style={styles.activeTitle}>{selectedExercise.name}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.breathingArea}>
            <BreathingCircle />
          </View>

          <View style={styles.controlsArea}>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopExercise}
            >
              <Ionicons name="stop" size={32} color={COLORS.surface} />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={COLORS.gradients.calming}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerTitle}>Breathing Exercises</Text>
            <Text style={styles.headerSubtitle}>
              Find your calm with guided breathing
            </Text>
          </LinearGradient>
        </View>

        {/* Success Message */}
        {totalDuration > 0 && (
          <View style={styles.successCard}>
            <View style={styles.successHeader}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={styles.successTitle}>Great session! 🌟</Text>
            </View>
            <Text style={styles.successText}>
              You practiced for {Math.floor(totalDuration / 60)}m {totalDuration % 60}s
            </Text>
          </View>
        )}

        {/* Exercise Selection */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Choose Your Practice</Text>
          {BREATHING_EXERCISES.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Breathing Tips</Text>
          <View style={styles.tipsContainer}>
            {[
              'Find a comfortable, quiet place to sit',
              'Close your eyes or soften your gaze',
              'Focus on the rhythm of your breath',
              'Let thoughts pass without judgment',
              'Start with 3-5 cycles, gradually increase',
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="leaf" size={16} color={COLORS.primary} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

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
  activeContainer: {
    flex: 1,
  },
  activeBackground: {
    flex: 1,
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
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingTop: DIMENSIONS.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  breathingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  outerRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
  },
  middleRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
  },
  ringGradient: {
    flex: 1,
    opacity: 0.3,
  },
  centerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  stepText: {
    fontSize: DIMENSIONS.font.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  countdownText: {
    fontSize: DIMENSIONS.font.huge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cycleText: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.textLight,
    marginTop: DIMENSIONS.spacing.xs,
  },
  controlsArea: {
    padding: DIMENSIONS.spacing.xl,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: DIMENSIONS.spacing.md,
    paddingHorizontal: DIMENSIONS.spacing.xl,
    borderRadius: DIMENSIONS.radius.large,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  stopButtonText: {
    color: COLORS.surface,
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    marginLeft: DIMENSIONS.spacing.sm,
  },
  successCard: {
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
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  successTitle: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: DIMENSIONS.spacing.sm,
  },
  successText: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.textSecondary,
  },
  exercisesSection: {
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
  exerciseCard: {
    marginBottom: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.large,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciseGradient: {
    padding: DIMENSIONS.spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.sm,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: DIMENSIONS.spacing.md,
  },
  exerciseName: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  exerciseDescription: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.surface,
    opacity: 0.9,
  },
  exerciseBenefits: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.surface,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  tipsSection: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  tipsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.large,
    padding: DIMENSIONS.spacing.md,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    flex: 1,
  },
});

export default BreathingScreen;