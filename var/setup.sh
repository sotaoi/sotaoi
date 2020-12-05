unameOut="$(uname -s)"
case "${unameOut}" in
  Linux*)   machine=Linux;;
  Darwin*)  machine=Mac;;
  CYGWIN*)  machine=Cygwin;;
  MINGW*)   machine=MinGw;;
  *)      machine="UNKNOWN:${unameOut}"
esac

case $machine in

  "")

    echo -e "\nMachine environment detection failed.\n"

    ;;

  "Mac")

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    brew install certbot
    brew install node@14.3.0

    # sudo certbot certonly -n --standalone --agree-tos -m email@domain.tldomain -d www.domain.tldomain

    ;;

  "Linux")
    
    # debian based only
    if [[ -z $(which apt) ]]; then
      echo -e "\nConcerning Linux, setup is available only for debian based environments.\n"
      exit
    fi

    adduser homebrewuser

    sudo systemctl stop apache2
    sudo apt purge apache2
    sudo rm -rf /var/www/html

    sudo apt update
    sudo apt -f -y install
    sudo apt install -y certbot wget git curl software-properties-common gitk nano unzip
    sudo apt -y autoremove

    curl "http://deb.nodesource.com/node_14.x/pool/main/n/nodejs/nodejs_14.3.0-1nodesource1_amd64.deb" --output "nodejs_14.3.0-1nodesource1_amd64.deb"
    sudo dpkg -i "./nodejs_14.3.0-1nodesource1_amd64.deb"
    sudo apt -f -y install
    rm -f "./nodejs_14.3.0-1nodesource1_amd64.deb"

    user=$USER
    group=$(id -g -n $user)
    sudo chown -R $user:$group "/usr/lib/node_modules"

    # sudo certbot certonly -n --standalone --agree-tos -m email@domain.tldomain -d www.domain.tldomain

    ;;

  *)

    echo -e "\nSetup is available only for Mac or Debian based Linux environments. Your environment is detected as \"$machine\".\n"
    exit 1

    ;;

esac
