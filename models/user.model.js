const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  social: {
    google: { type: String },
    facebook: { type: String }
  },
  name: { type: String },
  username: { type: String },
  email: { type: String },
  phone: { type: String },
  picture: { type: String }
});

UserSchema.index({ token: 1 });
const UserModel = mongoose.model('Auth', UserSchema);

export default UserModel;

