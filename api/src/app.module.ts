import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { configService } from './config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => configService.getTypeOrmConfig()
    }),
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
