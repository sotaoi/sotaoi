import { DatabaseConnection } from '@sotaoi/omni/definitions/db-connection';

const repository = 'friend-request';

export async function up(dbConnection: DatabaseConnection): Promise<any> {
  return dbConnection.schema.createTable(repository, function (table: DatabaseConnection.CreateTableBuilder) {
    table.bigIncrements('id').primary().unsigned();
    table.string('uuid', 36).unique().notNullable();

    table.string('sender').notNullable();
    table.string('receiver').notNullable();

    table.unique(['sender', 'receiver']);

    table.timestamp('createdAt').defaultTo(dbConnection.fn.now());
  });
}

export async function down(dbConnection: DatabaseConnection): Promise<any> {
  return dbConnection.schema.dropTableIfExists(repository);
}
