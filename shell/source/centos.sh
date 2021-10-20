#!/bin/bash

# wget -O centos.sh https://raw.githubusercontent.com/sotaoi/sotaoieco/dev/shell/source/centos.sh && source ./centos.sh && rm -f ./centos.sh

<<'COMMENT'
sudo yum autoremove -y nodejs && \
  curl -sL https://rpm.nodesource.com/setup_14.x -o ./nodesource_setup.sh && \
  sudo bash ./nodesource_setup.sh && \
  rm -f ./nodesource_setup.sh && \
  sudo yum install -y nodejs && \
  sudo npm install -g --force npm@7.24.1
COMMENT

# sudo systemctl disable httpd && sudo systemctl stop httpd

sudo yum install -y nano git curl zip unzip
sudo yum autoremove -y vim
echo "" >> ~/.bashrc
echo 'alias ls="ls -ahl"' >> ~/.bashrc
echo 'alias ll="ls -ahl"' >> ~/.bashrc
echo 'alias l="ls -ahl"' >> ~/.bashrc
source ~/.bashrc
