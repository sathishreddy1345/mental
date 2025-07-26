import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'mood_entries',
  USER_PREFERENCES: 'user_preferences',
  CHAT_HISTORY: 'chat_history',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  GRATITUDE_ENTRIES: 'gratitude_entries',
  GOALS: 'goals',
  STREAKS: 'streaks',
  SOS_SETTINGS: 'sos_settings',
  FIRST_LAUNCH: 'first_launch',
};

export class StorageService {
  // Mood Entries
  static async saveMoodEntry(moodEntry) {
    try {
      const existingEntries = await this.getMoodEntries();
      const updatedEntries = [moodEntry, ...existingEntries];
      await AsyncStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updatedEntries));
      return updatedEntries;
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw error;
    }
  }

  static async getMoodEntries() {
    try {
      const entries = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  static async deleteMoodEntry(entryId) {
    try {
      const existingEntries = await this.getMoodEntries();
      const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
      await AsyncStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updatedEntries));
      return updatedEntries;
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  }

  // User Preferences
  static async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  static async getUserPreferences() {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {
        theme: 'light',
        notifications: true,
        reminderTime: '09:00',
        emergencyContact: null,
        biometricLock: false,
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  // Chat History
  static async saveChatMessage(message) {
    try {
      const chatHistory = await this.getChatHistory();
      const updatedHistory = [...chatHistory, message];
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  static async getChatHistory() {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  static async clearChatHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // Emergency Contacts
  static async saveEmergencyContacts(contacts) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
      throw error;
    }
  }

  static async getEmergencyContacts() {
    try {
      const contacts = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
      return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }

  // Gratitude Entries
  static async saveGratitudeEntry(entry) {
    try {
      const existingEntries = await this.getGratitudeEntries();
      const updatedEntries = [entry, ...existingEntries];
      await AsyncStorage.setItem(STORAGE_KEYS.GRATITUDE_ENTRIES, JSON.stringify(updatedEntries));
      return updatedEntries;
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
      throw error;
    }
  }

  static async getGratitudeEntries() {
    try {
      const entries = await AsyncStorage.getItem(STORAGE_KEYS.GRATITUDE_ENTRIES);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting gratitude entries:', error);
      return [];
    }
  }

  // Goals
  static async saveGoals(goals) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
      throw error;
    }
  }

  static async getGoals() {
    try {
      const goals = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
      return goals ? JSON.parse(goals) : [];
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }

  // Streaks
  static async updateStreak(type, date = new Date().toISOString().split('T')[0]) {
    try {
      const streaks = await this.getStreaks();
      if (!streaks[type]) {
        streaks[type] = { count: 0, lastDate: null };
      }

      if (streaks[type].lastDate === date) {
        return streaks; // Already updated today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streaks[type].lastDate === yesterdayStr) {
        streaks[type].count += 1;
      } else {
        streaks[type].count = 1;
      }

      streaks[type].lastDate = date;
      await AsyncStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
      return streaks;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  static async getStreaks() {
    try {
      const streaks = await AsyncStorage.getItem(STORAGE_KEYS.STREAKS);
      return streaks ? JSON.parse(streaks) : {};
    } catch (error) {
      console.error('Error getting streaks:', error);
      return {};
    }
  }

  // SOS Settings
  static async saveSOSSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SOS_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving SOS settings:', error);
      throw error;
    }
  }

  static async getSOSSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SOS_SETTINGS);
      return settings ? JSON.parse(settings) : {
        enabled: true,
        autoDetect: true,
        keywords: ['help', 'emergency', 'crisis', 'suicide', 'depressed', 'hopeless'],
        cooldownHours: 24,
      };
    } catch (error) {
      console.error('Error getting SOS settings:', error);
      return {};
    }
  }

  // First Launch
  static async isFirstLaunch() {
    try {
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      if (firstLaunch === null) {
        await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return false;
    }
  }

  // Clear All Data
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Export Data
  static async exportAllData() {
    try {
      const data = {};
      for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
        const value = await AsyncStorage.getItem(storageKey);
        data[key] = value ? JSON.parse(value) : null;
      }
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}