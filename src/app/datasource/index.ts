import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from './naming.strategy';

export const getTypeOrmConfig = (
  configService: ConfigService,
): DataSourceOptions & TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [
      path.join(__dirname, 'src/app/datasource/entities', '*.entity.ts'),
    ],
    autoLoadEntities: true,
    migrations: [path.join(__dirname, 'src/app/datasource/migrations', '*.ts')],
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    migrationsTransactionMode: 'each',
    synchronize: true,
  };
};
