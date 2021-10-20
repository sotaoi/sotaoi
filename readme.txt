# optional / source debian
wget -O debian.sh https://raw.githubusercontent.com/sotaoi/sotaoieco/dev/shell/source/debian.sh && source ./debian.sh && rm -f ./debian.sh
# optional / setup debian
git clone https://github.com/sotaoi/sotaoieco sotaoieco && cd ./sotaoieco
cp .env.example .env
nano .env
./shell/setup.sh .env

# optional / source centos
wget -O centos.sh https://raw.githubusercontent.com/sotaoi/sotaoieco/dev/shell/source/centos.sh && source ./centos.sh && rm -f ./centos.sh
# optional / setup centos
git clone https://github.com/sotaoi/sotaoieco sotaoieco && cd ./sotaoieco
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
npm run install:rnsdk // downloads around 2.21 GB, local java and android for mac and linux

# mobile development
npm run start:rn
npm run start:ios
npm run start:android

# notes / ubuntu
sudo ufw allow https
sudo ufw allow http
sudo ufw allow 'Nginx Full'
# notes / centos
sudo firewall-cmd --zone=public --add-service=https
sudo firewall-cmd --zone=public --add-service=http
