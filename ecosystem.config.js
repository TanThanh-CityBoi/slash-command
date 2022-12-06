const fs = require('fs');
!fs.existsSync('logs') && fs.mkdirSync('logs');

module.exports = {
  apps: [
    {
      name: `${process.env.npm_package_name}`,
      script: 'dist/main.js',
      args: 'src/main.ts',
      wait_ready: true,
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      log_date_format: '',
      min_uptime: 10000,
      max_restarts: 3,
      instances: 1,
    },
  ],
};
