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

        maxlength: MAX_TITLE_LENGTH
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

        type: String, // todo

        default: "default-URL",

        unique: true,
    },


    tags: {
        type: [String],
        
        index: true
    }
})


// Validate the custom URL before saving.
blogSchema.set('validateBeforeSave', true);

// todo
blogSchema.path('customURL').validate(function (value) {
    return value != null;
});


blogSchema.methods.getTitle = function(){
    return this.title;
}


blogSchema.methods.getID = function(){
    return this._id;
}


blogSchema.methods.getURL = function(){
    return this.customURL;
}

module.exports = mongoose.model('blogModel', blogSchema);