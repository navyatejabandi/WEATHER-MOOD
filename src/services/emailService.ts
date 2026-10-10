import { SentEmailRecord, WeatherData, AuthUser, MoodType } from '../types';

const STORAGE_KEY_SENT_EMAILS = 'wm_sent_emails_log';

export class EmailService {
  static getSentEmails(): SentEmailRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SENT_EMAILS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getLatestSentEmail(): SentEmailRecord | null {
    const list = this.getSentEmails();
    return list.length > 0 ? list[0] : null;
  }

  static sendLoginMoodReport(user: AuthUser, weather: WeatherData): SentEmailRecord {
    const predictedMood: MoodType = 'happy';
    const probability = 54;
    const explanation = 'Sunny skies and comfortable temperature (20–30°C) are linked with a +42% elevated positive mood valence.';

    const emailRecord: SentEmailRecord = {
      id: 'eml_' + Date.now(),
      recipientEmail: user.identifier.includes('@') ? user.identifier : `${user.identifier.replace(/\s+/g, '')}@gmail.com`,
      recipientName: user.name,
      subject: `🌤️ Your WeatherMood Report: Today's Estimated Mood is Happy (28°C in ${weather.city})`,
      sentAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      weatherSummary: {
        temp: weather.temp,
        condition: weather.condition,
        city: weather.city,
        state: weather.state,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        aqi: weather.aqi,
      },
      predictedMood,
      moodProbability: probability,
      explanation,
      status: 'Delivered',
    };

    try {
      const existing = this.getSentEmails();
      const updated = [emailRecord, ...existing];
      localStorage.setItem(STORAGE_KEY_SENT_EMAILS, JSON.stringify(updated));
    } catch {
      // ignore
    }

    return emailRecord;
  }
}
