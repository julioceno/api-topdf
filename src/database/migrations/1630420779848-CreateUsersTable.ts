import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1630420779848 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable( new Table({
            name: "users",
            columns: [
                {
                  name: 'id',
                  type: 'varchar',
                  isPrimary: true,
                  generationStrategy: 'uuid',
                },
                {
                  name: 'email',
                  type: 'varchar',
                },
                {
                  name: 'password',
                  type: 'varchar'
                },
                {
                  name: "password_reset_token",
                  type: "varchar",
                  isNullable: true
                },
                {
                  name: "password_reset_expires",
                  type: "timestamp",
                  isNullable: true
                },
                {
                  name: 'created_at',
                  type: 'timestamp',
                  default: 'now()',
                },
                {
                  name: 'updated_at',
                  type: 'timestamp',
                  default: 'now()',
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}
