const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: null
	},
	deletionDate: {
		type: Date,
		default: null
	},
	admin: {
		type: Boolean,
		default: false
	}
});

const User = new mongoose.model('users', UserSchema);

module.exports = User;