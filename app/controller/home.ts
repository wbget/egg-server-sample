import { Controller } from 'egg';
export default class extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.status = 404;
  }
  public async debug() {
    this.ctx.body = { result: true };
  }
}
