import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  // config.tenpay = {
  //   client: {
  //     appid: 'wx67726a08297df3b9',
  //     mchid: '1537564501',
  //     partnerKey: '32d7f115af338da7e5b29f4460be901e',
  //     notify_url: 'https://server.87871153.com/notify/weapp',
  //     sandbox: true,
  //   },
  // };
  return { ...(config as {}) };
};
