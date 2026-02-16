import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { DataSourceOptions } from 'typeorm';

// Only load .env file in local dev (when no DATABASE_URL or DATABASE_HOST is set)
if (!process.env.DATABASE_URL && !process.env.DATABASE_HOST) {
  const possiblePaths = [
    resolve(process.cwd(), 'src/common/envs/development.env'),
    resolve(__dirname, '../..', 'common/envs/development.env'),
    resolve(__dirname, '../../..', 'src/common/envs/development.env'),
  ];
  const envFilePath = possiblePaths.find((p) => existsSync(p));
  if (envFilePath) {
    config({ path: envFilePath });
  }
}

// Railway provides DATABASE_URL; local dev uses individual vars
const baseConfig = {
  type: 'postgres' as const,
  entities: [process.env.DATABASE_ENTITIES || 'dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migration/history/*.js'],
  logger: 'simple-console' as const,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};

export const dataSourceOptions: DataSourceOptions = process.env.DATABASE_URL
  ? { ...baseConfig, url: process.env.DATABASE_URL }
  : {
    ...baseConfig,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  };
