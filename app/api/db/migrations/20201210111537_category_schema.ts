import { DatabaseConnection } from '@sotaoi/omni/definitions/db-connection';

const repository = 'category';

export async function up(dbConnection: DatabaseConnection): Promise<void> {
  return dbConnection.schema.createTable(repository, function (table: DatabaseConnection.CreateTableBuilder) {
    table.bigIncrements('id').primary().unsigned();
    table.string('uuid', 36).unique().notNullable();
    table.string('name').notNullable();
    table.timestamp('createdAt').defaultTo(dbConnection.fn.now());
  });
}

export async function down(dbConnection: DatabaseConnection): Promise<void> {
  return dbConnection.schema.dropTableIfExists(repository);
}
