const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeviceSchema = new Schema({
  token: { type: String, required: true },
  id: { type: String, required: true }
});

DeviceSchema.index({ token: 1 });
DeviceSchema.index({ id: 1 });
const DeviceModel = mongoose.model('Device', DeviceSchema);

module.exports = DeviceModel;