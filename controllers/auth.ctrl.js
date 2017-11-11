const Auth = require('../models/auth.model');
const User = require('../models/user.model');
const async = require('async');
const crypto = require('crypto');

exports.authenticate = (req, res, next) => {
  if (!token) {
    return res.status(400).send("Unauthorized");
  }

  const tasks = [];
  tasks.push(cb => {
    Auth.findOne({ token }).lean().exec(cb);
  });

  tasks.push((creds = {}, cb) => {
    if (!creds.id) {
      return cb(new Error("User not found"));
    }
    User.findOne({ _id: id }).lean().exec(cb);
  });

  async.series(tasks, (err, user) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (!user) {
      return res.status(403).send("Unauthorized");
    }
    req.user = user;
    return next();
  });
};

exports.login = (req, res, next) => {
  const { name, googleId, facebookId, email, phone, picture, username } = req.body;

  if (!email || !id) {
    return res.status(422).json({ msg: 'Required fields (Email / ID) missing' });
  }

  User.findOne({
    '$or': [
      { email },
      { 'social.google': googleId },
      { 'social.facebook': facebookId }
    ]
  }).lean().exec((err, user) => {
    if (err || !user) {
      // Do a signup
      const socials = {};
      if (googleId) {
        socials['google'] = googleId
      }
      if (facebookId) {
        socials['facebookId'] = facebookId;
      }
      user = {
        name,
        email,
        phone,
        picture,
        username,
        socials
      }
      return signup(user, res, res);
    } else {
      // Do login
      return login(user, res, res);
    }
  });
};

function signup(user, req, res) {
  const user = new User(user);
  user.save((err, newUser) => {
    if (err) {
      return res.status(400).send("Error registering user");
    }
    generateToken(newUser, (err, token) => {
      if (err) {
        return res.status(400).send("Error registering user");
      }
      return res.status(200).json({ token });
    });
  });
}

function login(user, req, res) {
  Auth.remove({ id: user._id });
  generateToken(user, (err, token) => {
    if (err) {
      return res.status(400).send("Error registering user");
    }
    return res.status(200).json({ token });
  });
}

function generateToken(user, callback) {
  const token = crypto.createHmac('sha256', 'react-native').update(user._id).digest('hex');

  const authToken = new Auth({
    token,
    id: user._id
  });

  authToken.save(err => {
    return callback(err, token);
  });
}