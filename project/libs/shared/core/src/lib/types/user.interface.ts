export interface User {
  id?: string;
  avatar: string;
  email: string;
  name: string;
  registrationDate: Date;
  subscribers: string[];
  subscribersNotifyDate: Date;
}
