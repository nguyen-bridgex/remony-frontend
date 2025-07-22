export interface User {
  id: number;
  name: string; // 日本語名前をサポート
  client_id: number;
  line_id: string; // Updated API uses line_id
  lineid?: string; // Keep for backward compatibility
  email: string;
  phone: string;
  gender: number; // 1 = male, 0 = female
  birthday: string; // YYYY-MM-DD format
  weight: number;
  height: number;
  address: string; // 住所を追加
  // Alert settings from updated API
  heart_rate_alert_enabled?: number;
  skin_temp_alert_enabled?: number;
  step_alert_enabled?: number;
  distance_alert_enabled?: number;
  sleep_alert_enabled?: number;
  bmr_cals_alert_enabled?: number;
  act_cals_alert_enabled?: number;
  solar_gen_alert_enabled?: number;
  thermal_gen_alert_enabled?: number;
}

export interface UserFormData {
  name: string; // 日本語名前をサポート
  client_id: number;
  line_id: string; // Updated API uses line_id
  email: string;
  phone: string;
  gender: number;
  birthday: string;
  weight: number;
  height: number;
  address: string; // 住所を追加
  vital_device: string; // バイタル機器を追加
  notification_target: string; // 通知先を追加
}

export const GenderOptions = [
  { value: 1, label: '男性' },
  { value: 0, label: '女性' }
];

export const VitalDeviceOptions = [
  { value: 'remony', label: 'Remony' }
];

export const NotificationTargetOptions = [
  { value: 'email', label: 'メール' },
  { value: 'line', label: 'LINE' },
  { value: 'both', label: 'メール・LINE両方' }
]; 