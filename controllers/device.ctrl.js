const async = require('async');
const Device = require('../models/device.model');
const Expo = require('expo-server-sdk');
const expo = new Expo();

exports.register = (req, res) => {
  const { token } = req.body;
  const { _id } = req.user;
  const tasks = [];

  if (!token) {
    return res.status(400).send("Push/Device token in required! ");
  }

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

exports.send = (user, payload, callback) => {
  const { _id } = user;
  const tasks = [];
  const { body, data, sound, title } = payload;

  // fetch device token
  tasks.push(cb => {
    Device.findOne({ id: _id }).lean().exec(cb);
  });

  tasks.push((device, cb) => {
    if (device && device.token) {
      const message = {};
      if (data) {
        message.data = data;
      }
      if (body) {
        message.body = body;
      }
      if (title) {
        message.title = title;
      }
      if (sound) {
        message.sound = sound;
      }
      return sendPush(device.token, message, cb);
    } else {
      return cb(null, { errors: { message: "No Registered token found" } });
    }
  });

  async.waterfall(tasks, callback);
};

function sendPush(token, message, callback) {
  if (!Expo.isExpoPushToken(token)) {
    return callback(new Error("Invalid Token"));
  }

  message.to = token;
  expo.sendPushNotificationAsync(message)
    .then(reciept => {
      return callback(null, reciept);
    })
    .catch(err => {
      return callback(err);
    });
}