import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('API_PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('DS_HOST'),
      port: parseInt(this.getValue('DS_PORT_EXTERNAL')),
      username: this.getValue('DS_USER'),
      password: this.getValue('DS_PASSWORD'),
      database: this.getValue('DS_DATABASE'),
      entities: ['dist/src/**/*.entity{.ts,.js}'],
      migrationsTableName: 'migration',
      migrationsRun: true,
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: 'dist/db/migrations',
      },

      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'DS_HOST',
    'DS_PORT_EXTERNAL',
    'DS_USER',
    'DS_PASSWORD',
    'DS_DATABASE'
  ]);

export { configService };
