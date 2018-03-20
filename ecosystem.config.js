const config = require('./config.json');

module.exports = {
  apps : [
    {
      name: config.pm2.appName,
      script: './bin/www',
      cwd: config.pm2.workingDir,
      env: {
        LOG_LEVEL: 'debug',
        PORT: 3000,
        NODE_ENV: 'development'
      },
      env_production: {
        LOG_LEVEL: 'info',
        PORT: config.pm2.port,
        NODE_ENV: 'production'
      },
      instances: 2
    },
  ],
};
