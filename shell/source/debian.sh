#!/bin/bash

# wget -O debian.sh https://raw.githubusercontent.com/sotaoi/sotaoieco/dev/shell/source/debian.sh && source ./debian.sh && rm -f ./debian.sh

<<'COMMENT'
sudo apt autoremove -y nodejs && \
  curl -sL https://deb.nodesource.com/setup_14.x -o ./nodesource_setup.sh && \
  sudo bash ./nodesource_setup.sh && \
  rm ./nodesource_setup.sh && \
  DEBIAN_FRONTEND=noninteractive sudo apt install -y nodejs && \
  sudo npm install -g --force npm@7.24.1
COMMENT

# sudo systemctl disable apache2 && sudo systemctl stop apache2

sudo DEBIAN_FRONTEND=noninteractive apt -y update
sudo DEBIAN_FRONTEND=noninteractive apt install -y nano git curl zip unzip
sudo DEBIAN_FRONTEND=noninteractive apt autoremove -y vim
echo "" >> ~/.bashrc
echo 'alias ls="ls -ahl"' >> ~/.bashrc
echo 'alias ll="ls -ahl"' >> ~/.bashrc
echo 'alias l="ls -ahl"' >> ~/.bashrc
source ~/.bashrc
