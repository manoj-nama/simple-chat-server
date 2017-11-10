const express = require('express');
const Auth = require('./controllers/auth.ctrl');
const User = require('./controllers/user.ctrl');
const Insta = require('./controllers/insta.ctrl');
const Chat = require('./controllers/chat.ctrl');

module.exports = app => {

  // ------------------------------------------------------------------------
  // Auth APIs
  // ------------------------------------------------------------------------
  app.post('/login', (req, res, next) => { });
  app.get('/logout', (req, res, next) => { });

  // ------------------------------------------------------------------------
  // User APIs
  // ------------------------------------------------------------------------
  // Gets user info for specified user
  // id: User _id or 'me'
  app.get('/user/:id', (req, res, next) => { });

  // ------------------------------------------------------------------------
  // Chat APIs
  // ------------------------------------------------------------------------
  // Fetches chat threads for current user
  app.get('/chat/threads', (req, res, next) => { });

  // Fetched messages between the current & specified user
  // id: User _id
  app.get('/chat/:id', (req, res, next) => { });

  // Send a new message to specified user
  // id: User _id
  app.post('/chat/:id', (req, res, next) => { });

  // ------------------------------------------------------------------------
  // Instagram APIs
  // ------------------------------------------------------------------------
  // Fetches the feed for current user, recent first
  app.get('/insta/feeds', (req, res, next) => { });

  // Fetches all the users following current user, or a specified user
  // id: User _id or 'me'
  app.get('/insta/following/:id', (req, res, next) => { });

  // Fetches all the followers for current user, or a specified user
  // id: User _id or 'me'
  app.get('/insta/followers/:id', (req, res, next) => { });

  // Fetches all the likes of current user
  app.get('/insta/posts/likes', (req, res, next) => { });

  // Fetches posts for a user
  // id: User _id or 'me'
  app.get('/insta/posts/:id', (req, res, next) => { });

  // Get an individual post
  // id: Post _id
  app.get('/insta/post/:id', (req, res, next) => { });

  // Likes / remove like to/from a post
  // id: Post _id
  app.post('/insta/post/:id/like', (req, res, next) => { });

  // Create a new Post, notifies all followers
  app.post('/insta/post', (req, res, next) => { });


  // ------------------------------------------------------------------------
  // Notification APIs
  // ------------------------------------------------------------------------
  // Fetches notifications for current user
  app.get('/notifications', (req, res, next) => { });

};