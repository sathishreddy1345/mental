import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DIMENSIONS = {
  width,
  height,
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  radius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    round: 50,
  },
  
  // Font Sizes
  font: {
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    huge: 32,
  },
  
  // Icon Sizes
  icon: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
    huge: 64,
  },
  
  // Header Heights
  header: {
    small: 44,
    medium: 56,
    large: 80,
  },
  
  // Button Heights
  button: {
    small: 32,
    medium: 44,
    large: 52,
  },
  
  // Mood Selector
  moodButton: 80,
  
  // Card Dimensions
  card: {
    minHeight: 120,
    mediumHeight: 160,
    largeHeight: 200,
  },
  
  // Breathing Circle
  breathingCircle: {
    min: 120,
    max: 200,
  },
};

export const isSmallScreen = width < 375;
export const isMediumScreen = width >= 375 && width < 414;
export const isLargeScreen = width >= 414;