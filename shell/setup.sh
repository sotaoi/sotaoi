#!/bin/bash

## ENV

envup() {
  local file=$([ -z "$1" ] && echo ".env" || echo "$1")

  if [ -f $file ]; then
    set -a
    source $file
    set +a
  else
    echo "No '$file' file found" 1>&2
    exit 1
  fi
}
ENV_FILE=$1
if [[ -z $ENV_FILE ]]; then
  echo -e "\nEnvironment (usually .env) filename not specified, aborting...\n"
  exit 1
elif [[ ! -f $ENV_FILE ]]; then
  echo "No '$ENV_FILE' file found" 1>&2
  exit 1
else
  echo "Parsing '$ENV_FILE'..."
  envup $ENV_FILE
fi

## VARS

SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

MYSQL_CREATE_CONTROL_PANEL_DB="CREATE DATABASE \`$DB_CONTROL_PANEL_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
MYSQL_CREATE_APP_DB="CREATE DATABASE \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
MYSQL_CREATE_USER_COMMAND="CREATE USER '$DB_USERNAME'@'%' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD';"
MYSQL_USER_PRIVILEGES_COMMAND="GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USERNAME';"
MYSQL_USER_PRIVILEGES_SECOND_COMMAND="GRANT ALL PRIVILEGES ON \`$DB_CONTROL_PANEL_NAME\`.* TO '$DB_USERNAME';"

## FUNCTIONS

mysql_setup() {
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "$MYSQL_CREATE_CONTROL_PANEL_DB" > /dev/null 2>&1
  sudo mysql -e "$MYSQL_CREATE_CONTROL_PANEL_DB" > /dev/null 2>&1
  mysql -uroot --password="$DB_ROOT_PASSWORD" -e "$MYSQL_CREATE_APP_DB" > /dev/null 2>&1
  sudo mysql -e "$MYSQL_CREATE_APP_DB" > /dev/null 2>&1
  if [[ $DB_USERNAME != 'root' ]]; then
    mysql -uroot --password="$DB_ROOT_PASSWORD" -e "$MYSQL_CREATE_USER_COMMAND" > /dev/null 2>&1
    sudo mysql -e "$MYSQL_CREATE_USER_COMMAND" > /dev/null 2>&1
    mysql -uroot --password="$DB_ROOT_PASSWORD" -e "$MYSQL_USER_PRIVILEGES_COMMAND" > /dev/null 2>&1
    sudo mysql -e "$MYSQL_USER_PRIVILEGES_COMMAND" > /dev/null 2>&1
    mysql -uroot --password="$DB_ROOT_PASSWORD" -e "$MYSQL_USER_PRIVILEGES_SECOND_COMMAND" > /dev/null 2>&1
    sudo mysql -e "$MYSQL_USER_PRIVILEGES_SECOND_COMMAND" > /dev/null 2>&1
  fi
}

## EXECUTION

if [[ "$OSTYPE" == "darwin"* ]]; then
  source "$SCRIPT_PATH/routines/setup-mac.sh"
  echo -e "\nDone\n"
  exit 0

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  source "$SCRIPT_PATH/routines/setup-linux.sh"
  echo -e "\nDone\n"
  exit 0

else
  echo -e "\nUnsupported OS, exiting...\n"
  exit 1
fi
