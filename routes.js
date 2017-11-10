const express = require('express');
const Auth = require('./controllers/auth.ctrl');
const User = require('./controllers/user.ctrl');

module.exports = app => {

  //Auth Middleware
  app.use((req, res, next) => {
    next();
  });

};