import 'egg';

import { UserToken } from '../app/extend/interface';

declare module 'egg' {
  interface Context {
    user: UserToken;
  }
}
