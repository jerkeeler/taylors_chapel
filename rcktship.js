const rocket = require('rcktship');
const inquirer = require('inquirer');

const config = require('./config.json');

rocket.target('prod', [config.remote.prod.connection]);

rocket.mission('default', async () => {
  const currentCfg = config.remote[rocket.currentTarget];
  await checkEnvironment();

  await rocket.local('npm run build:prod')
  await rocket.local(`scp -r dist/ ${currentCfg.SSHAlias}:${currentCfg.remoteWorkingDir}/`);
  await rocket.with(`cd ${currentCfg.remoteWorkingDir}`, async () => {
    await rocket.remote('git reset --hard');
    await rocket.remote('git pull');
    await rocket.remote('yarn install --production --no-save');
    await rocket.remote('NODE_ENV=production ./node_modules/.bin/sequelize db:migrate');
  });
  await rocket.remote(`pm2 restart ${currentCfg.appName}`);
});

rocket.mission('restart', async () => {
  const currentCfg = config.remote[rocket.currentTarget];
  await checkEnvironment();
  await rocket.remote(`pm2 restart ${currentCfg.appName}`);
});

rocket.mission('migrate', async () => {
  const currentCfg = config.remote[rocket.currentTarget];
  await checkEnvironment();
  await rocket.with(`cd ${currentCfg.remoteWorkingDir}`, async () => {
    await rocket.remote('NODE_ENV=production ./node_modules/.bin/sequelize db:migrate');
  });
});

rocket.mission('test', async () => {
  await checkEnvironment();
  await rocket.remote('pwd');
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
