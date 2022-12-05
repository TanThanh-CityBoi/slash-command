yarn build-server

if [ -d "dist-backup" ]; then
  rm -rf dist-backup
fi

if [ -d "dist" ]; then
  mv dist dist-backup
fi

mv pre-dist dist

pm2 reload ecosystem.config.js
