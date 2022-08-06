import { DatabaseOrmModule } from '@bsl/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from '../../config/database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    DatabaseOrmModule,
  ],
})
export class DatabaseModule {}