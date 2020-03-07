const UserModel = require('../models/user')
// const password = require('../services/password') //này đang lỗi, tạm cmt(Dưa Hauz)

const { body, validationResult } = require('express-validator');

module.exports.deleteByStudentID = async (req, res, next) => {
    //find and delete
    user = await UserModel.findById(adminId)
    const studentID = req.params.studentID
    await UserModel.findOneAndDelete({ studentID: studentID })
    return res.redirect('/admin');
}

module.exports.updateByStudentID = async (req, res, next) => {
    //find user to update
    updateUser = await UserModel.findOne({ studentID: req.params.studentID })
    if (updateUser) {
        if (req.body.email) {
            await body('email').isEmail().withMessage('Must be a valid email').run(req);
            await body('email').custom(async (email) => {
                if (await UserModel.exists({ email: email })) {
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
            await body('role').isIn(UserModel.schema.path('role').enumValues)
                .withMessage("Role must be Guest, member or admin").run(req)
        }

        if (req.body.studentID) {
            await body('studentID').isNumeric()
                .withMessage("Student ID must be numeric characters").run(req)
            await body('studentID').custom(async (studentID) => {
                if (await UserModel.exists({ studentID: studentID })) {
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

        await UserModel.findOneAndUpdate({ studentID: req.params.studentID }, req.body);
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

// module.exports.create = async (req, res, next) => {
//     try {
//         new_user = new UserModel({
//             email: req.body.email,
//             pwd: password.hashPwd(req.body.pwd),
//             university: req.body.university,
//             studentID: req.body.studentID,
//         })
//     } catch (error) {
//         return next(error);
//     }
//     await new_user.save();
//     return res.redirect('/admin');
// }

module.exports.index = async (req, res, next) => {
    const users = await UserModel.find();
    return res.json(users)
};

