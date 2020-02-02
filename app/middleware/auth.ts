import { isEmpty, isArray, intersection } from 'lodash';
import { Context } from 'egg';
import { AdminToken } from '../extend/interface';

export default (configAuths): any => async (
  ctx: Context,
  next: () => Promise<any>,
) => {
  const token = ctx.session.token; // 未找到token
  if (isEmpty(token)) {
    ctx.status = 401;
    ctx.body = { result: false, msg: '请重新登陆' };
    return;
  }
  try {
    const { managerId }: AdminToken = ctx.helper.verify(token);
    const role = await ctx.model.ManagerRole.findOne({
      where: {
        managerId,
      },
      rejectOnEmpty: true,
    });
    const auths = await ctx.model.RoleAuth.findAll({
      where: {
        roleId: role.roleId,
      },
      attributes: [ 'authId' ],
      raw: true,
    });
    if (isEmpty(auths)) {
      ctx.status = 403;
      ctx.body = { result: false, msg: '无权限' };
      return;
    }
    const authArr = auths.map(value => value.authId);
    if (isArray(configAuths)) {
      if (intersection(configAuths, authArr).length === 0) {
        ctx.status = 403;
        ctx.body = { result: false, msg: '无权限' };
        return;
      }
    } else {
      if (authArr.indexOf(configAuths) === -1) {
        ctx.status = 403;
        ctx.body = { result: false, msg: '无权限' };
        return;
      }
    }
    ctx.managerId = managerId;
  } catch (error) {
    // invalid token
    ctx.status = 401;
    ctx.body = { result: false, msg: '登陆已失效' };
    return;
  }
  await next();
};
