#!/bin/bash

# wget -O centos.sh https://raw.githubusercontent.com/sotaoi/sotaoi/master/shell/source/centos.sh && source ./centos.sh && rm -f ./centos.sh

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
echo "parse_git_branch() {" >> ~/.bashrc
echo "  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'" >> ~/.bashrc
echo "}" >> ~/.bashrc
echo 'export PS1="\u@\h \[\033[32m\]\w\[\033[33m\]\$(parse_git_branch)\[\033[00m\] $ "' >> ~/.bashrc
echo "" >> ~/.bashrc
echo 'alias ll="ls --color -ahl --group-directories-first"' >> ~/.bashrc
echo 'alias l="ls --color -ahl --group-directories-first"' >> ~/.bashrc
echo 'alias ls="ls --color -ahl --group-directories-first"' >> ~/.bashrc
source ~/.bashrc
