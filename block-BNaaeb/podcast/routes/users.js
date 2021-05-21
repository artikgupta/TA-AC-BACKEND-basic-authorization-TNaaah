var express = require('express');
var router = express.Router();

var User = require("../models/User")

/* GET users listing. */

router.get("/",(req,res, next)=>{
  res.render("home")
})


router.get('/register', (req, res, next) => {
  var error = req.flash('error');
  res.render('register', { error });
});


router.get('/login', (req, res, next) => {
  console.log(req.session)
  var error = req.flash('error');
  res.render('login', {error});
});


router.post('/register', (req, res, next) => {
  var { email, password } = req.body;
  if (password.length <= 4) {
    return res.redirect('/users/register');
  }

  User.create(req.body, (err, user) => {
    if (err) next(err);
 
    res.redirect('/users/login');
 
  });
  
});



router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(user)
    if (err || !user) return next(err);
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password is incorrect');
        return res.redirect('/users/login');
      } else {
        req.session.userId = user.id;
        if(user.isAdmin === true){
          return res.render("adminDashboard")
        } else{
          return res.redirect("/podcast/")
        }
      }

    });
  });
});


module.exports = router;
