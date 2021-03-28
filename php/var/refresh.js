const { exec, execSync } = require('child_process');
// const fs = require('fs');

// fs.existsSync('./vendor') && fs.rmdirSync('./vendor', { recursive: true });
execSync('composer -n install', { stdio: 'inherit' });
exec('npm install');
execSync('php artisan view:clear', { stdio: 'inherit' });
execSync('php artisan config:clear', { stdio: 'inherit' });
execSync('php artisan cache:clear', { stdio: 'inherit' });
execSync('composer -n dump-autoload');
execSync('php artisan config:cache', { stdio: 'inherit' });
execSync('php artisan view:cache', { stdio: 'inherit' });
execSync('php artisan queue:restart', { stdio: 'inherit' });
execSync('npm run apidoc', { stdio: 'inherit' });
execSync('npm run restart-supervisor', { stdio: 'inherit' });
