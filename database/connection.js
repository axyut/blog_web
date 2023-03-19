const mongoose = require("mongoose");

module.exports = async (mongoURL) => {
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
