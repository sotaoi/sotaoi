import fs from 'fs';
import path from 'path';

const main = async (): Promise<void> => {
  const envPath = path.resolve('./.env');
  const envExamplePath = path.resolve('./.env.example');
  if (fs.existsSync(envPath)) {
    console.warn('.env file exists, exiting script...');
    process.exit(0);
  }

  fs.copyFileSync(envExamplePath, envPath);

  // todo highprio: ask for domain
};

main();
