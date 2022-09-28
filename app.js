//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { redirect } = require("express/lib/response");
const { lte, result, parseInt } = require("lodash");
const mongoose = require("mongoose");


// Mailing ##
const nodemailer= require("nodemailer");
const { google } = require("googleapis");
const { Router } = require('express');
const Oauth2 = google.auth.OAuth2;

const Redirect_URL = process.env.REDIRECT_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret= process.env.CLIENT_SECRET;
// CHANGE EVERY WEEK
const refreshToken= process.env.REFRESH_TOKEN;

const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret, Redirect_URL )
OAuth2Client.setCredentials( {refresh_token: refreshToken});

const allContent = "Adios!";
const blogContent = "All the Articles ever published on the website are listed here in a structured manner. Carry On with the reading.   ";

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//let newposts=[];
//using mongoose to store blog in local database
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
// use mongoose to store in mongo atlas cloud database

mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true});

const postSchema = new mongoose.Schema( {
  title: String,
  content: String,
  img: String
});
const Post = mongoose.model("Post", postSchema);
const Home = mongoose.model("Home", postSchema);

app.get("/", function(req,res){

  Home.find({}, function(err, homes){
    latest = homes.slice(0, 5);
    popular = homes.slice(-5);
    res.render("home", {
      homes: latest,
      pops: popular
    });
  });
  
});

// PAGINATION 
const resultsPerPage = 5;

app.get("/blogs", function(req,res){
  
  Post.find({}, function(err, posts){
    if(err) throw err;
    const numOfResults = posts.length;
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if(page > numberOfPages){
        res.redirect(`/blogs?page=${encodeURIComponent(numberOfPages)}`);
    }else if(page < 1){
        res.redirect(`/blogs?page=${encodeURIComponent('1')}`);
    }
    //Determine the LIMIT to get relevant number of posts
    const startingLimit = (page - 1) * resultsPerPage;
    const endingLimit = startingLimit + resultsPerPage;
    posts = posts.slice(startingLimit, endingLimit);

    let iterator = (page - 2) < 1 ? 1 : page-2;
    let endingLink = (iterator + 4) <= numberOfPages ? (iterator + 4) : page + (numberOfPages - page);
    if(endingLink < (page + 1)){
        iterator -= (page + 1) - numberOfPages;
    }
    
      res.render("blogs", {
        blogContent: blogContent,
        posts: posts,
        page: page,
        iterator: iterator,
        endingLink: endingLink,
        numberOfPages: numberOfPages,
      });
    
  });
});

app.get("/elect", function(req,res){
  res.render("elect", {allContent: allContent });
});

app.get("/elected", function(req,res){
  res.render("elected");
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.get("/publish", function(req, res){
  res.render("publish");
});

app.get("/about-privacy", function(req,res){
  res.render("aboutprivacy");
});

app.get("/about-terms", function(req,res){
  res.render("aboutterms");
});

app.get("/about-website", function(req,res){
  res.render("aboutwebsite");
});

app.post("/getPosts", async function(req,res){
  let payload = req.body.payload.trim();
  let search = await Post.find({title: {$regex: new RegExp(payload+'.*','i')}}).exec();
  //Limit our search result to 10
  search = search.slice(0,10);
  res.send({payload: search});
});

app.post("/publish", function(req,res){
  const coming_post= {
    fname: req.body.name,
    email: req.body.email,
    title: req.body.postTitle,
    content: req.body.postBody
  };
  const output= `
    <h1>Blog Website Research</h1>
    <p>Details</p>
    <ul>
      <li>Full Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>${req.body.postBody}</h3>
  `;

  async function sendMail(){
    try {
      const accessToken = await OAuth2Client.getAccessToken()

      const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '587',
        secure: false,
        service: 'mail',
        auth:{
          type: 'OAuth2',
          user: process.env.USER_SEND,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken
        }
      })

      const mailOptions = {
        from: `${coming_post.fname} <${process.env.USER_GET}>`,
        to: process.env.USER_GET,
        subject: coming_post.title,
        text: "Hello?", 
        html: output,
      };

      const result = await transport.sendMail(mailOptions)
      return result
      
    } catch (error) {
      return error
    }
  }

  sendMail().then(result => console.log('Email sent.', result))
  .catch(error => console.log(error.message))
  res.redirect('/');

});

app.post("/composeblogs", function(req, res){

    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
      img: req.body.imgsrc
    });

    post.save(function(err){
      if (!err){
        res.redirect("/");
      }
    });
  
});

app.post("/composehome", function(req,res){

  const home = new Home({
    title: req.body.postTitle,
    content: req.body.postBody,
    img: req.body.imgsrc
  });

  home.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        img: post.img,
        content: post.content,
      });
    });
  
});


app.get("/post/:homeId", function(req, res){

  const requestedHomeId = req.params.homeId;
  
    Home.findOne({_id: requestedHomeId}, function(err, home){
      res.render("post", {
        title: home.title,
        img: home.img,
        content: home.content
      });
    });
  
});


//////// API section ///////////

app.route("/api/posts")
  .get(function(req,res){
    Post.find(function(err, foundPosts){
      res.send(foundPosts);
    });
  })
;


app.route("/api/homes")
  .get(function(req,res){
    Home.find(function(err, foundHomes){
      res.send(foundHomes);
    });
  })
;





app.listen(process.env.PORT || 3000, function(){
  console.log("Server is runnig on heroku server or port 3000 in local server")
});