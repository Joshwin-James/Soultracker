import { User, ChatMessage, EmotionalHealthData, EmotionType, MoodBooster } from '../types';

// Mock API service for EmotiCoach
class EmotiCoachAPI {
  private baseUrl = 'http://localhost:3001/api';
  private mockMode = true; // Set to true for demo purposes

  // Mock user data
  private mockUser: User = {
    id: '1',
    name: 'Wellness Seeker',
    email: 'user@example.com',
    points: 245,
    currentStreak: 7,
    level: 'Emotional Explorer',
    joinedAt: '2024-01-15'
  };

  private mockMessages: ChatMessage[] = [
    {
      id: '1',
      text: 'Hello! I\'m EmotiCoach, your personal emotional wellness companion. How are you feeling today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      emotion: 'joy'
    }
  ];

  private mockHealthData: EmotionalHealthData = {
    score: 78,
    topEmotions: [
      { emotion: 'calm', count: 15, percentage: 35 },
      { emotion: 'joy', count: 12, percentage: 28 },
      { emotion: 'anxiety', count: 8, percentage: 19 }
    ],
    weeklyTrend: [
      { date: '2024-01-15', joy: 3, calm: 5, anxiety: 2, frustration: 1, sadness: 0 },
      { date: '2024-01-16', joy: 4, calm: 4, anxiety: 1, frustration: 2, sadness: 1 },
      { date: '2024-01-17', joy: 2, calm: 6, anxiety: 3, frustration: 0, sadness: 1 },
      { date: '2024-01-18', joy: 5, calm: 3, anxiety: 1, frustration: 1, sadness: 0 },
      { date: '2024-01-19', joy: 3, calm: 4, anxiety: 2, frustration: 2, sadness: 1 },
      { date: '2024-01-20', joy: 4, calm: 5, anxiety: 1, frustration: 0, sadness: 0 },
      { date: '2024-01-21', joy: 6, calm: 2, anxiety: 2, frustration: 1, sadness: 1 }
    ],
    insights: [
      'You\'ve shown great emotional balance this week!',
      'Consider practicing mindfulness when anxiety peaks.',
      'Your joy levels are consistently high - keep it up!'
    ]
  };

  async getUser(): Promise<User> {
    if (this.mockMode) {
      return new Promise(resolve => setTimeout(() => resolve(this.mockUser), 500));
    }
    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/user`);
    return response.json();
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    if (this.mockMode) {
      this.mockUser = { ...this.mockUser, ...updates };
      return new Promise(resolve => setTimeout(() => resolve(this.mockUser), 300));
    }
    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    if (this.mockMode) {
      return new Promise(resolve => setTimeout(() => resolve(this.mockMessages), 300));
    }
    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/chat/history`);
    return response.json();
  }

  async sendMessage(text: string): Promise<{ message: ChatMessage; emotion: EmotionType; moodBooster?: MoodBooster }> {
    const emotion = this.detectEmotion(text);
    const botResponse = this.generateBotResponse(text, emotion);
    const moodBooster = this.shouldSuggestMoodBooster(emotion) ? this.generateMoodBooster(emotion) : undefined;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      emotion
    };

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      moodBooster
    };

    if (this.mockMode) {
      this.mockMessages.push(userMessage, botMessage);
      return new Promise(resolve => 
        setTimeout(() => resolve({ message: botMessage, emotion, moodBooster }), 800)
      );
    }

    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return response.json();
  }

  async getEmotionalHealth(): Promise<EmotionalHealthData> {
    if (this.mockMode) {
      return new Promise(resolve => setTimeout(() => resolve(this.mockHealthData), 400));
    }
    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  async completeMoodBooster(boosterId: string): Promise<{ points: number; newTotal: number }> {
    const points = 10;
    if (this.mockMode) {
      this.mockUser.points += points;
      return new Promise(resolve => 
        setTimeout(() => resolve({ points, newTotal: this.mockUser.points }), 300)
      );
    }
    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/mood-booster/${boosterId}/complete`, {
      method: 'POST'
    });
    return response.json();
  }

  async dailyCheckin(): Promise<{ points: number; streak: number; newTotal: number }> {
    const points = 5;
    if (this.mockMode) {
      this.mockUser.points += points;
      this.mockUser.currentStreak += 1;
      return new Promise(resolve => 
        setTimeout(() => resolve({ 
          points, 
          streak: this.mockUser.currentStreak, 
          newTotal: this.mockUser.points 
        }), 500)
      );
    }
    // Real API call would go here
    const response = await fetch(`${this.baseUrl}/checkin`, { method: 'POST' });
    return response.json();
  }

  // Helper methods for emotion detection and response generation
  private detectEmotion(text: string): EmotionType {
    const lowerText = text.toLowerCase();
    
    // Joy keywords
    if (lowerText.match(/\b(happy|joy|excited|great|amazing|wonderful|fantastic|love|awesome|brilliant|perfect|excellent)\b/)) {
      return 'joy';
    }
    
    // Calm keywords
    if (lowerText.match(/\b(calm|peaceful|relaxed|serene|tranquil|zen|meditation|mindful|centered|balanced)\b/)) {
      return 'calm';
    }
    
    // Anxiety keywords
    if (lowerText.match(/\b(anxious|worried|nervous|stress|panic|overwhelmed|scared|fear|uncertain|tense)\b/)) {
      return 'anxiety';
    }
    
    // Frustration keywords
    if (lowerText.match(/\b(frustrated|angry|annoyed|irritated|mad|upset|furious|rage|hate|disgusted)\b/)) {
      return 'frustration';
    }
    
    // Sadness keywords
    if (lowerText.match(/\b(sad|depressed|down|blue|lonely|empty|hopeless|disappointed|hurt|grief)\b/)) {
      return 'sadness';
    }
    
    // Default to calm if no specific emotion detected
    return 'calm';
  }

  private generateBotResponse(userText: string, emotion: EmotionType): string {
    const responses = {
      joy: [
        "😊 That's wonderful to hear! Your positive energy is contagious. Keep spreading that joy!",
        "🌟 I love your enthusiasm! It's beautiful to see you in such high spirits.",
        "✨ Your happiness is radiating through your words! What's bringing you the most joy today?"
      ],
      calm: [
        "🧘‍♀️ I can sense your peaceful energy. That's a beautiful state of mind to be in.",
        "🌸 Your calmness is inspiring. How are you maintaining this lovely sense of tranquility?",
        "💙 There's something so grounding about your presence right now. Well done on finding your center."
      ],
      anxiety: [
        "💚 I hear you, and I want you to know that what you're feeling is completely valid.",
        "🤗 Take a deep breath with me. You're not alone in this feeling, and it will pass.",
        "🌱 Anxiety can feel overwhelming, but you're stronger than you know. Let's work through this together."
      ],
      frustration: [
        "⚡️ I can feel your frustration, and that's okay. These feelings are part of being human.",
        "🔥 It sounds like you're dealing with something challenging. Want to talk about what's bothering you?",
        "💪 Frustration often means we care deeply about something. Let's channel that energy positively."
      ],
      sadness: [
        "💜 I'm here with you in this moment. It's okay to feel sad - your emotions are valid.",
        "🌙 Sometimes we need to sit with sadness to process what we're going through. I'm here to listen.",
        "🤲 Sending you gentle comfort. Would you like to share what's weighing on your heart?"
      ]
    };

    const emotionResponses = responses[emotion];
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  }

  private shouldSuggestMoodBooster(emotion: EmotionType): boolean {
    return ['anxiety', 'frustration', 'sadness'].includes(emotion);
  }

  private generateMoodBooster(emotion: EmotionType): MoodBooster {
    const boosters = {
      anxiety: [
        { title: "5-Minute Breathing Exercise", description: "Take 5 deep breaths, counting to 4 on inhale and 6 on exhale" },
        { title: "Grounding Technique", description: "Name 5 things you can see, 4 you can touch, 3 you can hear" },
        { title: "Gentle Movement", description: "Do some light stretching or take a short walk" }
      ],
      frustration: [
        { title: "Write It Out", description: "Spend 3 minutes writing about what's frustrating you" },
        { title: "Progressive Muscle Relaxation", description: "Tense and release each muscle group for 5 seconds" },
        { title: "Cooling Visualization", description: "Imagine a peaceful, cool place for 2 minutes" }
      ],
      sadness: [
        { title: "Gratitude Practice", description: "Write down 3 things you're grateful for today" },
        { title: "Self-Compassion Break", description: "Give yourself the kindness you'd give a good friend" },
        { title: "Gentle Self-Care", description: "Do one small thing that brings you comfort" }
      ]
    };

    const emotionBoosters = boosters[emotion as keyof typeof boosters] || boosters.anxiety;
    const booster = emotionBoosters[Math.floor(Math.random() * emotionBoosters.length)];
    
    return {
      id: Date.now().toString(),
      title: booster.title,
      description: booster.description,
      points: 10,
      completed: false
    };
  }
}

export const api = new EmotiCoachAPI();