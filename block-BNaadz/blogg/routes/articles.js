var express = require('express');
var router = express.Router();

var User = require("../models/User")

var Article = require("../models/Article")

var Comment = require("../models/Comment")

var auth = require("../middlewares/auth")



router.get("/", (req,res)=>{
  var session = req.session.userId;
    Article.find({}, (err,articles) => {
    if(err) next(err);
  User.findById(session,(err,user)=>{
    if(err) next(err);
    res.render("articles", {articles,session:session, user:user})
  })
    })
})

router.get("/new",  auth.loggedInUser,(req, res, next)=>{
res.render("createArticle")
})

router.get("/:id", (req,res,next)=>{
  let id = req.params.id;
  Article.findById(id).populate("commentId").exec((err, article)=>{
  if(err) return next(err)
  res.render("singleArticle", {article})
  })
})



router.use(auth.loggedInUser);


router.post("/", (req,res,next)=>{
Article.create({...req.body, author: req.session.userId}, (err, articles)=>{
    if(err) return next(err)
    res.redirect("/articles")
})
})


router.get("/:id/likes", (req,res)=>{
  let id = req.params.id;
  Comment.findByIdAndUpdate(id,{$inc:{likes:1}},(err, updateComment)=>{
      res.redirect()
  })
})


router.post('/:id/comments', (req, res, next) => {
    var id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body, (err, comment) => {
      if (err) next(err);
      Article.findByIdAndUpdate(
        id,
        { $push: { commentId: comment.id } },
        (err, article) => {
          if (err) next(err);
          res.redirect('/articles/' + article.id);
        }
      );
    });
  });


  // comments

  // like comment

  router.get("/:articleID/comments/:commentID/likes", (req,res, next)=>{
    let {articleID, commentID} = req.params; 
    console.log(req.params)
    Comment.findByIdAndUpdate(commentID, {$inc:{likes:1}},{new: true}, (err, comment)=>{
        if(err) return next(error)
        console.log(comment)
        res.redirect("/articles/" + articleID)
    })
})

// delete comment


router.get("/:articleID/comments/:commentID/delete", (req,res, next)=>{
  let {articleID, commentID} = req.params; 
  console.log(req.params)
  Comment.findByIdAndDelete(commentID,
     (err, comment)=>{
      if(err) return next(error)
      console.log(comment)
      res.redirect("/articles/" + articleID)
  })
})

// edit comment

router.get("/:articleID/comments/:commentID/edit",(req,res,next)=>{
  let {articleID, commentID} = req.params; 
  Comment.findById(commentID,(err, comment)=>{
    res.render("updateComment", {comment, article: {id: articleID}})
  })
})

router.post("/:articleID/comments/:commentID/edit", (req,res,next)=>{
  let {articleID, commentID} = req.params; 
  Comment.findByIdAndUpdate(commentID, req.body, { new: true }, (err, article) => {
    if (err) next(err);
    res.redirect("/articles/" + articleID);
})
})

module.exports = router;