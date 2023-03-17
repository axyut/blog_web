const mongoose = require("mongoose");

//const mongolocalURL = process.env.MONGO_LOCAL;
const mongoURL = process.env.MONGO_CONNECT;

module.exports = async () => {
	try {
		const conn = await mongoose.connect(mongoURL, {
			useNewUrlParser: true,
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
