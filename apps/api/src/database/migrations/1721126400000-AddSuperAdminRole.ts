import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuperAdminRole1721126400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "users_role_enum" ADD VALUE IF NOT EXISTS 'super_admin'`,
    );
  }

  public async down(): Promise<void> {
    // Postgres does not support removing enum values
  }
}
