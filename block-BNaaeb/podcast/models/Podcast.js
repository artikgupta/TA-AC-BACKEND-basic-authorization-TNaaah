var mongoose = require("mongoose")

var Schema = mongoose.Schema

var bcrypt = require("bcrypt")

var PodcastSchema = new Schema(
    {
        name:String,
        description:String,
        filesUrl: String,
        likes:{type:Number ,default:0},
        comment:[{type:Schema.Types.ObjectId, ref:"User"}],
        types: { type: String, default: 'free', enum: ['free', 'vip', 'premium'] },
    },
    { timestamps: true }
)


var Podcast = mongoose.model('Podcast', PodcastSchema);

module.exports = Podcast;