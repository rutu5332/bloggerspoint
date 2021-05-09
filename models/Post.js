const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'myUser'
    },
    title: {
        type: String
    },
    body: {
        type: String
    },
    image: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default:0
    }
});

module.exports = Post = mongoose.model('myPost', PostSchema);