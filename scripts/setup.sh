#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  if [[ $(which apt) != "" ]]; then
    echo "Running setup for Debian based distribution...";
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    sudo apt update
    sudo apt install build-essential curl file git libpcre3-dev libssl-dev
    ## install node
    ## install php
  elif [[ $(which yum) != "" ]]; then
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
