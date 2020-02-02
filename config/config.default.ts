import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1560930183111_9481';

  // add your egg config in here
  config.middleware = ['client'];

  config.bodyParser = {
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
      text: ['text/xml', 'application/xml'],
    },
  };
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  };
  config.cors = {
    allowMethods: 'GET,PUT,POST,DELETE',
    credentials: true,
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    database: 'sample',
    define: {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  };
  config.jwt = {
    secret: '123456',
    userExpiresIn: 120 * 60, // s
    adminExpiresIn: 30 * 24 * 60 * 60, // s
  };
  config.client = {
    match: '/client',
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...(config as {}),
    ...bizConfig,
  };
};
