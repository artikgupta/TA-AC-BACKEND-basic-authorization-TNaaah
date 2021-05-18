var express = require('express');
var router = express.Router();

var auth = require("../middlewares/auth")


var User = require("../models/User")

var Article = require("../models/Article")

var Comment = require("../models/Comment")

module.exports = router;