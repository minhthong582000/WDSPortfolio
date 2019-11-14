const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const activitiesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startDate: Date,
    endDate: Date,
    description: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('activities', activitiesSchema);