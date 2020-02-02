const EnumAuth = {
  root: 0,
  admin: 1,
  manager: 2,
  role: 3,
  upload: 4,
};
interface Auth {
  authId: number;
  name: string;
}
const auth: Auth[] = [];
const reg = (authId, name) => auth.push({ authId, name });

// *********** 权限注册开始 ***********

reg(EnumAuth.root, '权限管理');
reg(EnumAuth.admin, '账号管理');
reg(EnumAuth.manager, '用户管理');
reg(EnumAuth.role, '角色分配管理');
reg(EnumAuth.upload, '图片上传');

// *********** 权限注册结束 ***********

const AUTH_MAP = auth.reduce((pre, next) => (pre[next.authId] = next), {});
export { EnumAuth };
export { auth as AUTH };
export { AUTH_MAP };
