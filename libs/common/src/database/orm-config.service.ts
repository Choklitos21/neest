import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';


@Injectable()
export class DatabaseOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {

    const defaultConfig: PostgresConnectionCredentialsOptions = {
      port: this.configService.get<number>('db.port'),
      host: this.configService.get('db.host'),
      database: this.configService.get('db.name'),
      password: this.configService.get('db.password'),
      username: this.configService.get('db.username'),
    };
    return {
      name: 'default',
      type: 'postgres',
      autoLoadEntities: true,
      logging: ['warn', 'error'],
      // We are using migrations, synchronize should be set to false.
      synchronize: false,
      dropSchema: false,
      ...defaultConfig,
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      migrationsRun: true,
      migrationsTransactionMode: 'all',
      migrations: [join(__dirname, 'src/database/migrations', '*.js')],
    };
  }
}