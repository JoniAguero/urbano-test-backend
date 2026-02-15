import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { DataSourceOptions } from 'typeorm';

// Try to find .env files: first in src/common/envs, then relative to compiled dist
const possiblePaths = [
  resolve(process.cwd(), 'src/common/envs/development.env'),
  resolve(__dirname, '../..', 'common/envs/development.env'),
  resolve(__dirname, '../../..', 'src/common/envs/development.env'),
];
const envFilePath = possiblePaths.find((p) => existsSync(p)) || possiblePaths[0];
config({ path: envFilePath });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: [process.env.DATABASE_ENTITIES],
  migrations: ['dist/database/migration/history/*.js'],
  logger: 'simple-console',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};
