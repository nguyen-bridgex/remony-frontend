export interface User {
  id: number;
  deviceId: string; // MAC Address
  name: string; // 日本語名前をサポート
  email: string;
  phone: string;
  gender: boolean; // true = male, false = female
  birthday: string; // YYYY-MM-DD format
  weight: number;
  height: number;
  role: number; // 0 = user, 1 = admin
}

export interface UserFormData {
  deviceId: string;
  name: string; // 日本語名前をサポート
  email: string;
  phone: string;
  gender: boolean;
}

export interface UserFormData {
  deviceId: string;
  name: string; // 日本語名前をサポート
  email: string;
  phone: string;
  gender: boolean;
  birthday: string;
  weight: number;
  height: number;
  role: number;
}

export const RoleOptions = [
  { value: 0, label: 'ユーザー' },
  { value: 1, label: '管理者' }
];

export const GenderOptions = [
  { value: true, label: '男性' },
  { value: false, label: '女性' }
]; 