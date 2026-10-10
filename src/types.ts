export type ScreenName = 
  | 'HOME' 
  | 'MOOD_INSIGHTS' 
  | 'WEATHER_CONDITIONS' 
  | 'PREDICTION' 
  | 'LOG_MOOD' 
  | 'LOCATION_RADAR';

export type MoodType = 'happy' | 'calm' | 'okay' | 'sad' | 'irritated';

export interface AuthUser {
  id: string;
  name: string;
  identifier: string; // email or phone
  avatar?: string;
  provider?: 'Email' | 'Google' | 'Apple';
  createdAt: string;
}

export interface WeatherData {
  temp: number; // in Celsius
  condition: string;
  conditionIcon: 'sun' | 'cloud' | 'rain' | 'thunder';
  precipitation: number; // in %
  high: number;
  low: number;
  humidity: number; // percentage
  windSpeed: number; // km/h
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Very Unhealthy';
  city: string;
  state: string;
  timeString: string;
}

export interface MoodFeedbackRecord {
  id: string;
  timestamp: string;
  dateLabel: string;
  timeLabel: string;
  confirmedEstimate: boolean;
  reportedMood: MoodType;
  predictedMood: MoodType;
  confidenceAtLog: number;
  weatherSnapshot: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    aqi: number;
    precipitation: number;
  };
  note?: string;
  isUserLabelled: boolean;
}

export interface HourlyProgressionItem {
  id: string;
  timeLabel: string;
  offsetLabel: string; // e.g. "Now", "+10m", "+20m", "+30m", "+40m", "+50m"
  temp: number;
  condition: string;
  predictedMood: MoodType;
  moodProbability: number;
  weatherIcon: 'sun' | 'cloud-sun' | 'cloud' | 'sunset';
}

export interface MLModelSpecs {
  algorithm: string;
  totalTrainingSamples: number;
  userFeedbackSamples: number;
  crossValidationAccuracy: number;
  f1Score: number;
  logLoss: number;
  status: 'Trained & Operational' | 'Retraining' | 'Calibrated';
  lastEvaluatedAt: string;
}

export interface SimilarWeatherRecord {
  id: string;
  date: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  aqi: number;
  reportedMood: MoodType;
  similarityScore: number;
  note?: string;
  source: 'User Feedback' | 'Baseline Observation';
}

export interface SentEmailRecord {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  weatherSummary: {
    temp: number;
    condition: string;
    city: string;
    state: string;
    humidity: number;
    windSpeed: number;
    aqi: number;
  };
  predictedMood: MoodType;
  moodProbability: number;
  explanation: string;
  status: 'Delivered' | 'Sent';
}
