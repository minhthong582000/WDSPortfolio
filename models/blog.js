const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const user = require('./user');


const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 256;

/**
 * Blog Schema & Model 
 */
const blogSchema = new mongoose.Schema({
    title: {
        require: true,

        type: String,

        minlength: MIN_TITLE_LENGTH,

        maxlength: MAX_TITLE_LENGTH,

        default: 'Blog title'
    },


    body: {
        require : true,

        type: String,

        default : "Default content."
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

    
    customURL : {
        require: true,

        type: String, 

        default: "default-URL",

        unique: true,
    },


    tags: {
        type: [String],
        
        index: true
    },


    viewsCount: {
        type: Number,

        default: 0,

        require: true
    }
})

blogSchema.index({customURL: 1, _id: 1, id: 1, title: 0});

// Validate the custom URL before saving.
blogSchema.set('validateBeforeSave', true);

blogSchema.methods.updateViews = function(){
    this.viewsCount++;
}


module.exports = mongoose.model('blogModel', blogSchema);