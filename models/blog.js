const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const blog = mongoose.Schema({
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
        contentComment : String
    }]
})