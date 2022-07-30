//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { redirect } = require("express/lib/response");
const { lte } = require("lodash");
const nodemailer= require("nodemailer");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let newposts=[];

app.get("/", function(req,res){
  res.render("home", {StartingContent: homeStartingContent, newposts:newposts});
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
  //console.log(coming_post);

  async function main(){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'axyut@outlook.com',
        pass: 'hotmailak001', 
      }, // for local host testing uncomment below
      // tls:{
      //   rejectUnauthorized:false
      // }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${coming_post.fname} <axyut@outlook.com>`, // sender address
      to: "aoogleak@gmail.com", // list of receivers
      subject: coming_post.title, // Subject line
      text: "Hello?", // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    
  }
  main().catch(console.error);
  res.redirect('/');
});

app.post("/compose", function(req,res){

  const post = {
    title:req.body.postTitle,
    content:req.body.postBody
  };
  newposts.push(post);
  res.redirect("/");
});

app.get("/posts/:postName", function(req,res){
 const reqTitle= _.lowerCase(req.params.postName);    // using lodash library to convert into lower case

  newposts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if ( storedTitle === reqTitle){
      res.render("post", {title:post.title, content:post.content});
    }
 });

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is runnig on heroku server or port 3000 in local server")
});