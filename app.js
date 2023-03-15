//jshint esversion:6

// ideas
// login system to access compose page with jwt and username password   on publish page

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { redirect } = require("express/lib/response");
const mongoose = require("mongoose");
const fs = require("fs");
const adminRouter = require("./routes/admin");
const jwt_checker = require("./middleware/jwt-checker");

// Mailing ##
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { books } = require("googleapis/build/src/apis/books");

const Oauth2 = google.auth.OAuth2;

const Redirect_URL = process.env.REDIRECT_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
// CHANGE EVERY WEEK
const refreshToken = process.env.REFRESH_TOKEN;

const OAuth2Client = new google.auth.OAuth2(
	clientId,
	clientSecret,
	Redirect_URL
);
OAuth2Client.setCredentials({ refresh_token: refreshToken });

const allContent = "Adios!";
const blogContent =
	"All the Articles ever published on the website are listed here in a structured manner. Carry On with the reading.   ";

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//using mongoose to store blog in local database
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//const mongoURL = "mongodb://localhost:27017/blogDB";
const mongoURL = process.env.MONGO_CONNECT;

const connectDB = async () => {
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

const postSchema = new mongoose.Schema({
	title: String,
	content: String,
	img: String,
});
const Post = mongoose.model("Post", postSchema);

const portSchema = new mongoose.Schema({
	title: String,
	content: String,
	year: Number,
	imgSrc: String,
	topContent: String,
});
const Port = mongoose.model("Port", portSchema);

app.get("/", async (req, res) => {
	const top5 = await Post.find({}).sort({ _id: -1 }).limit(5);
	const bottom5 = await Port.find({}).sort({ _id: -1 }).limit(5);
	res.render("home", {
		posts: top5,
		ports: bottom5,
	});
});

// PAGINATION

app.get("/blogs", async (req, res) => {
	let resultsPerPage = 8;
	const noOfDBs = 2;
	const resultsPerDB = Math.floor(resultsPerPage / noOfDBs);
	resultsPerPage =
		resultsPerDB * noOfDBs === resultsPerPage
			? resultsPerPage
			: resultsPerDB * noOfDBs;
	try {
		const posts = await Post.countDocuments({});
		const ports = await Port.countDocuments({});

		const totalResults = posts + ports;
		const numberOfPages = Math.ceil(totalResults / resultsPerPage);

		let page = req.query.page ? Number(req.query.page) : 1;
		if (page > numberOfPages) {
			res.redirect(`/blogs?page=${encodeURIComponent(numberOfPages)}`);
		} else if (page < 1) {
			res.redirect(`/blogs?page=${encodeURIComponent("1")}`);
		}

		//Determine the LIMIT to get relevant number of posts
		const startingLimit = (page - 1) * resultsPerDB;
		const endingLimit = startingLimit + resultsPerDB;
		const paginatedposts = await Post.find({})
			.sort({ _id: -1 })
			.skip(startingLimit)
			.limit(resultsPerDB);
		const paginatedports = await Port.find({})
			.sort({ _id: -1 })
			.skip(startingLimit)
			.limit(resultsPerDB);

		let iterator = page - 2 < 1 ? 1 : page - 2;
		let endingLink =
			iterator + 4 <= numberOfPages
				? iterator + 4
				: page + (numberOfPages - page);
		if (endingLink < page + 1) {
			iterator -= page + 1 - numberOfPages;
		}
		// console.log(iterator, endingLink); yinarko kaam khasai vaxaina aile to algi frontend ma
		res.render("blogs", {
			posts: paginatedposts,
			ports: paginatedports,
			page: page,
			iterator: iterator,
			endingLink: endingLink,
			numberOfPages: numberOfPages,
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/elect", function (req, res) {
	res.render("elect", { allContent: allContent });
});

app.get("/portfolio.json", function (req, res) {
	fs.readFile("./public/files/port.json", (err, json) => {
		let obj = JSON.parse(json);
		res.json(obj);
	});
});

app.get("/publish", function (req, res) {
	res.render("publish");
});

app.get("/about-privacy", function (req, res) {
	res.render("aboutprivacy");
});

app.get("/about-terms", function (req, res) {
	res.render("aboutterms");
});

app.get("/about-website", function (req, res) {
	res.render("aboutwebsite");
});

app.post("/getPosts", async function (req, res) {
	let payload = req.body.payload.trim();
	let search = await Post.find({
		title: { $regex: new RegExp(payload + ".*", "i") },
	}).exec();
	//Limit our search result to 10
	search = search.slice(0, 10);
	res.send({ payload: search });
});

app.post("/publish", function (req, res) {
	const coming_post = {
		fname: req.body.name,
		email: req.body.email,
		title: req.body.postTitle,
		content: req.body.postBody,
	};
	const output = `
    <h1>Blog Website Research</h1>
    <p>Details</p>
    <ul>
      <li>Full Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>${req.body.postBody}</h3>
  `;

	async function sendMail() {
		try {
			const accessToken = await OAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: "587",
				secure: false,
				service: "mail",
				auth: {
					type: "OAuth2",
					user: process.env.USER_SEND,
					clientId: clientId,
					clientSecret: clientSecret,
					refreshToken: refreshToken,
					accessToken: accessToken,
				},
			});

			const mailOptions = {
				from: `${coming_post.fname} <${process.env.USER_GET}>`,
				to: process.env.USER_GET,
				subject: coming_post.title,
				text: "Hello?",
				html: output,
			};

			const result = await transport.sendMail(mailOptions);
			return result;
		} catch (error) {
			return error;
		}
	}

	sendMail()
		.then((result) => console.log("Email sent.", result))
		.catch((error) => console.log(error.message));
	res.redirect("/");
});
app.get("/posts/:postId", async (req, res) => {
	const requestedPostId = req.params.postId;
	try {
		const post = await Post.findOne({ _id: requestedPostId });
		res.render("postDisplay", {
			title: post.title,
			img: post.img,
			content: post.content,
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/port/:portId", async (req, res) => {
	const requestedPortId = req.params.portId;
	try {
		const port = await Port.findOne({ _id: requestedPortId });
		res.render("portDisplay", {
			title: port.title,
			topContent: port.topContent,
			content: port.content,
		});
	} catch (error) {
		console.log(error);
	}
});

app.get("/portfolio", async (req, res) => {
	port2023 = await Port.find({ year: 2023 });
	port2022 = await Port.find({ year: 2022 });
	port2021 = await Port.find({ year: 2021 });
	port2020 = await Port.find({ year: 2020 });
	port2019 = await Port.find({ year: 2019 });

	res.render("port", { port2023, port2022, port2021, port2020, port2019 });
});

app.post("/composeblogs", function (req, res) {
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postBody,
		img: req.body.imgsrc,
	});

	post.save(function (err) {
		if (!err) {
			res.redirect("/");
		}
	});
});

app.post("/composePort", jwt_checker, async (req, res) => {
	const { title, content, year, imgSrc, topContent } = req.body;
	//console.log(title, content, year, imgSrc, topContent, req.user);
	const port = new Port({
		title,
		content,
		year: year ? year : 2018,
		imgSrc,
		topContent,
	});

	const saved = await port.save();
	if (saved) {
		res.redirect("/");
	}
});

// Upload to database
app.get("/compose", function (req, res) {
	res.render("compose", { user: req.user });
});

//////// API section ///////////

// app.route("/api/posts").get(function (req, res) {
// 	Post.find(function (err, foundPosts) {
// 		res.send(foundPosts);
// 	});
// });

// Admin login
app.use("/admin", adminRouter);

app.get("/admin/register", (req, res) => {
	res.render("register");
});

connectDB().then(() => {
	app.listen(process.env.PORT || 3000, function () {
		console.log(
			"Server is runnig on heroku server or port 3000 in local server"
		);
	});
});
