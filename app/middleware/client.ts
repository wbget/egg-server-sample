import { Context } from 'egg';
import * as lodash from 'lodash';
import { UserToken } from '../extend/interface';

export default (): any => async (ctx: Context, next: () => Promise<any>) => {
  const token = ctx.headers.token;
  if (lodash.isEmpty(token)) {
    ctx.status = 401;
    ctx.body = { result: false, msg: '请重新登陆' };
    return;
  }
  try {
    const userInfo: UserToken = ctx.helper.verify(token);
    ctx.user = userInfo;
  } catch (error) {
    // invalid token
    ctx.body = { result: false, msg: '登陆已失效' };
    return;
  }
  await next();
};
