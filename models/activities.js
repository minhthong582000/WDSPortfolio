const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const activitiesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        default: new Date()
    },
    endDate: {
        type: Date,
        default: new Date()
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('activities', activitiesSchema);