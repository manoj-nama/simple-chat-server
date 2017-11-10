const express = require('express');
const Auth = require('./controllers/auth.ctrl');
const User = require('./controllers/user.ctrl');

module.exports = app => {

  //Auth Middleware
  app.post('/login', (req, res, next) => { });

};