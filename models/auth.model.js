const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuthSchema = new Schema({
  token: { type: String, required: true },
  id: { type: String, required: true }
});

AuthSchema.index({ token: 1 });
AuthSchema.index({ id: 1 });
const AuthModel = mongoose.model('Auth', AuthSchema);

module.exports = AuthModel;