import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SearchModule } from '../search/search.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => callback(null, file.originalname),
      }),
    }),
    SearchModule,
  ],
  controllers: [
    DocumentController,
  ],
  providers: [DocumentService]
})
export class DocumentsModule {}
