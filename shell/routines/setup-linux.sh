#!/bin/bash

## EXECUTION

if [[ $(which apt) != "" ]]; then
  source "$SCRIPT_PATH/routines/subroutines/setup-ubuntu.sh"

elif [[ $(which yum) != "" ]]; then
  source "$SCRIPT_PATH/routines/subroutines/setup-centos.sh"

else
  echo -e "\nUnsupported Linux distribution, exiting...\n";
  exit 1
fi
