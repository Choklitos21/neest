import { join } from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { sync as findUpSync } from 'find-up';

dotenv.config({ path: findUpSync(process.env.ENV_FILE || '.env') });

const config = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'dev',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
};

const dataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  database: config.database,
  entities: [join(__dirname, '..', 'src', '**', '*.entity.{ts,js}')],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
  logging: ['warn', 'error'],
  logger: process.env.NODE_ENV === 'production' ? 'file' : 'debug',
  migrations: [
    join(__dirname, '..', 'src', 'database', 'migrations', '*.{ts,js}'),
  ],
});

export default dataSource;
