const User = require("../model/User");

const register = async (req, res) => {
	try {
		const user = await User.create({ ...req.body });
		//const token = user.createToken();
		res.status(201).json({
			msg: "User Created!",
			//token,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Fill required fields properly!" });
	}
};

const login = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (!email || !password || !username) {
			throw new Error({ _message: "Pleade provide required fields" });
		}

		const userExists = await User.findOne({ email });
		if (!userExists) {
			throw new Error({ _message: "Invalid Credentials!" });
		}

		const correctPassword = await userExists.validatePassword(password);
		if (!correctPassword) {
			throw new Error({ _message: "Invalid Credentials!" });
		}
		if (userExists.username != username) {
			throw new Error({ _message: "Invalid Credentials!" });
		}

		const token = userExists.createToken();

		res.status(200).json({
			msg: "Login Successful!",
			token,
		});
	} catch (error) {
		console.log(error);
		if (error._message) {
			res.send(error._message);
		}
		res.status(400).json({ message: "Error Login In." });
	}
};

module.exports = { register, login };
