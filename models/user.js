const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    local: {
        email: {
            type: String,
            unique: true
        },
        pwd: String,
        birthday: Date,
        university: String,
        studentID: {
            type: String,
            unique: true
        },
        role: {
            type: String,
            enum: ['member','admin','guest'],
            default: 'guest'
        },
        projects: Array,
        activities: Array,
        skills: Array
    },
    facebook: {
        id: String,
        token: String,
        email: String
    }
},
{
    timestamps: true
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.pwd);
};
module.exports = mongoose.model('users', userSchema);

