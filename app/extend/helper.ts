import { Application } from 'egg';
import * as jwt from 'jsonwebtoken';
import { UserToken, AdminToken } from './interface';
import { isEmpty } from 'lodash';
import { Op } from 'sequelize';

const ENUM_MODE = {
  like: 0, // 模糊
  is: 1, // 完全匹配
  null: 2, // 存在与否
  between: 3, // 在两个数值之间取值(开始时间与结束时间)
};

interface Helper {
  sign(obj: UserToken): string;
  signAdmin(obj: AdminToken): string;
  verify<T>(token: string): T;
  parseWhere(map: any): any;
  parseOrder(sorts: any): any;
  [propName: string]: any;
}
const helper: Helper = {
  sign(obj) {
    const app = this.app as Application;
    const config = app.config.jwt;
    return jwt.sign(obj, config.secret, { expiresIn: config.userExpiresIn });
  },
  signAdmin(obj) {
    const app = this.app as Application;
    const config = app.config.jwt;
    return jwt.sign(obj, config.secret, { expiresIn: config.adminExpiresIn });
  },
  verify(token) {
    const app = this.app as Application;
    const config = app.config.jwt;
    return jwt.verify(token, config.secret);
  },
  parseWhere(map) {
    if (isEmpty(map)) return null;
    const where = { ...map };
    for (const key in where) {
      const arr = where[key];
      const option: any[] = [];
      where[`$${key}$`] = { [Op.or]: option };
      for (const { value, mode } of arr) {
        switch (mode) {
          case ENUM_MODE.is: {
            option.push({
              [Op.eq]: value,
            });
            break;
          }
          case ENUM_MODE.between: {
            option.push({
              [Op.between]: value,
            });
            break;
          }
          case ENUM_MODE.null: {
            if (value === 1) {
              option.push({
                [Op.ne]: null,
              });
            } else {
              option.push({
                [Op.eq]: null,
              });
            }
            break;
          }
          default: {
            option.push({
              [Op.like]: '%' + value + '%',
            });
            break;
          }
        }
      }
      delete where[key];
    }
    return { [Op.and]: where };
  },
  parseOrder(sorts) {
    if (isEmpty(sorts)) return null;
    const arry = sorts[0][0].split('.');
    return arry.length <= 2
      ? sorts.map(([key, sort]) => [this.ctx.model.col(`\`${key}\``), sort])
      : sorts.map(([key, sort]) => [
          this.ctx.model.literal(`\`${key}\``),
          sort,
        ]);
  },
};
export default helper;
