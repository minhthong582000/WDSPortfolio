const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    },
    birthday: Date,
    university: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        require: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['member','admin','guest'],
        default: 'guest'
    },
    avatarURL: {
        type: "String",
        default: "example.com/avatar.png"
    },
    projects: {
        type: Array
    },
    activities: {
        type: Array
    },
    skills: {
        type: Array
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

