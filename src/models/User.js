const mongoose = require('mongoose');
const Nutrients = require('./Nutrients');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  name: String,
  sex: String,
  targets: {
    diet: {
      type: Nutrients.schema,
      default: Nutrients.schema,
    },
  },
  meals: {
    type: [String],
    default: ['Breakfast', 'Lunch', 'Dinner'],
  },
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.hash;
  delete obj.salt;
  return obj;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
