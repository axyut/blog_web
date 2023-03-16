//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//Routes
const adminRouter = require("./routes/admin");
const composeRouter = require("./routes/compose");
const searchRouter = require("./routes/ajaxSearch");
const rootRouter = require("./routes/root");
const PostsBlogsRouter = require("./routes/posts");
const PortBlogsRouter = require("./routes/port");
const AboutRouter = require("./routes/about");

// DataBase MongoDB
const connectDB = require("./database/connection");

// Middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("", rootRouter);
app.use("", searchRouter);
app.use("/admin", adminRouter);
app.use("/compose", composeRouter);
app.use("/port", PortBlogsRouter);
app.use("/posts", PostsBlogsRouter);
app.use("/about", AboutRouter);

connectDB().then(() => {
	app.listen(process.env.PORT || 3000, function () {
		console.log(
			"Server is runnig on heroku server or port 3000 in local server"
		);
	});
});
