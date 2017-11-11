const mongoose = require('mongoose');
const { Schema } = mongoose;
const statusEnum = ['DELIVERED', 'READ'];
const typesEnum = ['TEXT', 'FILE'];

const ChatSchema = new Schema({
  'to': { 'type': String, 'required': true },
  'from': { 'type': String, 'required': true },
  'message': { 'type': String },
  'file': { 'type': String },
  'message_type': { 'type': String, 'enum': typesEnum, 'default': typesEnum[0] },
  'status': { 'type': String, 'enum': statusEnum, 'default': statusEnum[0] }
}, { 'timestamps': true });

ChatSchema.index({ 'to': 1 });
ChatSchema.index({ 'from': 1 });
ChatSchema.index({ 'status': 1 });
ChatSchema.index({ 'createdAt': 1 });
const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;