const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  'social': {
    'google': { 'type': String },
    'facebook': { 'type': String }
  },
  'name': { 'type': String },
  'username': { 'type': String },
  'email': { 'type': String },
  'phone': { 'type': String },
  'picture': { 'type': String }
}, { 'timestamps': true });

UserSchema.index({ 'email': 1 });
UserSchema.index({ 'social.google': 1 });
UserSchema.index({ 'social.facebook': 1 });
UserSchema.index({ 'createdAt': 1 });
const UserModel = mongoose.model('Auth', UserSchema);

module.exports = UserModel;