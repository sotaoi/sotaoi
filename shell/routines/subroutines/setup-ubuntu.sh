#!/bin/bash

## FUNCTIONS

stop_apache2_ubuntu() {
  if [[ $(which systemctl) == "" ]]; then
    sudo service apache2 stop
  else
    sudo systemctl stop apache2
    sudo systemctl disable apache2
  fi
}

## EXECUTION

if [[ $(which service) == "" ]]; then
  echo -e "\nservice command unavailable, exiting script...\n"
  exit 1
fi

echo "Running setup for Debian based distribution...";

DEBIAN_FRONTEND=noninteractive

echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null

OS_CODENAME="$(lsb_release -cs)"

sudo touch /etc/apt/apt.conf.d/99verify-peer.conf \
  && sudo echo >>/etc/apt/apt.conf.d/99verify-peer.conf "Acquire { https::Verify-Peer false }"

DEBIAN_FRONTEND=noninteractive sudo apt-key list | \
  grep "expired: " | \
  sed -ne 's|pub .*/\([^ ]*\) .*|\1|gp' | \
  DEBIAN_FRONTEND=noninteractive xargs -n1 sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys

DEBIAN_FRONTEND=noninteractive sudo apt --yes --force-yes -o Dpkg::Options::="--force-confdef" update
DEBIAN_FRONTEND=noninteractive sudo apt install --yes --force-yes -o Dpkg::Options::="--force-confdef" \
  build-essential curl file git gitk libpcre3-dev libssl-dev software-properties-common zip unzip
DEBIAN_FRONTEND=noninteractive sudo apt install --yes --force-yes -o Dpkg::Options::="--force-confdef" \
  openssl wget gnupg lsb-core nano sudo gpg net-tools
stop_apache2_ubuntu

## NODE

if [[ $(which node) == "" || $(which npm) == "" || $(which npx) == "" ]]; then
  sudo apt autoremove -y nodejs
  curl -sL https://deb.nodesource.com/setup_14.x -o ./nodesource_setup.sh
  sudo bash ./nodesource_setup.sh
  rm ./nodesource_setup.sh
  DEBIAN_FRONTEND=noninteractive sudo apt install -y nodejs
  sudo npm install -g --force npm@7.24.1
fi

## NGINX, APACHE AND PHP

if [[ $(which php) == "" ]]; then
  echo "Installing PHP..."
  sudo add-apt-repository -y ppa:ondrej/php
  DEBIAN_FRONTEND=noninteractive sudo apt -y update
  DEBIAN_FRONTEND=noninteractive sudo apt install -y php7.3-soap php7.3-cli php7.3 php7.3-fpm php7.3-gd php7.3-mysql libapache2-mod-php7.3 libapache2-mod-fcgid
  DEBIAN_FRONTEND=noninteractive sudo apt install -y php7.3-common php7.3-curl php7.3-json php7.3-mbstring php7.3-xml php7.3-zip php7.3-bcmath
fi
if [[ $(which apache2) == "" ]]; then
  echo "Installing Apache2..."
  DEBIAN_FRONTEND=noninteractive sudo apt -y update
  DEBIAN_FRONTEND=noninteractive sudo apt install -y apache2
  stop_apache2_ubuntu
fi
if [[ $(which nginx) == "" ]]; then
  echo "Installing NGINX..."
  sudo apt -y install nginx
fi
sudo systemctl stop nginx
sudo systemctl disable nginx
if [[ $(which composer) == "" ]]; then
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php -r "if (hash_file('sha384', 'composer-setup.php') === '906a84df04cea2aa72f40b5f787e49f22d4c2f19492ac310e8cba5b96ac8b64115ac402c8cd292b8a03482574915d1a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
  php composer-setup.php
  php -r "unlink('composer-setup.php');"
  sudo mv composer.phar /usr/local/bin/composer
fi

## MONGO

if [[ $(which mongo) == "" ]]; then
  echo "Installing MongoDB..."
  wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | DEBIAN_FRONTEND=noninteractive sudo apt-key add -
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $OS_CODENAME/mongodb-org/4.4 multiverse"\
    | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
  DEBIAN_FRONTEND=noninteractive sudo apt -y update
  DEBIAN_FRONTEND=noninteractive sudo apt install -y mongodb-org
  
  if [[ $(which systemctl) != "" ]]; then
    sudo systemctl daemon-reload
    sudo systemctl enable mongod
    sudo systemctl stop mongod
    sudo systemctl start mongod
  else
    sudo service mongod stop
    sudo service mongod start
  fi
fi

## MYSQL

if [[ $(which mysql) == "" ]]; then
  echo "Installing MySQL..."
  DEBIAN_FRONTEND=noninteractive sudo apt install -y mysql-server-8.0 mysql-client-8.0

  echo "Starting MySQL server"
  if [[ $(which systemctl) != "" ]]; then
    sudo systemctl daemon-reload
    sudo systemctl enable mysql
    sudo systemctl stop mysql
    sudo systemctl start mysql
  else
    sudo service mysql stop
    sudo service mysql start
  fi

  sudo mysql -e "UNINSTALL COMPONENT 'file://component_validate_password';"
  sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_ROOT_PASSWORD';"
  
  echo "Removing anonymous users..."
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "DELETE FROM mysql.user WHERE User='';"
  echo "Disallowing remote root login..."
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
  echo "Removing test database..."
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "DROP DATABASE test;"
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%'"
  echo "Reloading privilege tables..."
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"
fi

mysql_setup

## OTHER

sudo bash -c 'echo "net.ipv4.ip_unprivileged_port_start=0" > /etc/sysctl.d/50-unprivileged-ports.conf'
sudo sysctl --system
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
#npm run reset
npm run bootstrap
