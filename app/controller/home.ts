import { Controller } from 'egg';
export default class extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.status = 404;
  }
  public async admin() {
    const { type, value, uid } = this.ctx.request.body;
    const { managerId } = this.ctx;
    this.ctx.body = await this.service.finance.change(
      managerId,
      uid,
      type,
      value,
    );
  }
  public async debug() {
    await this.service.scanCode.create();
    this.ctx.body = { result: true };
  }
}
