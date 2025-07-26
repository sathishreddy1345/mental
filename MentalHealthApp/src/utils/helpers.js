// Date and time utilities
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export const getDaysAgo = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = Math.abs(today - targetDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

// Mood analysis utilities
export const getMoodLevel = (moodValue) => {
  if (moodValue >= 4.5) return 'excellent';
  if (moodValue >= 3.5) return 'good';
  if (moodValue >= 2.5) return 'neutral';
  if (moodValue >= 1.5) return 'poor';
  return 'terrible';
};

export const calculateAverageMood = (moodEntries) => {
  if (!moodEntries || moodEntries.length === 0) return 0;
  
  const sum = moodEntries.reduce((acc, entry) => acc + entry.value, 0);
  return (sum / moodEntries.length).toFixed(1);
};

export const getMoodTrend = (moodEntries, days = 7) => {
  if (!moodEntries || moodEntries.length < 2) return 'stable';
  
  const recentEntries = moodEntries.slice(0, days);
  const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
  const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
  
  const firstAvg = calculateAverageMood(firstHalf);
  const secondAvg = calculateAverageMood(secondHalf);
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 0.5) return 'improving';
  if (difference < -0.5) return 'declining';
  return 'stable';
};

// Streak calculation utilities
export const calculateStreak = (entries, dateKey = 'date') => {
  if (!entries || entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b[dateKey]) - new Date(a[dateKey])
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry[dateKey]);
    const dayDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === streak) {
      streak++;
      currentDate = entryDate;
    } else if (dayDiff > streak) {
      break;
    }
  }
  
  return streak;
};

// Breathing exercise utilities
export const formatBreathingTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

export const calculateBreathingCycles = (pattern, totalSeconds) => {
  const cycleLength = pattern.reduce((sum, duration) => sum + duration, 0);
  return Math.floor(totalSeconds / cycleLength);
};

// Text analysis utilities
export const getSentiment = (text) => {
  const positiveWords = [
    'happy', 'joy', 'excited', 'grateful', 'blessed', 'amazing',
    'wonderful', 'fantastic', 'great', 'good', 'positive', 'love',
    'peaceful', 'calm', 'relaxed', 'content', 'satisfied'
  ];
  
  const negativeWords = [
    'sad', 'depressed', 'angry', 'frustrated', 'anxious', 'worried',
    'stressed', 'overwhelmed', 'tired', 'exhausted', 'hopeless',
    'terrible', 'awful', 'bad', 'negative', 'hate', 'pain'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

export const containsCrisisKeywords = (text) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'no point living',
    'better off dead', 'hurt myself', 'self harm', 'cutting',
    'overdose', 'jump', 'emergency', 'crisis', 'help me'
  ];
  
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Storage utilities
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const sanitizeForStorage = (data) => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Error sanitizing data for storage:', error);
    return null;
  }
};

// Animation utilities
export const getRandomDelay = (min = 0, max = 500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const interpolateColor = (color1, color2, factor) => {
  // Simple color interpolation for animations
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
};

// Notification utilities
export const shouldShowNotification = (lastNotification, hours = 24) => {
  if (!lastNotification) return true;
  
  const hoursSinceLastNotification = 
    (Date.now() - new Date(lastNotification).getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLastNotification >= hours;
};

// Privacy utilities
export const maskSensitiveData = (text, visibleChars = 4) => {
  if (!text || text.length <= visibleChars) return text;
  
  const visible = text.slice(-visibleChars);
  const masked = '*'.repeat(text.length - visibleChars);
  return masked + visible;
};

// Accessibility utilities
export const getAccessibilityLabel = (element, context) => {
  switch (element) {
    case 'mood-button':
      return `Select ${context.mood} mood. Current mood level ${context.value} out of 5.`;
    case 'breathing-circle':
      return `Breathing exercise. ${context.step} for ${context.count} seconds.`;
    case 'play-button':
      return `${context.isPlaying ? 'Pause' : 'Play'} ${context.soundName}`;
    default:
      return context.label || element;
  }
};

export default {
  formatDate,
  formatTime,
  getDateString,
  getDaysAgo,
  getMoodLevel,
  calculateAverageMood,
  getMoodTrend,
  calculateStreak,
  formatBreathingTime,
  calculateBreathingCycles,
  getSentiment,
  containsCrisisKeywords,
  validateEmail,
  validatePhoneNumber,
  generateId,
  sanitizeForStorage,
  getRandomDelay,
  interpolateColor,
  shouldShowNotification,
  maskSensitiveData,
  getAccessibilityLabel,
};