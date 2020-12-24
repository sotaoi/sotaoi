import { DatabaseConnection } from '@sotaoi/omni/definitions/db-connection';

const repository = 'user';

export async function up(dbConnection: DatabaseConnection): Promise<any> {
  return dbConnection.schema.alterTable(repository, function (table: DatabaseConnection.AlterTableBuilder) {
    table.string('avatar').nullable().after('password');
  });
}

export async function down(dbConnection: DatabaseConnection): Promise<any> {
  return dbConnection.schema.alterTable(repository, function (table: DatabaseConnection.AlterTableBuilder) {
    table.dropColumn('avatar');
  });
}
