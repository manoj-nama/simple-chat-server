const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const async = require('async');

/*
{
  threads: [
    {
      user: {
        name: 'John Doe',
        picture: 'file_path_or_id',
        id: ''
      },
      last_message: {
        message: 'some message',
        file: 'file_path_or_id',
        time: 1234567890,
        type: 'TEXT',
        status: 'DELIVERED'
      },
      unread_count: 5
    }
  ]
}
*/
exports.threads = (req, res) => {
  const { _id } = req.user;
  const tasks = [];

  tasks.push(cb => {
    Chat
      .find({
        '$or': [
          { to: _id },
          { from: _id }
        ]
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec(cb);
  });

  tasks.push((chats, cb) => {
    const users = {};
    let order = 0;
    chats.forEach(chat => {
      let otherUser = chat.to;
      if (chat.to === _id) {
        otherUser = chat.from;
      }
      if (!users[otherUser]) {
        users[otherUser] = chat;
        users[otherUser].order = order;
        users[otherUser].unread_count = 0;
        order += 1;
      }
      if (chat.status === 'DELIVERED') {
        users[otherUser].unread_count += 1;
      }
    });
    return cb(null, users);
  });

  tasks.push((users, cb) => {
    const userIds = Object.keys(users);
    if (!userIds.length) {
      return cb();
    }
    const projection = {
      name: 1,
      username: 1,
      email: 1,
      picture: 1
    };
    User
      .find({ _id: { '$in': userIds } }, projection)
      .lean()
      .exec((err, threadUsers) => {
        if (err) {
          return cb(err);
        }
        const threads = [];
        threadUsers.forEach(user => {
          const chat = users[user._id];
          const obj = {
            user,
            'unread_count': chat.unread_count,
            'last_message': {
              'message': chat.message,
              'file': chat.file || "",
              'time': chat.createdAt,
              'type': chat.message_type || 'TEXT',
              'status': chat.status
            }
          };
          threads[chat.order] = obj;
        });
        return cb(null, threads);
      });
  });

  async.waterfall(tasks, (err, threads) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).json({ threads });
  });
};

exports.thread = (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const { limit, offset } = req.query || {};
  const tasks = [];

  tasks.push(cb => {
    Chat
      .update({
        'status': 'DELIVERED',
        'to': _id,
        'from': id
      }, {
        '$set': {
          'status': 'READ'
        }
      }, { multi: true })
      .exec(cb);
  });

  tasks.push(cb => {
    Chat
      .find({
        '$or': [
          { to: id },
          { from: id }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(+limit || 20)
      .skip(+offset || 0)
      .lean()
      .exec(cb);
  });

  async.series(tasks, (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    const thread = result[1] || [];
    return res.status(200).json({
      limit: limit || 20,
      offset: offset || 0,
      thread
    });
  });
};

exports.message = (req, res) => {
  const { to, message, file } = req.body;
  const { _id } = req.user;

  if (!to) {
    return res.status(422).send('missing required parameter [to]');
  }

  if (!message && !file) {
    return res.status(422).send('at least one param required [message] or [file]');
  }

  const msg = new Chat({
    to,
    'from': _id,
    'message': message || "",
    'file': file || "",
    'message_type': file ? 'FILE' : 'TEXT',
    'status': 'DELIVERED'
  });

  msg.save((err, savedMsg) => {
    if (err) {
      return res.status(400).send(err);
    }

    // TODO: send push here
    return res.status(200).json({
      message: savedMsg
    });
  });
};