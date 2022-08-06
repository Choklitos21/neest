import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import apiConfig from '../config/api.config';
import swaggerConfig from '../config/swagger.config';
import dbConfig from '../config/database.config';
import { validate } from '../config/env.config';

import { UserModule } from './user/user.module';
import { ProductsModule } from "./products/products.module";
import { DatabaseModule } from "./database/db.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, dbConfig, swaggerConfig],
      validate,
    }),
    DatabaseModule,
    UserModule,
    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
