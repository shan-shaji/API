const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const wikiSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", wikiSchema);

////////////////////////////////////Request targeting all the articles//////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;

    const article = new Article({
      title: title,
      content: content,
    });
    article.save(function (err) {
      if (!err) {
        res.send("Successfully inserted..");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully Deleted all the articles..");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////////// Request targeting a  article /////////////////////////////////
// allows multiple request to be handled using express orute chaining.
app
  .route("/articles/:articlename")
  .get(function (req, res) {
    const articleName = req.params.articlename;  
    // gets the article name from the get request from the postman 
    // using findone function checks for that particular article if it is found
    // the rerult is send to the user.
    Article.findOne({ title: articleName }, function (err, article) {
      if (!err) {
        res.send(article);
      } else {
        req.send(err);
      }
    });
  })
  .put(function (req, res) {
    //  put request is to update  the document. put request is used to update the whole content
    // of the document. if there is only one field the data that is already present in the document will 
    // be deleted and the single data will  only be updated.
    // if the overwrite property is set to true it will update the whole document
    const articleName = req.params.articlename;
    Article.update({ title: articleName }, {tiitle: req.body.title, content: req.body.content}, {overwrite: true}, function(err){
      if(!err){
        res.send("Succesfully updated..");
      }else{
        res.send("error in updating..");
      }
    });
  })
  .patch(function(req, res){
    // here this request will handle the update request where 
    // the whole document is not deleted but the files 
    const articleName = req.params.articlename;
    Article.update({title: articleName}, {$set:req.body}, function(err){ 
      if(!err){
        res.send("Successfully updated..");
      }else{
        res.send(err);
      }
    })
  })
  .delete(function(req, res){
    const articleName = req.params.articlename;
    Article.deleteOne({title: articleName}, function(err){
      if(!err){
        res.send("deleted the artile...");
      }else{
        res.send(err);
      }
    })
  })

app.listen("3000", function () {
  console.log("server started succesfully....");
});
