import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {join} from 'path';
import {readFileSync} from 'fs';
import PdfParse from 'pdf-parse';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export interface PdfParseResult {
  text: string,
  metadata: any
}

export interface DocumentSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: DocumentEntity;
    }>;
  };
}

@Injectable()
export class DocumentService {
  public static readonly index = 'document';

  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  getDocuments(): Promise<DocumentEntity[]> {
    return this.documentRepository.find();
  }

  async createDocument(documentDTO: { url: string, title: string }): Promise<DocumentEntity> {
    const res = await this.parsePDF(documentDTO.url);
    const entity = await this.documentRepository.save(documentDTO);
    await this.indexDocument({...entity, content: res.text});

    return entity;
  }

  private async parsePDF(path: string): Promise<PdfParseResult> {
    const dataBuffer = readFileSync(join(path));
    const {text, metadata} = await PdfParse(dataBuffer);

    return {text, metadata};
  }

  async indexDocument(document: DocumentEntity & {content: string}) {
    const index = this.elasticsearchService.index<DocumentEntity & {content: string}>({
      index: DocumentService.index,
      body: document
    });

    await this.elasticsearchService.indices.refresh({index: DocumentService.index});

    return index;
  }

  async search(text: string) {
    const {body} = await this.elasticsearchService.search<DocumentSearchResult>({
      index: DocumentService.index,
      body: {
        query: {
          multi_match : {
            query:      text,
            fields:     [ "content", "title" ]
          }
        },
      }
    });

    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}
