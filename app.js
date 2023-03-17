//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const rootRouter = require("./routes/RootRouter");
const connectDB = require("./database/connection");

// Middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("", rootRouter);

const PORT = process.env.PORT;
connectDB().then(() => {
	app.listen(PORT, function () {
		console.log(`Server is running at http://localhost:${PORT}`);
	});
});
