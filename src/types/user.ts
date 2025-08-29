// Hospital interface for reference
export interface Hospital {
  id: number;
  name: string;
  address: string | null;
}

export interface User {
  id: number;
  name: string; // 日本語名前をサポート
  client_id: number;
  line_id: string; // Updated API uses line_id
  email: string;
  phone: string;
  gender: number; // 1 = male, 0 = female
  birthday: string; // YYYY-MM-DD format
  weight: number;
  height: number;
  address: string; // 住所を追加
  hospital?: string; // 事業所/医院 (backwards compatibility)
  hospital_id?: number; // 事業所ID from API
  hospital_name?: string; // 事業所名 from API
  gateway_id?: string; // ゲートウェイID
  uid?: string; // UID
  device_id?: string; // デバイスID
  is_wearing?: number; // 装着状況 - 1 = wearing, 0 = not wearing
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
  hospital: string; // 事業所/医院 (backwards compatibility)
  hospital_id?: number; // 事業所ID for API
  hospital_name?: string; // 事業所名 for API
  gateway_id: string; // ゲートウェイID
  uid: string; // UID
  device_id: string; // デバイスID
  vital_device: string; // バイタル機器を追加
  notification_target: string; // 通知先を追加
}

export const GenderOptions = [
  { value: 1, label: '男性' },
  { value: 0, label: '女性' }
];

// Default hospital options - will be replaced by dynamic API call
export const HospitalOptions = [
  { value: 'おうちのカンゴ', label: 'おうちのカンゴ' },
  { value: 'おうちのカンゴ代々木上原サテライト', label: 'おうちのカンゴ代々木上原サテライト' },
  { value: 'おうちのカンゴ上池台サテライト', label: 'おうちのカンゴ上池台サテライト' },
  { value: 'おうちのカンゴ上大崎サテライト', label: 'おうちのカンゴ上大崎サテライト' },
  { value: 'おうちのカンゴ立川サテライト', label: 'おうちのカンゴ立川サテライト' },
  { value: 'おうちのカンゴ二子玉川サテライト', label: 'おうちのカンゴ二子玉川サテライト' },
  { value: 'おうちのカンゴきたみサテライト', label: 'おうちのカンゴきたみサテライト' },
  { value: 'おうちのカンゴ代官山サテライト', label: 'おうちのカンゴ代官山サテライト' },
  { value: 'おうちのカンゴ三軒茶屋サテライト', label: 'おうちのカンゴ三軒茶屋サテライト' },
  { value: 'おうちのカンゴ四ツ谷サテライト', label: 'おうちのカンゴ四ツ谷サテライト' },
  { value: 'おうちのカンゴ麻布十番サテライト', label: 'おうちのカンゴ麻布十番サテライト' },
  { value: 'おうちのカンゴ中野サテライト', label: 'おうちのカンゴ中野サテライト' },
  { value: 'おうちのカンゴ代田橋サテライト', label: 'おうちのカンゴ代田橋サテライト' },
  { value: 'おうちのカンゴ田園調布サテライト', label: 'おうちのカンゴ田園調布サテライト' },
  { value: 'おうちのカンゴ大井町サテライト', label: 'おうちのカンゴ大井町サテライト' },
  { value: 'おうちのカンゴ千歳船橋サテライト', label: 'おうちのカンゴ千歳船橋サテライト' },
  { value: 'おうちのカンゴ下北沢サテライト', label: 'おうちのカンゴ下北沢サテライト' },
  { value: 'おうちのカンゴ都立大サテライト', label: 'おうちのカンゴ都立大サテライト' }
];

export const VitalDeviceOptions = [
  { value: 'remony', label: 'Remony' }
];

export const NotificationTargetOptions = [
  { value: 'email', label: 'メール' },
  { value: 'line', label: 'LINE' },
  { value: 'both', label: 'メール・LINE両方' }
]; 