import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/base-entity';

@Entity({ name: 'document' })
export abstract class DocumentEntity extends BaseEntity {

  @Column('varchar')
  title: string;

  @Column('varchar')
  url: string;
}
