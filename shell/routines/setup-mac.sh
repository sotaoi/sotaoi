#!/bin/bash

## EXECUTION

echo "Running setup for Mac...";

if [[ $(which brew) == "" ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

if [[ $(which gls) == "" ]]; then
  brew install coreutils
fi

## NODE

if [[ $(which node) == "" ]]; then
  echo "Installing Node..."
  # brew uninstall node@14
  # sudo rm -rf ~/.npm
  # sudo rm -f /usr/local/bin/npm
  # sudo rm -f /usr/local/bin/npx
  # sudo rm -rf /usr/local/lib/node_modules
  brew install node@14
  brew unlink node
  brew unlink node@14
  brew link --force --overwrite node@14
  # npm cache clean -f
  npm install -g --force npm@7.24.1
fi

## PHP AND APACHE

if [[ $(which apachectl) != "" && $(which apachectl) != "/usr/local/sbin/apachectl" ]]; then
  echo "Installing Apache2..."
  sudo apachectl -k stop
  sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist
  brew install httpd
  brew unlink httpd
  brew link --force --overwrite httpd
  brew services stop httpd
  sudo pkill -f httpd
  sudo pkill -f apachectl
  sudo mv /usr/local/bin/apachectl ~/bak.localbin.apachectl
  touch /usr/local/sbin/apachectl
  chmod 755 /usr/local/sbin/apachectl
elif [[ $(which httpd) == "" ]]; then
  echo "Installing Apache2..."
  brew install httpd
  brew unlink httpd
  brew link --force --overwrite httpd
  brew services stop httpd
  sudo pkill -f httpd
fi
if [[ $(which nginx) == "" ]]; then
  echo "Installing NGINX..."
  brew install nginx
fi
brew services stop nginx
sudo systemctl stop nginx
sudo systemctl disable nginx
if [[ $(which php) == "" ]]; then
  echo "Installing PHP..."
  brew install php@7.3
  brew unlink php
  brew unlink php@7.3
  brew link --force --overwrite php@7.3
fi
if [[ $(which composer) == "" ]]; then
  echo "Installing Composer..."
  brew install composer
  brew unlink composer
  brew link --force --overwrite composer
fi

## MONGO

if [[ $(which mongo) == "" ]]; then
  echo "Installing MongoDB..."
  brew tap mongodb/brew
  brew install mongodb-community@4.4
  brew unlink mongodb-community
  brew link --force --overwrite mongodb-community
  brew services start mongodb-community
fi

## MYSQL

if [[ $(which mysql) == "" ]]; then
  echo "Installing MySQL..."
  brew install mysql@8.0
  brew unlink mysql
  brew unlink mysql@8.0
  brew link --force --overwrite mysql@8.0
fi
brew services start mysql
mysql_setup

## OTHER

sudo sysctl -w kern.maxfiles=524288
#npm run reset
npm run bootstrap
