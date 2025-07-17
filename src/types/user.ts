export interface User {
  id: number;
  name: string; // 日本語名前をサポート
  client_id: number;
  lineid: string;
  email: string;
  phone: string;
  gender: number; // 1 = male, 0 = female (changed from boolean to number)
  birthday: string; // YYYY-MM-DD format
  weight: number;
  height: number;
  role: number; // 0 = user, 1 = admin
}

export interface UserFormData {
  name: string; // 日本語名前をサポート
  client_id: number;
  lineid: string;
  email: string;
  phone: string;
  gender: number;
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
  { value: 1, label: '男性' },
  { value: 0, label: '女性' }
]; 