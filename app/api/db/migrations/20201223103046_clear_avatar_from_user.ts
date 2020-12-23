import { DatabaseConnection } from '@sotaoi/omni/definitions/db-connection';

const repository = 'user';

export async function up(dbConnection: DatabaseConnection): Promise<any> {
  await dbConnection.table(repository).update({ avatar: null });
}

export async function down(dbConnection: DatabaseConnection): Promise<any> {
  // do nothing
}
