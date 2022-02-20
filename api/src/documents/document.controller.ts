import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentEntity } from './document.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  getDocuments(): Promise<DocumentEntity[]> {
    return this.documentService.getDocuments();
  }

  @Get('search')
  searchDocuments(@Query('q') q: string): Promise<DocumentEntity[]> {
    return this.documentService.search(q);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createDocument(@Body() body: { url: string, title: string }, @UploadedFile() file: Express.Multer.File): Promise<DocumentEntity> {

    return this.documentService.createDocument({url: file.path, title: body.title});
  }
}
