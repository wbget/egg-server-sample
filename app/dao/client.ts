import { Timestamps, Model } from './interface';

class User extends Model implements Timestamps {
  uid: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IUser = typeof User;
