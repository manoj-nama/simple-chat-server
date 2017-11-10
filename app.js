const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 8888;

app.use(express.static('./public'));

require('./routes')(app);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
