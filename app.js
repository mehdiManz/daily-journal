//jshint esversion:6
require('dotenv').config();

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeStartingContent = `Welcome to My Blog!

Explore a collection of insightful and thought-provoking blog posts written by our talented authors. From the latest trends in technology and scientific discoveries to captivating arts and cultural experiences, we cover a wide range of topics to keep you engaged, informed, and inspired.

`;

const aboutContent = `About Us

Welcome to Our Blog!

At Our Blog, we are passionate about sharing knowledge, insights, and stories with our readers. We believe in the power of words to educate, entertain, and inspire. Our mission is to create a platform that fosters curiosity, encourages meaningful discussions, and connects people through the art of blogging.

`;

const contactContent = `

Hello there!

We would be delighted to hear from you. If you have any questions, suggestions, or simply want to say hello, feel free to reach out to us using the contact details below. Our friendly and dedicated team is here to assist you in any way we can.

Email: hello@ourblog.com
Phone: +1 123-456-7890

`;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(`mongodb+srv://mehdiabdolnabizadeh:${process.env.MONGODB_PASSWORD}@clusterofmine.qb3vewe.mongodb.net/dailyJournalDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Create a schema for the blog post
const postSchema = new Schema({
  // Define your schema fields here
  title: String,
  body: String,
  // ...
});

// Create a model based on the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    const truncatedPosts = posts.map((post) => {
      const truncatedContent = post.body.substring(0, 100) + "...";
      return { ...post._doc, body: truncatedContent };
    });

    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: truncatedPosts,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});



// Remove this line if you have it elsewhere in your code
// const mongoose = require("mongoose");

app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findById(requestedPostId);

    if (post) {
      res.render("post", { post: post });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});





app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("posts", { posts: posts });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});





app.post("/compose", (req, res) => {
  const { title, post } = req.body;

  const newPost = new Post({
    title: title,
    body: post,
  });

  newPost.save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
