const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const user = require('./user');


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

    
    comments : String,  // todo


    customURL : {
        require: true,

        type: String, // todo

        default: "default-URL"
    },


    tags: {
        type: [String],
        
        index: true
    }
})

// Validate the custom URL before saving.
blogSchema.set('validateBeforeSave', true);

blogSchema.path('customURL').validate(function (value) {
    return value != null;
});


blogSchema.methods.getTitle = function(){
    return this.title;
}


blogSchema.methods.getID = function(){
    return this.id;
}


blogSchema.methods.getURL = function(){
    return this.customURL;
}

module.exports = mongoose.model('blogModel', blogSchema);