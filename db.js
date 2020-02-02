'use strict';

const shell = require('shelljs');
const { Select, Input } = require('enquirer');

// cnpm install -g sequelize-cli
const cmd = 'sequelize';
const types = {
  migrate: 'migreate',
  init: 'init-table',
  update: 'update-table',
  undo: 'undo',
  undoAll: 'undo:all'
};
// const npx = 'npx sequelize-cli';
const migrate = () => shell.exec(`${cmd} db:migrate`);
const undo = () => shell.exec(`${cmd} db:migrate:undo`);
const undoAll = () => shell.exec(`${cmd} db:migrate:undo:all`);
const generate = name => shell.exec(`${cmd} migration:generate --name=${name}`);

async function main() {
  const select = new Select({
    name: 'operation',
    message: 'Pick a Operate',
    choices: [
      types.migrate,
      types.init,
      types.update,
      types.undo,
      types.undoAll
    ]
  });

  const answer = await select.run();
  switch (answer) {
    case types.migrate: {
      migrate();
      break;
    }
    case types.init: {
      const gen = new Input({
        message: 'file name?',
        initial: 'init-xxx'
      });
      generate(await gen.run());
      break;
    }
    case types.update: {
      const gen = new Input({
        message: 'file name?',
        initial: 'update-xxx'
      });
      generate(await gen.run());
      break;
    }
    case types.undo: {
      undo();
      break;
    }
    case types.undoAll: {
      undoAll();
      break;
    }
    default: {
      throw Error('operate deny');
    }
  }
}
main();
