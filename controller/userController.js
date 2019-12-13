const UserModel = require('../models/user');
const ProjectModel = require('../models/projects')
const ActivityModel = require('../models/activities')
const password = require('../services/password');
const { body, validationResult } = require('express-validator');

module.exports.createByStudentID = async (req, res, next) => {
    const studentID = req.params.studentID
    var user = await UserModel.findOne({ studentID: studentID })
    if (user) {
        try {
            if (req.body.activity) {
                newActivity = await ActivityModel.findById(req.body.activity);
                await user.activities.push(newActivity);
                console.log(req.body.activity)
            }
            if (req.body.project) {
                newProject = await ProjectModel.findById(req.body.project);
                await user.projects.push(newProject)
            }
            await user.save()
        } catch (error) {
            next(error)
        }
    }
    return res.redirect('/admin');
}


module.exports.deleteByStudentID = async (req, res, next) => {
    //find and delete
    const studentID = req.params.studentID
    user = await UserModel.findOne({ studentID: studentID })
    if (user) {
        try {
            if (req.body.project) {
                const deletedProject = await user.projects.find(
                    (project) => project._id == req.body.project);
                await user.projects.pull(deletedProject)
            }
            if (req.body.activity) {
                const deletedActivity = await user.activities.find(
                    (activity) => activity._id == req.body.activity
                );
                await user.activities.pull(deletedActivity)
            }
            if (req.body.avatarURL) {
                user.avatarURL = UserModel.schema.path("avatarURL").defaultValue
            }
            await user.save()
        }
        catch (error) {
            next(error)
        }
    }
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