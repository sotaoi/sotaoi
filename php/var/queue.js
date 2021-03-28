#!/usr/bin/env node

const { exec } = require('child_process');

exec('php artisan queue:work --timeout=0 > ./output.log 2>&1')
exec('php artisan queue:work --timeout=0 > ./output.log 2>&1')
exec('php artisan queue:work --timeout=0 > ./output.log 2>&1')
exec('php artisan queue:work --timeout=0 > ./output.log 2>&1')
