import { Timestamps, Model } from './interface';

class Admin extends Model implements Timestamps {
  id: number;
  account: string;
  password: string;
  managerId: number;
  createdAt: Date;
  updatedAt: Date;
}
class Manager extends Model implements Timestamps {
  managerId: number;
  name: number;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

class Auth extends Model {
  authId: number;
  name: string;
}
class ManagerRole extends Model {
  id: number;
  managerId: number;
  roleId: number;
}

class Role extends Model implements Timestamps {
  roleId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
class RoleAuth extends Model {
  id: number;
  authId: number;
  roleId: number;
}

export type IAdmin = typeof Admin;
export { Admin };
export type IManager = typeof Manager;
export type IAuth = typeof Auth;
export type IManagerRole = typeof ManagerRole;
export type IRole = typeof Role;
export type IRoleAuth = typeof RoleAuth;
