#!/bin/bash

export HOMEPATH=~/
#export SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
#export NVM_DIR="$HOME/.nvm"
refreshSource() {
    source $HOMEPATH.bashrc > /dev/null 2>&1
    source $HOMEPATH.nvm/nvm.sh > /dev/null 2>&1
    source $HOMEPATH.profile > /dev/null 2>&1
}

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  if [[ $(which apt) != "" ]]; then
    echo "Running setup for Debian based distribution...";
    refreshSource
    #sudo apt -y update
    sudo apt -y install build-essential curl file git libpcre3-dev libssl-dev software-properties-common openssl
    if [[ $(which node) == "" ]]; then
      if [[ $(which nvm) == "" ]]; then
        echo "Installing NVM..."
        curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
        refreshSource
      fi
      echo "Setting up Node..."
      nvm install 14
      nvm use 14
    fi
    if [[ $(which php) == "" ]]; then
      echo "Installing PHP..."
      sudo add-apt-repository -y ppa:ondrej/php
      sudo apt -y update
      sudo apt -y install php7.3 php7.3-fpm php7.3-mysql libapache2-mod-php7.3 libapache2-mod-fcgid
      sudo apt -y install php7.3-common php7.3-curl php7.3-json php7.3-mbstring php7.3-xml php7.3-zip php7.3-bcmath
    fi
    refreshSource
    exec bash
  elif [[ $(whichwhich yum) != "" ]]; then
    echo "CentOS / RedHat are not supported, exiting..."
    exit 1
  else
    echo "Unsupported Linux distribution, exiting...";
    exit 1
  fi
else
  echo "Unsupported OS, exiting..."
  exit 1
fi
