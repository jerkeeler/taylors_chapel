const rocket = require('rcktship');
const inquirer = require('inquirer');

const config = require('./config.json');

rocket.target('prod', [config.remote.prod.connection]);

rocket.mission('default', async () => {
  const currentCfg = config.remote[rocket.currentTarget];
  await checkEnvironment();

  rocket.local('npm run build:prod')
  rocket.local(`scp -r dist/ ${currentCfg.SSHAlias}:${currentCfg.remoteWorkingDir}/`);
  rocket.with(`cd ${currentCfg.remoteWorkingDir}`, () => {
    rocket.remote('git reset --hard');
    rocket.remote('git pull');
    rocket.remote('yarn install --production --no-save');
    rocket.remote('NODE_ENV=production ./node_modules/.bin/sequelize db:migrate');
  });
  rocket.remote(`pm2 restart ${currentCfg.appName}`);
});

rocket.mission('restart', async () => {
  const currentCfg = config.remote[rocket.currentTarget];
  await checkEnvironment();
  rocket.remote(`pm2 restart ${currentCfg.appName}`);
})

rocket.mission('migrate', async () => {
  const currentCfg = config.remote[rocket.currentTarget];
  await checkEnvironment();
  rocket.with(`cd ${currentCfg.remoteWorkingDir}`, () => {
    rocket.remote('NODE_ENV=production ./node_modules/.bin/sequelize db:migrate');
  });
});

rocket.mission('test', async () => {
  await checkEnvironment();
  rocket.remote('pwd');
});

function checkEnvironment() {
  return new Promise(async (resolve, reject) => {
    if (rocket.currentTarget === 'prod') {
      let answer = await inquirer.prompt([{
        type: 'input',
        name: 'answer',
        message: 'Are you sure you wish to update production?'
      }]);
      answer = answer.answer;

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('ABORTING PROD UPDATE!');
        process.exit(1);
      }
    }
    resolve();
  });
}
