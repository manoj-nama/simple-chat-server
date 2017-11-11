const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const config = require('./config');
const PORT = process.env.PORT || 8888;

mongoose.connect(config.mongo.uri, {
  useMongoClient: true
});

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes')(app);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});