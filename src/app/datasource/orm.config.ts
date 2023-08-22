import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getTypeOrmConfig } from '.';

config();

const configService = new ConfigService();

export default new DataSource(getTypeOrmConfig(configService));
