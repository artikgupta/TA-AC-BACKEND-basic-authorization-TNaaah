var express = require('express');
var router = express.Router();

var User = require("../models/User")

var auth = require("../middelewares/auth")


/* GET users listing. */


router.get('/', function(req, res, next) {
  res.render('home' );
});


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
          return res.redirect("/products/")
        }
      }

    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});


// user cart

router.get("/cart", (req, res) => {
  const {userId } = req.session;
  User.findById(userId).populate("cart").exec((err, users
    ) => {
  if (err) next(err);
  res.render("cart", {users})
  })
})


router.get("/admin", auth.adminUser, (req,res,next)=>{
  User.find({isAdmin:false}, (err, users)=>{
    if(err) next(err)
    User.findOne({isAdmin: true}, (err, admin) => {
      if(err) next(err)
      res.render("allusers", {users, admin})
    })
  })
})

// block user

router.get("/:blockId/block", (req,res,next)=>{
  let blockId = req.params.blockId;
  User.findByIdAndUpdate(req.session.userId, {$push: {block: blockId}},(err, user) => {
    if(err || !user) next(err);
    res.redirect("/users/admin")
  })
})


// unblock user

router.get("/:blockId/unblock", (req,res,next)=>{
  let blockId = req.params.blockId;
  User.findByIdAndUpdate(req.session.userId, {$pull: {block: blockId}},(err, user) => {
    if(err || !user) next(err);
    res.redirect("/users/admin")
  })
})

module.exports = router;
