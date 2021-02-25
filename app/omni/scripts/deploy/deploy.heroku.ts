import path from 'path';
import { execSync } from 'child_process';
import { getAppInfo } from '@app/omni/get-app-info';

execSync(
  `npx rimraf .git && git init && heroku git:remote -a ${
    getAppInfo().deploymentInstance
  } && git add --all && git commit -m 'go' && git push -f heroku master`,
  { cwd: path.resolve('./var/build/release'), stdio: 'inherit' },
);
