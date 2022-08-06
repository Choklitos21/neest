import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as dotenv from 'dotenv';
import { join } from 'path';
/*TO DO: Fix path environment file*/
/*import { sync } from 'find-up';*/

dotenv.config({
  path: join(__dirname, '.env')
})

class Environment {
  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_USERNAME: string;

  @IsNotEmpty()
  @IsInt()
  DATABASE_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {

  const validated = plainToClass(Environment, config, {
    enableImplicitConversion: true
  })

  const errors = validateSync(validated, {
    skipMissingProperties: false
  })

  if(errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validated

}