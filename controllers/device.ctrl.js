const async = require('async');
const Device = require('../models/device.model');

exports.register = (req, res) => {
  const { token } = req.body;
  const { _id } = req.user;
  const tasks = [];

  tasks.push(cb => {
    Device.findOne({
      id: _id
    }).lean().exec(cb);
  });

  tasks.push((device, cb) => {
    if (device && device.token) {
      if (device.token === token) {
        return cb(null, 1);
      }
      return cb(null, 2);
    } else {
      return cb(null, 3);
    }
  });

  async.waterfall(tasks, (err, statusCode) => {
    if (err) {
      return res.status(400).send(err);
    }

    switch (statusCode) {
      case 1: {
        return res.status(200).send("Token is already registered");
      }
      case 2: {
        Device.update({ id: _id }, { $set: { token } }, err => {
          if (err) {
            return res.status(400).send(err);
          }
          return res.status(200).send("Token updated successfully");
        });
        break;
      }
      case 3: {
        const dev = new Device({
          token,
          id: _id
        });

        dev.save(err => {
          if (err) {
            return res.status(400).send(err);
          }
          return res.status(200).send("Device registered succesfully");
        });
        break;
      }
      default: {
        return res.status(422).send(new Error("Unknown case for registering device"));
      }
    }
  });
}