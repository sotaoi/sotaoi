#!/bin/bash

# wget -O debian.sh https://raw.githubusercontent.com/sotaoi/sotaoi/master/shell/source/debian.sh && source ./debian.sh && rm -f ./debian.sh

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
echo "parse_git_branch() {" >> ~/.bashrc
echo "  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'" >> ~/.bashrc
echo "}" >> ~/.bashrc
echo 'export PS1="\u@\h \[\033[32m\]\w\[\033[33m\]\$(parse_git_branch)\[\033[00m\] $ "' >> ~/.bashrc
echo "" >> ~/.bashrc
echo 'alias ll="ls --color -ahl --group-directories-first"' >> ~/.bashrc
echo 'alias l="ls --color -ahl --group-directories-first"' >> ~/.bashrc
echo 'alias ls="ls --color -ahl --group-directories-first"' >> ~/.bashrc
source ~/.bashrc
