import { main as apiMain } from '@app/api/main';
import { seed } from '@sotaoi/api/db';

const main = async (): Promise<void> => {
  await apiMain(true);
  await seed();
  console.log('\nSeeding complete\n');
  process.exit(0);
};

main();
