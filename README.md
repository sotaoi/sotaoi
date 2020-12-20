# Will have:

## 1. Implementations for: Vue, Angular

## 2. Handling of validation on both client and api; API implementation with Swagger, alongside:

1. Implementation with Joi on top of hapi.js
2. Implementation with Express
3. Implementation with Laravel
4. Implementation with Koa

# Starting up

## Setting up the applciation

Run the following commands in the command line to setup the application

```
npm install
npm run dev:setup-env
```

This sets up the packages neccessary for **development**

## Running the app

In order to start the application, run each of these commands in a separate shell

```
npm run start:api
npm run start:proxy
npm run start:cweb
npm run start:crns (optional / mobile)
npm run start:candroid (optional / mobile)
```

In case there is a problem with running the proxy, try running it with superuser privileges (on linux)

```
sudo npm run start:proxy

```

Afterwards in the browser go to the *https://qwertyboilerplate.com*

## Documentation API

TO-DO

## Documentation Client

TO-DO
