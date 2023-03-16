const mongoose = require("mongoose");

const mongoURL = "mongodb://localhost:27017/blogDB";
//const mongoURL = process.env.MONGO_CONNECT;

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
