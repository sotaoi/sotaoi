#!/bin/bash

export HOMEPATH=$HOME
#export SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
#export NVM_DIR="$HOME/.nvm"

refreshSourceLinux() {
    source $HOMEPATH/.bashrc > /dev/null 2>&1
    source $HOMEPATH/.nvm/nvm.sh > /dev/null 2>&1
    source $HOMEPATH/.profile > /dev/null 2>&1
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Running setup for Mac...";
  if [[ $(which apachectl) != "" ]]; then
    sudo apachectl -k stop
    sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist
  fi
  if [[ $(which node) == "" ]]; then
    echo "Installing Node..."
    brew install node@14
    brew unlink node && brew unlink node@14 && brew link --force --overwrite node@14
  fi
  if [[ $(which php) == "" ]]; then
    echo "Installing PHP..."
    brew install php@7.3
    brew unlink php && brew unlink php@7.3 && brew link --force --overwrite php@7.3
  fi
  if [[ $(which composer) == "" ]]; then
    echo "Installing Composer..."
    brew install composer
    brew unlink composer && brew link --force --overwrite composer
  fi
  if [[ $(which mongo) == "" ]]; then
    echo "Installing MongoDB..."
    brew tap mongodb/brew
    brew install mongodb-community@4.4
    brew services start mongodb-community@4.4
  fi
  sudo sysctl -w kern.maxfiles=2097152
  echo -e "\ndone\n"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  if [[ $(which apt) != "" ]]; then
    if [[ $(which systemctl) == "" ]]; then
      echo -e "\nsystemctl unavailable, exiting script...\n"
      exit 1
    fi

    echo "Running setup for Debian based distribution...";
    refreshSourceLinux
    sudo apt -y update

    sudo systemctl stop apache2
    sudo systemctl disable apache2

    sudo apt -y install build-essential curl file git libpcre3-dev libssl-dev software-properties-common openssl gitk
    if [[ $(which node) == "" ]]; then
      if [[ $(which nvm) == "" ]]; then
        echo "Installing NVM..."
        curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
        refreshSourceLinux
      fi
      echo "Setting up Node..."
      nvm install 14
      nvm use 14
    fi
    if [[ $(which php) == "" ]]; then
      echo "Installing PHP..."
      sudo add-apt-repository -y ppa:ondrej/php
      sudo apt -y update
      sudo apt -y install php7.3-cli php7.3 php7.3-fpm php7.3-mysql libapache2-mod-php7.3 libapache2-mod-fcgid
      sudo apt -y install php7.3-common php7.3-curl php7.3-json php7.3-mbstring php7.3-xml php7.3-zip php7.3-bcmath
      refreshSourceLinux
    fi
    if [[ $(which composer) == "" ]]; then
      echo "Installing Composer..."
      curl -sS https://getcomposer.org/installer -o "$HOMEPATH/composer-setup.php"
      sudo php "$HOMEPATH/composer-setup.php" --install-dir=/usr/local/bin --filename=composer
      rm "$HOMEPATH/composer-setup.php"
      refreshSourceLinux
    fi
    if [[ $(which mongo) == "" ]]; then
      echo "Installing MongoDB..."
      wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
      sudo apt -y install gnupg
      wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
      echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
      sudo apt -y update
      sudo apt install -y mongodb-org
      sudo systemctl daemon-reload
      sudo systemctl start mongod
    fi
    sudo bash -c 'echo "net.ipv4.ip_unprivileged_port_start=0" > /etc/sysctl.d/50-unprivileged-ports.conf'
    sudo sysctl --system
    echo fs.inotify.max_user_watches=2097152 | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    exec bash
    echo -e "\ndone\n"
  elif [[ $(whichwhich yum) != "" ]]; then
    echo -e "\nCentOS / RedHat are not supported, exiting...\n"
    exit 1
  else
    echo -e "\nUnsupported Linux distribution, exiting...\n";
    exit 1
  fi
else
  echo -e "\nUnsupported OS, exiting...\n"
  exit 1
fi
