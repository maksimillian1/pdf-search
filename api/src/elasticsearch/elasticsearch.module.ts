import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ElasticsearchModule as BaseElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { v4 as uuid }from 'uuid';
import { DocumentService } from '../documents/document.service';

@Module({
  imports: [
    BaseElasticsearchModule.register({
      node: 'http://localhost:9500',
      generateRequestId: () => uuid(),
      maxRetries: 10,
      requestTimeout: 60000,
    }),
  ],
  exports: [
    BaseElasticsearchModule,
  ],
})
export class ElasticsearchModule implements OnModuleInit {

  constructor(
    private readonly client: ElasticsearchService,
  ) {}

  public async createIndex() {
    const index = DocumentService.index;
    const checkIndex = await this.client.indices.exists({ index });
    // tslint:disable-next-line:early-exit
    if (checkIndex.statusCode === 404) {
      this.client.indices.create(
        {
          index,
          body: {
            mappings: {
              properties: {
                email: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  },
                },
                tags: {
                  properties: {
                    tag: {
                      type: 'text',
                      fields: {
                        keyword: {
                          type: 'keyword',
                          ignore_above: 256,
                        },
                      },
                    },
                  },
                },
                text: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  },
                },
                title: {
                  type: 'text',
                  fields: {
                    keyword: {
                      type: 'keyword',
                      ignore_above: 256,
                    },
                  },
                },
              },
            },
            settings: {
              analysis: {
                filter: {
                  autocomplete_filter: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 20,
                  },
                },
                analyzer: {
                  autocomplete: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'autocomplete_filter'],
                  },
                },
              },
            },
          },
        },
        (err: any) => {
          if (err) {
            console.log(err);
          }
        },
      );
    }
  }

  public async onModuleInit() {
    await this.createIndex();

    interface CorrelationInfos {
      startTime: Date;
    }

    const correlationsMap = new Map<string, CorrelationInfos>();

    const logger = new Logger('Elasticsearch');

    this.client.on('request', (err, result) => {
      const { id } = result.meta.request;

      /**
       * We could have skipped the use of a correlations map by adding the start time to the request metadata
       * but we don't know what Elasticsearch does with the meta.request inside the lib so this is safer.
       */
      correlationsMap.set(id, { startTime: new Date() });
    });

    this.client.on('response', (err, result) => {
      const { statusCode, meta: { request: { id }, attempts }, body } = result;

      // Retrieve the correlation infos
      const correlationInfos = correlationsMap.get(id);

      // We don't want these correlation infos to accumulate
      correlationsMap.delete(id);

      if (!correlationInfos) {
        logger.error(`Response has an unknown correlation ID`); // It should not happen
        return;
      }

      const now = new Date();
      const duration = now.getTime() - correlationInfos.startTime.getTime();

      // Build the log message
      let message = `${duration}ms`;
      if (statusCode) {
        // statusCode is null when ES is down
        message = `${statusCode} - ${message}`;
      }
      if (attempts > 1) {
        // Log the # of attempts only when relevant
        message = `${message} - ${attempts} attemps`;
      }
      let logFn = logger.log.bind(logger);
      if (body && body.headers) {
        // No body nor headers when ES is down (and probably in case of some other serious errors)
        message = `${message} - content-length: ${body.headers['content-length']}`;
      }
      if (err) {
        message = `${message} - ${err.stack}`;
        logFn = logger.error.bind(logger);
      }

      logFn(message);
    });
  }
}
