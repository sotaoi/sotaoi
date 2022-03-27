# optional / source ubuntu
wget -O ubuntu.sh https://raw.githubusercontent.com/sotaoi/sotaoi/master/shell/source/ubuntu.sh && source ./ubuntu.sh && rm -f ./ubuntu.sh
# optional / setup ubuntu
git clone https://github.com/sotaoi/sotaoi sotaoi && cd ./sotaoi
cp .env.example .env
nano .env
./shell/setup.sh .env

# boot
npm install --no-audit --no-fund && npm run set:ecosystem && npm run bootstrap

# migrate and seed
npm run db:migrate
npm run db:seed

# run api
npm run start:api
# run web
npm run start:web

# optional
npm run install:certs // place bundle.pem, cert.pem, chain.pem, fullchain.pem, privkey.pem under ./certs folder before running the script
# optional
npm run install:rnsdk // downloads around 2.21 GB, local java and android for mac and ubuntu

# mobile development
npm run start:rn
npm run start:ios
npm run start:android

# notes / ubuntu
sudo ufw allow https
sudo ufw allow http
sudo ufw allow 'Nginx Full'
