import path from 'path';
import { execSync } from 'child_process';
import info from '@app/omni/info.json';

execSync(
  `npx rimraf .git && git init && heroku git:remote -a ${info.deploymentInstance} && git add --all && git commit -m 'go' && git push -f heroku master`,
  { cwd: path.resolve('./var/build/release'), stdio: 'inherit' },
);
