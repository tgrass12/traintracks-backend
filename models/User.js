const mongoose = require('mongoose');
const Nutrients = require('./Nutrients');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	name: String,
	targets: {
		diet: {
			type: Nutrients.schema,
			default: Nutrients.schema
		}
	}
});

userSchema.static('findByUsername', function(username) {
	return this.findOne({ 'username': username });
})

const User = mongoose.model('user', userSchema);

module.exports = User;