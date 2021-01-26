# SOTA Opinionated Implementations

# THIS IS A SIMPLE WORK IN PROGRESS BLOG DEMO FOR ALPHA

# Starting up

## Setting up the application (Mac / Linux required)

Run the following commands in the command line to setup the application

```
npm run dev:setup-env (edits /etc/hosts, adds self-signed certificates to trust store)
```

This sets up the packages neccessary for **development**

## Running the app

In order to start the application, run each of these commands in a separate shell

```
npm run start:api
npm run start:proxy
npm run start:cweb
```

In case there is a problem with running the proxy, try running it with superuser privileges (on linux)

```
sudo npm run start:proxy

```

Afterwards in the browser go to the *https://monologz.loc*
