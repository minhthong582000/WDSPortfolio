const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const projectsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startDate : {
        type : Date,
        default : Date.now
    },
    finishDate : {
        type : Date,
        default : Date.now,
    },
    status : Boolean,
    description: {
        type: String
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('projects', projectsSchema);