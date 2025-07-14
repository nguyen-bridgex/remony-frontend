export interface UserSettings {
  id: number; // 設定ID
  userid: number; // ユーザーID
  hrDutyCycle: number; // 心拍測定周期
  caloriesGoal: number; // カロリー目標
  sleepGoal: number; // 睡眠目標
  stepsGoal: number; // 歩数目標
  distanceGoal: number; // 距離目標
  alertHeartRateEnabled: boolean; // 心拍アラートのON/OFF
  alertHeartRateLowerThreshold: number; // 心拍アラート下限
  alertHeartRateUpperThreshold: number; // 心拍アラート上限
  alertSosEnabled: boolean; // SOSアラートのON/OFF
  alertDetectFallDownEnabled: boolean; // 転倒アラートのON/OFF
  alertAwakeningEnabled: boolean; // 覚醒アラートのON/OFF
  alertAwakeningWatchingStartTime: number; // 覚醒アラート監視開始時間
  alertAwakeningWatchingEndTime: number; // 覚醒アラート監視終了時間
  alertAwakeningDurationThresholdMinutes: number; // 覚醒アラートの閾値(分)
  alertNonWearingEnabled: boolean; // 非装着アラートのON/OFF
  alertNonWearingDurationMinutesLimit: number; // 非装着アラートの閾値(分)
  alertDisconnectionEnabled: boolean; // 端末切断アラートのON/OFF
  alertDisconnectionTimeoutMinutesThreshold: number; // 端末切断アラートの閾値(分)
  alertHeatstrokeEnabled: boolean; // 熱中症アラートのON/OFF
  alertHeatstrokeSkinTempThreshold: number; // 熱中症アラートの表体温の閾値
}

export interface UserSettingsFormData {
  hrDutyCycle: number;
  caloriesGoal: number;
  sleepGoal: number;
  stepsGoal: number;
  distanceGoal: number;
  alertHeartRateEnabled: boolean;
  alertHeartRateLowerThreshold: number;
  alertHeartRateUpperThreshold: number;
  alertSosEnabled: boolean;
  alertDetectFallDownEnabled: boolean;
  alertAwakeningEnabled: boolean;
  alertAwakeningWatchingStartTime: number;
  alertAwakeningWatchingEndTime: number;
  alertAwakeningDurationThresholdMinutes: number;
  alertNonWearingEnabled: boolean;
  alertNonWearingDurationMinutesLimit: number;
  alertDisconnectionEnabled: boolean;
  alertDisconnectionTimeoutMinutesThreshold: number;
  alertHeatstrokeEnabled: boolean;
  alertHeatstrokeSkinTempThreshold: number;
} 