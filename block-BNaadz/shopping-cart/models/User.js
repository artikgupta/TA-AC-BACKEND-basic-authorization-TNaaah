var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, minlength: 5 },

    isAdmin:{type:Boolean, default:false},

    cart: [{type: Schema.Types.ObjectId, ref: "Product"}],

    block :[{type:Schema.Types.ObjectId, ref:"User"}]
    
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
    const adminEmail = ["arti@gmail.com"];
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) next(err);
      this.password = hashed;
      if(adminEmail.includes(this.email)) {
          this.isAdmin = true;
      }
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};
var User = mongoose.model('User', userSchema);

module.exports = User;