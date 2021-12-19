import { configService } from '../src/config/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = configService.getTypeOrmConfig();

export default TypeOrmConfig;
