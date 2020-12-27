import { DatabaseConnection } from '@sotaoi/omni/definitions/db-connection';

const repository = 'post';

export async function up(dbConnection: DatabaseConnection): Promise<any> {
  return dbConnection.schema.alterTable(repository, function (table: DatabaseConnection.AlterTableBuilder) {
    table.string('image').nullable();
  });
}

export async function down(dbConnection: DatabaseConnection): Promise<any> {
  return dbConnection.schema.alterTable(repository, function (table: DatabaseConnection.AlterTableBuilder) {
    table.dropColumn('image');
  });
}
