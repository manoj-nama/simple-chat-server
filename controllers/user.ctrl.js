const User = require('../models/user.model');

exports.list = (req, res) => {
  const { limit, offset } = req.query;
  User
    .find({})
    .sort({ createdAt: -1 })
    .skip(+offset || 0)
    .limit(+limit || 20)
    .lean()
    .exec((err, users) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({
        limit: limit || 20,
        offset: offset || 0,
        users
      });
    });
};

exports.fetch = (req, res) => {
  let id = req.params.id || 'me';

  if (id === 'me') {
    id = req.user._id;
  }

  User
    .findOne({ _id: id })
    .lean()
    .exec((err, user = {}) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).json({ user });
    });
};