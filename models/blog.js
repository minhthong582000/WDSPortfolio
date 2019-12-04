const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const user = require('./user');


/** 
 * Comment/ Reply Schema & Model
 * _parentID:   as reply is the comment of comment, this ID could be blogID or commentID
 * auth:        the EMAIL of the author
 */
const commentSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,

    _parentID : {
        type:   mongoose.Schema.Types.ObjectId,

        ref:    'blog'
    },

    auth : {
        type: string,
        ref: 'user'
    },

    content : string
})
const commentModel = mongoose.model('commentModel', commentSchema);


/**
 * Blog Schema & Model 
 * auth:    the EMAIL of the author
 * censorship:      
 */
const blogSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,


    title: {
        require: true,

        type: String,

        unique: true
    },


    content: {
        require : true,

        type: String,

        default : "Content default"
    },


    date : {
        require : true,

        type: Date,

        default : Date.now
    },


    auth : {
        type: mongoose.Schema.Types.ObjectId, 

        ref: 'user'
    },


    censorship :{
        type : Boolean,

        default : false
    },

    
    comments : {
        type: Array
    }
})


const blogModel = mongoose.model('blogModel', blogSchema);

module.exports = {
    blogModel : blogModel,
    commentModel : commentModel
}