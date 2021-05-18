var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, unique: true },
        password: { type: String, minlength: 5 },
        city: { type: String },
      },
      { timestamps: true }
);


UserSchema.pre("save", function(next){
    if(this.password  && this.isModified('password')){
bcrypt.hash(this.password , 10  ,(err, hashed)=>{
    if(err) return next(err)
    this.password = hashed;
    return next()
})

    }else{
        next()
    }
})


UserSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
      return cb(err, result);
    });
  };
  UserSchema.methods.fullName = function () {
    return `${this.firstname} ${this.lastname}`;
  };

  var User = mongoose.model('User', UserSchema);

module.exports = User;