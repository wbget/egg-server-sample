enum trade {
  /**
   * 关闭
   */
  Close = -1,
  /**
   * 未支付
   */
  None = 0,
  /**
   * 支付中
   */
  Paying = 1,
  /**
   * 已支付
   */
  Payed = 2,
  /**
   * 配送中
   */
  Deliver = 3,
  /**
   * 已到达
   */
  Delivered = 4,
  /**
   * 已完成
   */
  Done = 5,
}
export default trade;
