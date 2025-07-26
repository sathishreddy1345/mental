import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  BounceIn,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';

const { width } = Dimensions.get('window');

const SOUNDSCAPES = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    description: 'Soft rainfall for deep relaxation',
    icon: 'rainy',
    color: COLORS.gradients.ocean,
    duration: '∞',
    category: 'nature',
    // In a real app, you'd have actual audio files
    audioUrl: 'https://example.com/rain.mp3',
  },
  {
    id: 'forest',
    name: 'Forest Sounds',
    description: 'Birds chirping in a peaceful forest',
    icon: 'leaf',
    color: COLORS.gradients.calming,
    duration: '∞',
    category: 'nature',
    audioUrl: 'https://example.com/forest.mp3',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    description: 'Gentle waves on a sandy beach',
    icon: 'water',
    color: COLORS.gradients.ocean,
    duration: '∞',
    category: 'nature',
    audioUrl: 'https://example.com/waves.mp3',
  },
  {
    id: 'meditation',
    name: 'Meditation Bell',
    description: 'Tibetan singing bowls for mindfulness',
    icon: 'radio',
    color: COLORS.gradients.primary,
    duration: '10m',
    category: 'meditation',
    audioUrl: 'https://example.com/meditation.mp3',
  },
  {
    id: 'piano',
    name: 'Peaceful Piano',
    description: 'Soft piano melodies for relaxation',
    icon: 'musical-note',
    color: COLORS.gradients.sunset,
    duration: '15m',
    category: 'music',
    audioUrl: 'https://example.com/piano.mp3',
  },
  {
    id: 'fireplace',
    name: 'Crackling Fire',
    description: 'Warm fireplace sounds for comfort',
    icon: 'flame',
    color: COLORS.gradients.sunset,
    duration: '∞',
    category: 'ambient',
    audioUrl: 'https://example.com/fireplace.mp3',
  },
  {
    id: 'nightsounds',
    name: 'Night Sounds',
    description: 'Crickets and gentle night breeze',
    icon: 'moon',
    color: COLORS.gradients.primary,
    duration: '∞',
    category: 'nature',
    audioUrl: 'https://example.com/night.mp3',
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    description: 'Consistent sound for focus and sleep',
    icon: 'radio-outline',
    color: COLORS.gradients.calming,
    duration: '∞',
    category: 'ambient',
    audioUrl: 'https://example.com/whitenoise.mp3',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'nature', name: 'Nature', icon: 'leaf' },
  { id: 'meditation', name: 'Meditation', icon: 'radio' },
  { id: 'music', name: 'Music', icon: 'musical-notes' },
  { id: 'ambient', name: 'Ambient', icon: 'layers' },
];

const MusicScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  const pulseAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    return sound ? () => {
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  useEffect(() => {
    if (isPlaying) {
      pulseAnim.value = withRepeat(
        withTiming(1.1, { duration: 1000 }),
        -1,
        true
      );
      rotateAnim.value = withRepeat(
        withTiming(360, { duration: 3000 }),
        -1,
        false
      );
    } else {
      pulseAnim.value = withTiming(1);
      rotateAnim.value = withTiming(0);
    }
  }, [isPlaying]);

  const playbackAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnim.value },
        { rotate: `${rotateAnim.value}deg` }
      ],
    };
  });

  const playSound = async (soundscape) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      // In a real app, you would load the actual audio file
      // For demo purposes, we'll simulate this
      Alert.alert(
        'Playing Sound',
        `Now playing: ${soundscape.name}\n\nNote: In a real app, this would play actual audio files.`,
        [{ text: 'OK' }]
      );

      // Simulate loading and playing
      setCurrentSound(soundscape);
      setIsPlaying(true);
      
      // In a real implementation:
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   { uri: soundscape.audioUrl },
      //   { shouldPlay: true, isLooping: true, volume: volume }
      // );
      // setSound(newSound);
      
    } catch (error) {
      console.error('Error playing sound:', error);
      Alert.alert('Error', 'Failed to play sound');
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const resumeSound = async () => {
    try {
      if (sound) {
        await sound.playAsync();
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      setSound(null);
      setCurrentSound(null);
      setIsPlaying(false);
      setPlaybackPosition(0);
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  const adjustVolume = async (newVolume) => {
    try {
      setVolume(newVolume);
      if (sound) {
        await sound.setVolumeAsync(newVolume);
      }
    } catch (error) {
      console.error('Error adjusting volume:', error);
    }
  };

  const filteredSounds = selectedCategory === 'all' 
    ? SOUNDSCAPES 
    : SOUNDSCAPES.filter(sound => sound.category === selectedCategory);

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon} 
        size={20} 
        color={selectedCategory === category.id ? COLORS.surface : COLORS.primary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === category.id && styles.selectedCategoryText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const SoundCard = ({ soundscape, index }) => (
    <Animated.View entering={BounceIn.delay(index * 100)} style={styles.soundCard}>
      <TouchableOpacity
        style={styles.soundCardTouchable}
        onPress={() => playSound(soundscape)}
        disabled={currentSound?.id === soundscape.id && isPlaying}
      >
        <LinearGradient
          colors={soundscape.color}
          style={styles.soundCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.soundCardContent}>
            <View style={styles.soundIcon}>
              <Ionicons name={soundscape.icon} size={32} color={COLORS.surface} />
            </View>
            <View style={styles.soundInfo}>
              <Text style={styles.soundName}>{soundscape.name}</Text>
              <Text style={styles.soundDescription}>{soundscape.description}</Text>
              <Text style={styles.soundDuration}>{soundscape.duration}</Text>
            </View>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => 
                currentSound?.id === soundscape.id && isPlaying 
                  ? pauseSound() 
                  : playSound(soundscape)
              }
            >
              <Ionicons 
                name={
                  currentSound?.id === soundscape.id && isPlaying 
                    ? 'pause' 
                    : 'play'
                } 
                size={24} 
                color={COLORS.surface} 
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <LinearGradient
            colors={COLORS.gradients.sunset}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerTitle}>Calming Sounds</Text>
            <Text style={styles.headerSubtitle}>
              Peaceful soundscapes for relaxation
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Current Playing */}
        {currentSound && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.nowPlayingCard}>
            <LinearGradient
              colors={currentSound.color}
              style={styles.nowPlayingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.nowPlayingContent}>
                <Animated.View style={[styles.nowPlayingIcon, playbackAnimStyle]}>
                  <Ionicons name={currentSound.icon} size={40} color={COLORS.surface} />
                </Animated.View>
                <View style={styles.nowPlayingInfo}>
                  <Text style={styles.nowPlayingTitle}>Now Playing</Text>
                  <Text style={styles.nowPlayingName}>{currentSound.name}</Text>
                </View>
                <View style={styles.nowPlayingControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={isPlaying ? pauseSound : resumeSound}
                  >
                    <Ionicons 
                      name={isPlaying ? 'pause' : 'play'} 
                      size={32} 
                      color={COLORS.surface} 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={stopSound}
                  >
                    <Ionicons name="stop" size={28} color={COLORS.surface} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Volume Control */}
              <View style={styles.volumeContainer}>
                <Ionicons name="volume-low" size={20} color={COLORS.surface} />
                <View style={styles.volumeSlider}>
                  <View style={[styles.volumeTrack, { width: `${volume * 100}%` }]} />
                </View>
                <Ionicons name="volume-high" size={20} color={COLORS.surface} />
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Categories */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {CATEGORIES.map((category) => (
              <CategoryButton key={category.id} category={category} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Sound Cards */}
        <View style={styles.soundsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Sounds' : 
             CATEGORIES.find(c => c.id === selectedCategory)?.name + ' Sounds'}
          </Text>
          {filteredSounds.map((soundscape, index) => (
            <SoundCard key={soundscape.id} soundscape={soundscape} index={index} />
          ))}
        </View>

        {/* Benefits Section */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Benefits of Sound Therapy</Text>
          <View style={styles.benefitsContainer}>
            {[
              { icon: 'heart', text: 'Reduces stress and anxiety' },
              { icon: 'bed', text: 'Improves sleep quality' },
              { icon: 'brain', text: 'Enhances focus and concentration' },
              { icon: 'happy', text: 'Promotes emotional well-being' },
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name={benefit.icon} size={24} color={COLORS.primary} />
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

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
  nowPlayingCard: {
    marginHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
    borderRadius: DIMENSIONS.radius.large,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  nowPlayingGradient: {
    padding: DIMENSIONS.spacing.lg,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  nowPlayingIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DIMENSIONS.spacing.md,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.surface,
    opacity: 0.8,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  nowPlayingName: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  nowPlayingControls: {
    flexDirection: 'row',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: DIMENSIONS.spacing.sm,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeSlider: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginHorizontal: DIMENSIONS.spacing.md,
  },
  volumeTrack: {
    height: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 2,
  },
  categoriesSection: {
    marginBottom: DIMENSIONS.spacing.lg,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.font.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.md,
    marginHorizontal: DIMENSIONS.spacing.md,
  },
  categoriesScroll: {
    paddingLeft: DIMENSIONS.spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.large,
    paddingVertical: DIMENSIONS.spacing.sm,
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginRight: DIMENSIONS.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  categoryText: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: DIMENSIONS.spacing.xs,
  },
  selectedCategoryText: {
    color: COLORS.surface,
  },
  soundsSection: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  soundCard: {
    marginBottom: DIMENSIONS.spacing.md,
    borderRadius: DIMENSIONS.radius.large,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  soundCardTouchable: {
    overflow: 'hidden',
  },
  soundCardGradient: {
    padding: DIMENSIONS.spacing.md,
  },
  soundCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DIMENSIONS.spacing.md,
  },
  soundInfo: {
    flex: 1,
  },
  soundName: {
    fontSize: DIMENSIONS.font.medium,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  soundDescription: {
    fontSize: DIMENSIONS.font.small,
    color: COLORS.surface,
    opacity: 0.9,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  soundDuration: {
    fontSize: DIMENSIONS.font.tiny,
    color: COLORS.surface,
    opacity: 0.8,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsSection: {
    paddingHorizontal: DIMENSIONS.spacing.md,
    marginBottom: DIMENSIONS.spacing.lg,
  },
  benefitsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: DIMENSIONS.radius.large,
    padding: DIMENSIONS.spacing.md,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.spacing.md,
  },
  benefitText: {
    fontSize: DIMENSIONS.font.medium,
    color: COLORS.textSecondary,
    marginLeft: DIMENSIONS.spacing.md,
    flex: 1,
  },
});

export default MusicScreen;