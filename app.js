//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { redirect } = require("express/lib/response");
const { lte, result } = require("lodash");
const mongoose = require("mongoose");

// Mailing ############
const nodemailer= require("nodemailer");
const { google } = require("googleapis");
const Oauth2 = google.auth.OAuth2;
//const config = require("./config.js");

const Redirect_URL = 'https://developers.google.com/oauthplayground'
const clientId = '51365520624-m3eih0krlole7o6mfr0e6o9tioqoe1p5.apps.googleusercontent.com'
const clientSecret= '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'
const refreshToken= '1//04RgJ1QzLn68pCgYIARAAGAQSNwF-L9IrmpZ5dNtaSGXC-ER6tkOIZrMkoed75jseN5xTrMAPgK2eYvNTLdSo0USgT0eVpH--htc'

const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret, Redirect_URL )
OAuth2Client.setCredentials( {refresh_token: refreshToken});

const allContent = "Adios!";
const blogContent = "Carry On with the reading.   ";
const homeStartingContent = "Lacurra telrta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//let newposts=[];
//using mongoose to store blog in local database
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
// use mongoose to store in mongo atlas cloud database
mongoose.connect("mongodb+srv://axyut:inGcasEDtBrIiJEb@cluster0.zoxas8a.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);
const Home = mongoose.model("Home", postSchema);

app.get("/", function(req,res){

  Home.find({}, function(err, homes){
    res.render("home", {
      homes: homes
    });
  });
  
});

app.get("/blogs", function(req,res){
  
  Post.find({}, function(err, posts){
    res.render("blogs", {
      blogContent: blogContent,
      posts: posts
      });
  });
});

app.get("/all", function(req,res){
  res.render("all", {allContent: allContent });
});



app.get("/about", function(req,res){
  res.render("about", {aContent: aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact", {cContent: contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.get("/publish", function(req, res){
  res.render("publish");
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
    <h2>Body</h2>
    <p>${req.body.postBody}</p>
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
          user: 'kawuichan@gmail.com',
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken
        }
      })

      const mailOptions = {
        from: `${coming_post.fname} <kawuichan@gmail.com>`,
        to: "aoogleak@gmail.com",
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
      content: req.body.postBody
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
    content: req.body.postBody
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
        content: post.content
      });
    });
  
});


app.get("/post/:homeId", function(req, res){

  const requestedHomeId = req.params.homeId;
  
    Home.findOne({_id: requestedHomeId}, function(err, home){
      res.render("post", {
        title: home.title,
        content: home.content
      });
    });
  
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is runnig on heroku server or port 3000 in local server")
});