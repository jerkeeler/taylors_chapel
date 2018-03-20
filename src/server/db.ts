import * as path     from 'path';
import { Sequelize } from 'sequelize-typescript';
import * as dbConfig from '../database-config.json';

const env = process.env.NODE_ENV;

export const db = new Sequelize({
  name: 'db',
  dialect: 'sqlite',
  username: '',
  password: '',
  storage: (<any>dbConfig)[env].storage,
  modelPaths: [path.resolve(__dirname, 'models')],
  logging: (<any>dbConfig).logging || false,
  operatorsAliases: false
});
