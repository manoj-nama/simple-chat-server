const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThreadSchema = new Schema({
  'to': { 'type': String, 'required': true },
  'from': { 'type': String, 'required': true }
}, { 'timestamps': true });

ThreadSchema.index({ 'to': 1 });
ThreadSchema.index({ 'from': 1 });
const ThreadModel = mongoose.model('Chat', ThreadSchema);

module.exports = ThreadModel;