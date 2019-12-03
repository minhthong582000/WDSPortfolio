const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);


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


    Auth : {
        type: mongoose.Schema.Types.ObjectId, 

        ref: 'user'
    },


    censorship :{
        type : Boolean,

        default : false
    },

    
    comment : [{
        UserComment : {
            type : mongoose.Schema.Types.ObjectId,

            ref : "user"
        },

        content : String,

        reply : {
            type : mongoose.Schema.Types.ObjectId,
            content : string
        }
    }]
})


const blog = mongoose.model('blog', blogSchema);