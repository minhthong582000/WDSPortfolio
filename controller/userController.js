const userModel = require('../models/user');
const password = require('../services/password');
const userService = require('../services/userService');
const { body, validationResult } = require('express-validator');

module.exports.deleteByStudentID = async (req, res, next) => {
    //find and delete
    user = await userModel.findById(adminId)
    const studentID = req.params.studentID
    await userModel.findOneAndDelete({ studentID: studentID })
    return res.redirect('/admin');
}

module.exports.updateByStudentID = async (req, res, next) => {
    //find user to update
    updateUser = await userModel.findOne({ studentID: req.params.studentID })
    if (updateUser) {
        if (req.body.email) {
            await body('email').isEmail().withMessage('Must be a valid email').run(req);
            await body('email').custom(async (email) => {
                if (await userModel.exists({ email: email })) {
                    throw new Error("This email has already been registered")
                }
            }).run(req)
        }
        if (req.body.pwd) {
            await body('pwd').matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
                .withMessage("Password must contain at least 1 lowercase, uppercase, numeric, special character and must be eight characters or longer").run(req)
        }
        if (req.body.university) {
            await body('university').isAlphanumeric().withMessage("University must be string").run(req)
        }
        if (req.body.role) {
            await body('role').isIn(userModel.schema.path('role').enumValues)
                .withMessage("Role must be Guest, member or admin").run(req)
        }

        if (req.body.studentID) {
            await body('studentID').isNumeric()
                .withMessage("Student ID must be numeric characters").run(req)
            await body('studentID').custom(async (studentID) => {
                if (await userModel.exists({ studentID: studentID })) {
                    throw new Error("This student ID has already existed")
                }
            }).run(req)
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        //hash password
        if (req.body.pwd) {
            req.body.pwd = password.hashPwd(req.body.pwd);
        }

        await userModel.findOneAndUpdate({ studentID: req.params.studentID }, req.body);
        return res.redirect('/admin');
    }
    return res.status(404).json({
        errors:
        {
            value: req.params.studentID,
            msg: "Student Id does not exist",
            param: "studentID",
            location: "param"
        }
    })
}

module.exports.create = async (req, res, next) => {
    try {
        new_user = new userModel({
            email: req.body.email,
            pwd: password.hashPwd(req.body.pwd),
            university: req.body.university,
            studentID: req.body.studentID,
        })
    } catch (error) {
        return next(error);
    }
    await new_user.save();
}

module.exports.index = async (req, res, next) => {
    const users = await userModel.find();
    return res.json(users)
};

module.exports.setAvatarURL = function (req, res, next) {
    let url = req.body.avatarURL;
    let userID = req.body.userID;
    userService.setImgURL(url, userID);
};

module.exports.setRole = async function (req, res, next) {
    try {
        let userID = req.body.id;
        let userRole = req.body.role
        let update = await userModel.findByIdAndUpdate(userID, {role: userRole}, { new: true }, (err, result)=>{
            if(err) console.log(err);   
            console.log(result);
        })
        return res.send(update?"update successful":false);
    } catch(err) {
        next(err);
    }
};