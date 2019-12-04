const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const user = require('./user');


/** 
 * Comment/ Reply Schema & Model
 * _parentID:   as reply is the comment of comment, this ID could be blogID or commentID
 */
const commentSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,

    _parentID : {
        type:   mongoose.Schema.Types.ObjectId,

        ref:    'blog'
    },

    auth : {
        type: String,
        ref: 'user'
    },

    content : String
})
const commentModel = mongoose.model('commentModel', commentSchema);


/**
 * Blog Schema & Model 
 * censorship:      
 */
const blogSchema = new mongoose.Schema({
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

    
    comments : [{
        UserComment : {
            type : mongoose.Schema.Types.ObjectId,

            ref : "user"
        },

        content : String,

        reply : {
            type : mongoose.Schema.Types.ObjectId,
            
            content : String
        }
    }]
})


module.exports = mongoose.model('blogModel', blogSchema);