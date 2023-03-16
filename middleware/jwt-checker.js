const User = require("../model/User");
const jwt = require("jsonwebtoken");

const jwt_checker = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.send("Authentication Inavlid");
	}

	const token = authHeader.split(" ")[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userId).select("-password");

		req.user = user;
		// console.log(req.body);
		next();
	} catch (error) {
		throw new Error("Authentication Invalid!");
	}
};

module.exports = jwt_checker;
