#!/bin/bash

if [[ -f "./sotaoi/api/certs/privkey.pem" ]]; then
    echo "notice: certificate files exist."
    exit 0
fi

if [[ -f "./sotaoi/api/certs/fulchain.pem" ]]; then
    echo "notice: certificate files exist."
    exit 0
fi

DOMAIN=$1

function createCerts {
  mkdir -p ./sotaoi/api/certs

  openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout ./sotaoi/api/certs/privkey.pem \
    -new \
    -out ./sotaoi/api/certs/fullchain.pem \
    -reqexts SAN \
    -extensions SAN \
    -config <(cat ./sotaoi/api/certs/openssl.cnf \
      <(printf "
      [req]
      default_bits = 2048
      prompt = no
      default_md = sha256
      x509_extensions = v3_req
      distinguished_name = dn

      [dn]
      C = RO
      ST = Cluj-Napoca
      L = Cluj-Napoca
      O = qwertypnks
      OU = Bad Boys Rollin
      emailAddress = qwertypnk@protonmail.com
      CN = $DOMAIN

      [v3_req]
      subjectAltName = @alt_names

      [SAN]
      subjectAltName = @alt_names

      [alt_names]
      DNS.1 = *.$DOMAIN
      DNS.2 = $DOMAIN
      ")) \
          -sha256 \
          -days 3650
}

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

    createCerts

    ;;

  "Linux")
    
    # actually this one works on all linux distros
    # # debian based only
    # if [[ -z $(which apt) ]]; then
    #   echo -e "\nConcerning Linux, the script is available only for debian based environments.\n"
    #   exit
    # fi

    createCerts

    ;;

  *)

    #
    # echo -e "\nThe script is available only for Mac or Debian based Linux environments. Your environment is detected as \"$machine\".\n"
    echo -e "\nThe script is available only for Mac or Linux environments. Your environment is detected as \"$machine\".\n"
    exit 1

    ;;

esac
