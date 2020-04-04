const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', true);
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email: {
        type: String,
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
        unique: true
    },

    role: {
        type: String,
        enum: ['member', 'admin', 'guest'],
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
        type: Array,
    },
    skills: [{
        skill: {
            type: String,
        }
    }],
    pwdreset: {
        token: String,
        expire: {
            type: Date
        }
    }
},
    {
        timestamps: true
    });
userSchema.pre('save', function (next) {
    var user = this;
console.log(this)
    // only hash the password if it has been modified (or is new)
    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.pwd, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.pwd = hash;
            next();
        });
    });
});
userSchema.pre('findOneAndUpdate', function (next) {
    var user = this._update;
    // only hash the password if it has been modified (or is new)
    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.pwd, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.pwd = hash;
            next();
        });
    });
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.pwd);
};
module.exports = mongoose.model('users', userSchema);