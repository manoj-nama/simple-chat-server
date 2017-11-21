const Auth = require('../models/auth.model');
const User = require('../models/user.model');
const async = require('async');
const crypto = require('crypto');

exports.authenticate = (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;

  if (!token) {
    return res.status(400).send("Unauthorized");
  }

  const tasks = [];
  tasks.push(cb => {
    Auth.findOne({ token }).lean().exec(cb);
  });

  tasks.push((creds = {}, cb) => {
    if (!(creds && creds.id)) {
      return cb(new Error("User not found"));
    }
    User.findOne({ _id: creds.id }).lean().exec(cb);
  });

  async.waterfall(tasks, (err, user) => {
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

exports.logout = (req, res) => {
  Auth.remove({ id: req.user._id }).exec(() => { });
  return res.status(200).send();
};

exports.login = (req, res) => {
  const { name, googleId, facebookId, email, phone, picture, username } = req.body;

  const query = [];
  if (!email && !googleId && !facebookId) {
    return res.status(422).json({ msg: 'Required fields (Email / ID) missing' });
  }

  if (email) {
    query.push({ email });
  }
  if (googleId) {
    query.push({ 'social.google': googleId });
  }
  if (facebookId) {
    query.push({ 'social.facebook': facebookId });
  }

  User.findOne({
    '$or': query
  }).lean().exec((err, user) => {
    if (err || !user) {
      // Do a signup
      const socials = {};
      if (googleId) {
        socials['google'] = googleId
      }
      if (facebookId) {
        socials['facebook'] = facebookId;
      }
      user = {
        email,
        socials,
        name: name || "",
        phone: phone || "",
        picture: picture || "",
        username: username || email
      };
      return signup(user, res, res);
    } else {
      // Do login
      return login(user, res, res);
    }
  });
};

function signup(user, req, res) {
  const userToSave = new User(user);
  userToSave.save((err, newUser) => {
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
  Auth.remove({ id: user._id }).exec(() => { });
  generateToken(user, (err, token) => {
    if (err) {
      return res.status(400).send("Error registering user");
    }
    return res.status(200).json({ token });
  });
}

function generateToken(user, callback) {
  const token = crypto.createHmac('sha256', 'react-native').update(user._id.toString()).digest('hex');

  const authToken = new Auth({
    token,
    id: user._id
  });

  authToken.save(err => {
    return callback(err, token);
  });
}