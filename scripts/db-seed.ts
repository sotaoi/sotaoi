import { main as apiMain } from '@app/api/main';
import { seed } from '@sotaoi/api/db';
import { logger } from '@sotaoi/api/logger';

const main = async (): Promise<void> => {
  try {
    await apiMain(true);
    await seed();
    console.log('\nSeeding complete\n');
    process.exit(0);
  } catch (err) {
    logger().error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
};

main();
