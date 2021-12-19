import {MigrationInterface, QueryRunner} from "typeorm";

export class init1639945609672 implements MigrationInterface {
    name = 'init1639945609672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "document"`);
    }

}
