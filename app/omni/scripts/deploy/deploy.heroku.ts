import path from 'path';
import { execSync } from 'child_process';
import appInfo from '@app/omni/app-info.json';

execSync(
  `npx rimraf .git && git init && heroku git:remote -a ${appInfo.deploymentInstance} && git add --all && git commit -m 'go' && git push -f heroku master`,
  { cwd: path.resolve('./var/build/release'), stdio: 'inherit' },
);
