const Auth = require('./controllers/auth.ctrl');
const User = require('./controllers/user.ctrl');
const Chat = require('./controllers/chat.ctrl');
// const Insta = require('./controllers/insta.ctrl');

function niy(req, res) {
  return res.send("Not yet implemented");
}

module.exports = app => {

  // ------------------------------------------------------------------------
  // Auth APIs
  // ------------------------------------------------------------------------
  app.post('/login', Auth.login);
  app.get('/logout', Auth.authenticate, Auth.logout);

  // ------------------------------------------------------------------------
  // User APIs
  // ------------------------------------------------------------------------
  // Fetches all users for exploration
  app.get('/users', Auth.authenticate, User.list);
  // Gets user info for specified user
  // Params - id: User _id or 'me'
  app.get('/user/:id', Auth.authenticate, User.fetch);

  // ------------------------------------------------------------------------
  // Chat APIs
  // ------------------------------------------------------------------------
  // Fetches chat threads for current user
  app.get('/chat/threads', Auth.authenticate, Chat.threads);

  // Fetched messages between the current & specified user
  // Params - id: User _id
  app.get('/chat/:id', Auth.authenticate, Chat.thread);

  // Send a new message to specified user
  // Params - id: User _id
  app.post('/chat/:id', Auth.authenticate, Chat.message);

  // ------------------------------------------------------------------------
  // Instagram APIs
  // ------------------------------------------------------------------------
  // Fetches the feed for current user, recent first
  app.get('/insta/feeds', Auth.authenticate, niy);

  // Fetches all the users following current user, or a specified user
  // Params - id: User _id or 'me'
  app.get('/insta/following/:id', Auth.authenticate, niy);

  // Fetches all the followers for current user, or a specified user
  // Params - id: User _id or 'me'
  app.get('/insta/followers/:id', Auth.authenticate, niy);

  // Fetches all the likes of current user
  app.get('/insta/posts/likes', Auth.authenticate, niy);

  // Fetches posts for a user
  // Params - id: User _id or 'me'
  app.get('/insta/posts/:id', Auth.authenticate, niy);

  // Get an individual post
  // Params - id: Post _id
  app.get('/insta/post/:id', Auth.authenticate, niy);

  // Likes / remove like to/from a post
  // Params - id: Post _id
  app.post('/insta/post/:id/like', Auth.authenticate, niy);

  // Create a new Post, notifies all followers
  app.post('/insta/post', Auth.authenticate, niy);


  // ------------------------------------------------------------------------
  // Notification APIs
  // ------------------------------------------------------------------------
  // Fetches notifications for current user
  app.get('/notifications', Auth.authenticate, niy);

  // ------------------------------------------------------------------------
  // Device APIs
  // ------------------------------------------------------------------------
  // Registers a device for Push
  app.post('/device', Auth.authenticate, niy);

};