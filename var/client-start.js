#!/usr/bin/env node

const express = require('express');
const app = express();

const path = __dirname;

app.use(express.static(path));
app.get('*', function (req, res) {
  res.sendFile(path + '/index.html');
});
app.listen(process.env.PORT || '8080');
