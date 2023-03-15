const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: [true, "Please provide name."],
		minlength: 4,
		maxlength: 20,
		unique: true,
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide valid email",
		],
		unique: true,
	},
	password: {
		type: String,
		require: [true, "Please provide password."],
		minlength: 10,
		maxlength: 20,
	},
});

userSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(6);
	this.password = await bcrypt.hash(this.password, salt); // this means the document that is about to be saved it includes name, email, password
});

userSchema.methods.createToken = function () {
	const token = jwt.sign(
		{ userId: this._id, username: this.username },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	);
	return token;
};

userSchema.methods.validatePassword = async function (comingPass) {
	const isMatch = await bcrypt.compare(comingPass, this.password);
	return isMatch;
};

module.exports = mongoose.model("User", userSchema);
