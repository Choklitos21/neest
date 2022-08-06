import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOrmConfigService } from "./orm-config.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseOrmConfigService,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseOrmModule {}
