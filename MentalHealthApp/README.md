# Mental Health App 🧠💚

A beautiful, comprehensive mental health support application built with React Native and Expo. This app provides daily mood tracking, AI-powered chat support, guided breathing exercises, calming soundscapes, and emergency SOS features.

## ✨ Features

### 🏠 **Home Dashboard**
- Personalized greeting with time-based messages
- Daily inspirational quotes from various wisdom traditions
- Personal affirmations
- Quick access to all wellness tools
- Mood streak tracking
- Wellness reminders and tips

### 😊 **Daily Mood Tracker**
- Intuitive emoji-based mood selection
- Optional journaling for each mood entry
- Beautiful mood history charts
- Streak tracking for consistent check-ins
- Prevents multiple entries per day
- Visual mood analytics over time

### 🌬️ **Breathing Exercises**
- **Box Breathing**: 4-4-4-4 pattern for stress relief
- **4-7-8 Breathing**: For sleep and deep relaxation
- **Calm Breathing**: 6-6 pattern for general mindfulness
- **Energizing Breath**: 3-3-3 pattern for alertness
- Animated breathing circles with visual guidance
- Haptic feedback on breathing transitions
- Session timer and cycle counter
- Post-session statistics

### 💬 **AI Mental Health Companion**
- Intelligent mood detection from text
- Contextual responses based on emotional state
- Emergency keyword detection with SOS features
- Conversation starters for different topics
- Persistent chat history
- Typing indicators and smooth animations
- Supportive and empathetic AI responses

### 🆘 **SOS & Safety Features**
- Automatic detection of crisis keywords
- Immediate access to crisis hotlines
- Emergency contact integration
- Quick calming exercises during distress
- Safety resources and helplines
- Human-in-the-loop escalation

### 🎵 **Calming Sounds & Music**
- **Nature Sounds**: Rain, forest, ocean waves, night sounds
- **Meditation Audio**: Tibetan bells, singing bowls
- **Ambient Sounds**: Fireplace, white noise
- **Peaceful Music**: Soft piano melodies
- Built-in audio player with controls
- Volume adjustment
- Looping ambient soundscapes
- Category-based browsing

### 🎯 **Additional Wellness Features**
- Gratitude journaling
- Daily goal setting and tracking
- Affirmations generator
- Wellness tips and reminders
- Progress tracking and streaks
- Privacy-focused data storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)
- Expo Go app for testing on physical devices

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MentalHealthApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal or click "Run on iOS simulator" in Expo DevTools
   - **Android Emulator**: Press `a` in the terminal or click "Run on Android device/emulator"
   - **Physical Device**: Scan the QR code with Expo Go app

### Additional Setup

**For Audio Features (Optional)**
```bash
expo install expo-av
```

**For Push Notifications**
```bash
expo install expo-notifications
```

## 📱 Usage Guide

### First Time Setup
1. Open the app and complete the welcome flow
2. Set up daily reminder notifications
3. Optionally add emergency contacts for SOS features

### Daily Workflow
1. **Morning Check-in**: Log your mood and read daily inspiration
2. **Breathing Practice**: Use guided exercises when feeling stressed
3. **Chat Support**: Talk with the AI companion about your feelings
4. **Calming Sounds**: Play ambient sounds during work or relaxation
5. **Evening Reflection**: Update your mood and practice gratitude

### Emergency Support
- Type crisis-related keywords in chat to trigger SOS features
- Access emergency contacts and crisis hotlines
- Use immediate calming techniques

## 🛠️ Technical Details

### Built With
- **React Native & Expo**: Cross-platform mobile development
- **React Navigation**: Beautiful tab and stack navigation
- **React Native Reanimated**: Smooth animations and transitions
- **React Native Paper**: Material Design components
- **Expo LinearGradient**: Beautiful gradient backgrounds
- **React Native Chart Kit**: Mood tracking visualizations
- **AsyncStorage**: Local data persistence
- **Expo AV**: Audio playback capabilities
- **Expo Haptics**: Tactile feedback

### Architecture
```
src/
├── components/           # Reusable UI components
├── screens/             # Main app screens
├── navigation/          # Navigation configuration
├── services/           # Data services and storage
├── constants/          # Colors, dimensions, quotes
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

### Data Storage
- All user data is stored locally using AsyncStorage
- No personal data is sent to external servers (except for AI chat which can be configured)
- Data includes mood entries, chat history, preferences, and progress tracking

## 🎨 Design System

### Color Palette
- **Primary**: Calming blues and purples (`#6B73FF`)
- **Secondary**: Warm pinks for emotional warmth (`#FF8A95`)
- **Mood Colors**: Distinct colors for each mood level
- **Gradients**: Smooth transitions for visual appeal

### Typography
- Clean, readable fonts with proper hierarchy
- Consistent sizing scale across the app
- Accessibility-focused contrast ratios

### Animations
- Smooth transitions between screens
- Breathing exercise animations
- Micro-interactions for engagement
- Loading states and feedback

## 🔒 Privacy & Security

### Data Protection
- All sensitive data encrypted locally
- Optional biometric/PIN protection
- No tracking or analytics by default
- User controls over data sharing

### Emergency Features
- Crisis detection without storing sensitive keywords
- Secure emergency contact management
- Privacy-preserving SOS features

## 🤝 Contributing

We welcome contributions to improve mental health support! Please read our contributing guidelines before submitting PRs.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Contribution
- Additional breathing techniques
- More AI response variations
- New soundscape categories
- Accessibility improvements
- Localization and internationalization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Crisis Resources

If you're experiencing a mental health crisis, please reach out for help:

### United States
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency**: 911

### International
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

## 💝 Acknowledgments

- Quotes from various wisdom traditions including the Bhagavad Gita, Buddha, Rumi, and modern mindfulness teachers
- Sound therapy techniques from established wellness practices
- Breathing exercises from proven mindfulness methodologies
- Mental health support patterns from clinical best practices

## 📞 Support

For technical support or feature requests, please open an issue on GitHub or contact our support team.

---

**Remember**: This app is designed to support your mental health journey, but it's not a replacement for professional mental health care. If you're experiencing serious mental health challenges, please consult with a qualified mental health professional.

Built with 💚 for mental wellness and emotional well-being.