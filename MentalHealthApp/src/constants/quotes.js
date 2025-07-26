export const MOTIVATIONAL_QUOTES = [
  // Bhagavad Gita
  {
    text: "You have the right to perform your actions, but you are not entitled to the fruits of action.",
    author: "Bhagavad Gita",
    category: "spiritual",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Bhagavad Gita",
    category: "spiritual",
  },
  {
    text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
    author: "Bhagavad Gita",
    category: "spiritual",
  },
  {
    text: "A person can rise through the efforts of his own mind; or draw himself down, in the same manner.",
    author: "Bhagavad Gita",
    category: "spiritual",
  },
  {
    text: "The soul is neither born, and nor does it die.",
    author: "Bhagavad Gita",
    category: "spiritual",
  },

  // English Poets
  {
    text: "The best way out is always through.",
    author: "Robert Frost",
    category: "poetry",
  },
  {
    text: "I took the road less traveled by, and that has made all the difference.",
    author: "Robert Frost",
    category: "poetry",
  },
  {
    text: "Hope is the thing with feathers that perches in the soul.",
    author: "Emily Dickinson",
    category: "poetry",
  },
  {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien",
    category: "poetry",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "poetry",
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "poetry",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "wisdom",
  },

  // Buddha
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "spiritual",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "spiritual",
  },
  {
    text: "In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you.",
    author: "Buddha",
    category: "spiritual",
  },

  // Rumi
  {
    text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    author: "Rumi",
    category: "spiritual",
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    category: "spiritual",
  },
  {
    text: "Don't be satisfied with stories, how things have gone with others. Unfold your own myth.",
    author: "Rumi",
    category: "spiritual",
  },

  // Modern Wisdom
  {
    text: "You are not your thoughts. You are the observer of your thoughts.",
    author: "Eckhart Tolle",
    category: "mindfulness",
  },
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh",
    category: "mindfulness",
  },
  {
    text: "Wherever you are, be there totally.",
    author: "Eckhart Tolle",
    category: "mindfulness",
  },
  {
    text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Sharon Salzberg",
    category: "self-love",
  },

  // General Motivation
  {
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot",
    category: "motivation",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "motivation",
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "motivation",
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    category: "motivation",
  },
  {
    text: "What we think, we become.",
    author: "Buddha",
    category: "mindfulness",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "motivation",
  },
];

export const AFFIRMATIONS = [
  "I am worthy of love and respect",
  "I choose peace over worry",
  "I am in control of my thoughts and emotions",
  "Every breath I take calms my mind",
  "I am resilient and can overcome challenges",
  "I deserve happiness and joy",
  "I am grateful for this moment",
  "I release what I cannot control",
  "I am enough just as I am",
  "I choose to focus on the positive",
  "I am surrounded by love and support",
  "I trust in my ability to heal",
  "I am patient with myself",
  "I celebrate small victories",
  "I am creating a life I love",
  "I forgive myself for past mistakes",
  "I am open to new possibilities",
  "I choose kindness towards myself",
  "I am growing stronger every day",
  "I deserve to take care of myself",
];

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};

export const getRandomAffirmation = () => {
  const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
  return AFFIRMATIONS[randomIndex];
};

export const getQuotesByCategory = (category) => {
  return MOTIVATIONAL_QUOTES.filter(quote => quote.category === category);
};