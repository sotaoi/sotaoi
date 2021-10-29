#!/bin/bash

## FUNCTIONS

stop_apache2_centos() {
  if [[ $(which systemctl) == "" ]]; then
    sudo service httpd stop
  else
    sudo systemctl stop httpd
    sudo systemctl disable httpd
  fi
}

## EXECUTION

if [[ $(which service) == "" ]]; then
  echo -e "\nservice command unavailable, exiting script...\n"
  exit 1
fi

echo "Running setup for CentOS...";

OS_VERSION="$(awk -F'.' '{sub(/.*[^0-9]/,"",$1); print $1}' <<< $(< /etc/redhat-release))"

sudo yum install -y curl file git gitk openssl wget gnupg nano sudo gpg net-tools epel-release yum-utils zip unzip
sudo yum install -y "http://rpms.remirepo.net/enterprise/remi-release-$OS_VERSION.rpm"
stop_apache2_centos

## NODE

if [[ $(which node) == "" || $(which npm) == "" || $(which npx) == "" ]]; then
  sudo yum autoremove -y nodejs
  curl -sL https://rpm.nodesource.com/setup_14.x -o ./nodesource_setup.sh
  sudo bash ./nodesource_setup.sh
  rm -f ./nodesource_setup.sh
  sudo yum install -y nodejs
  sudo npm install -g --force npm@7.24.1
fi

## NGINX, APACHE AND PHP

if [[ $(which php) == "" ]]; then
  echo "Installing PHP..."
  sudo yum-config-manager --enable remi-php73
  sudo yum install -y php-cli php php-soap php-fpm php-gd php-mysql php-common php-curl php-json php-mbstring php-xml php-zip php-bcmath
fi
if [[ $(which httpd) == "" ]]; then
  echo "Installing Apache2..."
  sudo yum -y install httpd
  stop_apache2_centos
fi
if [[ $(which nginx) == "" ]]; then
  echo "Installing NGINX..."
  sudo yum -y install epel-release
  sudo yum -y install nginx
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
  MONGODB_REPO_FILE="/etc/yum.repos.d/mongodb-org-4.4.repo"
  sudo touch $MONGODB_REPO_FILE
  echo "[mongodb-org-4.4]" >> $MONGODB_REPO_FILE
  echo "name=MongoDB Repository" >> $MONGODB_REPO_FILE
  echo "baseurl=https://repo.mongodb.org/yum/redhat/$OS_VERSION/mongodb-org/4.4/x86_64/" >> $MONGODB_REPO_FILE
  echo "gpgcheck=1" >> $MONGODB_REPO_FILE
  echo "enabled=1" >> $MONGODB_REPO_FILE
  echo "gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc" >> $MONGODB_REPO_FILE
  sudo yum install -y mongodb-org

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
  rpm -Uvh "https://repo.mysql.com/mysql80-community-release-el$OS_VERSION.rpm"
  yum --enablerepo=mysql80-community -y install mysql-community-server

  echo "Starting MySQL server"
  if [[ $(which systemctl) != "" ]]; then
    sudo systemctl daemon-reload
    sudo systemctl enable mysqld
    sudo systemctl stop mysqld
    sudo systemctl start mysqld
  else
    sudo service mysqld stop
    sudo service mysqld start
  fi

  TMP_ROOT_PASSWORD=$(grep 'A temporary password' /var/log/mysqld.log |tail -1 |awk '{split($0,a,": "); print a[2]}')
  echo "Temporary root password: $TMP_ROOT_PASSWORD"

  mysql --connect-expired-password -uroot --password="$TMP_ROOT_PASSWORD"\
    -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$TMP_ROOT_PASSWORD';"
  mysql -uroot --password="$TMP_ROOT_PASSWORD" -e "UNINSTALL COMPONENT 'file://component_validate_password';"
  mysql -uroot --password="$TMP_ROOT_PASSWORD"\
    -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_ROOT_PASSWORD';"
  
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
echo 'fs.inotify.max_user_watches = 524288' | sudo tee /etc/sysctl.d/99-whatever.conf 
sudo sysctl -p --system
#sudo sysctl -p
#npm run reset
npm run bootstrap
