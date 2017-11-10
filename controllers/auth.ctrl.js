const Auth = require('../models/auth.model');
const User = require('../models/user.model');
const async = require('async');

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