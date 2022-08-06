import { MigrationInterface, QueryRunner } from "typeorm";

export class initDatabase1659808336120 implements MigrationInterface {
    name = 'initDatabase1659808336120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" text NOT NULL,
                "description" character varying,
                "stocks" integer NOT NULL DEFAULT '0',
                "size" text NOT NULL,
                "gender" text NOT NULL,
                "price" integer NOT NULL,
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "product"
        `);
    }

}
