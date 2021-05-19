 var User = require("../models/User")

 module.exports={
     loggedInUser:(req,res,next)=>{
         if(req.session && req.session.userId){
             next()
         }else{
             res.redirect("/users/login")
         }
     },

     userInfo:(req,res, next)=>{
    var userId = req.session && req.session.userId

    if(userId){
        User.findById(userId,' name eamil isAdmin', (err, user)=>{
         if(err) return next(err)
         req.user = user;
         res.locals.user = user;
         next();
       });
     } else {
       req.user = null;
       res.locals.user = null;
       next();
     }
        
     },
   adminUser:(req,res, next)=>{
    var id = req.session.userId;
    User.findById(id,(err, user) =>{
        console.log(user)
        if(err || !user) {
        return next("User not found")
         } else if(user.isAdmin) {
           return next()
         }else{
           return res.render("noauth")
        }
    })}

 }