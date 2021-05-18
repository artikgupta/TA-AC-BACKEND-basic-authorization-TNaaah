var express = require('express');
var router = express.Router();

var User = require("../models/User")

var auth = require("../middlewares/auth")


/* GET users listing. */


router.get("/" , (req, res)=>{
  res.render("home")
})

router.get("/register", (req, res ,next)=>{
  return res.render("register")
})



router.post('/register', (req, res, next) => {
  var { email, password } = req.body;
  console.log(req.body)
  if (password.length <= 4) {
    return res.redirect('/users/register');
  }
  User.create(req.body, (err, user) => {
    console.log("abc", user)
    if (err) next(err);
 
   return res.redirect('/users/login');
 
  });
});


router.get("/login", (req,res, next)=>{
  res.render("login")
})


router.post("/login", (req, res, next)=>{
  var {email ,password} = req.body;
  if(!email || !password){
  return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/login');
    }
   user.verifyPassword(password, (err, result)=>{
    if(err) return next(err);
    if(!result){
      return res.redirect('/users/login');
    }
    req.session.userId = user.id;
     res.redirect("/articles")
  })
})
})

module.exports = router;


