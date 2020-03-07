const UserModel = require('../models/user')
// const password = require('../services/password') //này đang lỗi, tạm cmt(Dưa Hauz)

const UserModel = require('../models/user');
const ProjectModel = require('../models/projects')
const ActivityModel = require('../models/activities')
const password = require('../services/password');
const { body, validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId
const crypto = require("crypto");
var id = crypto.randomBytes(20).toString('hex');

module.exports.createByStudentID = async (req, res, next) => {
    const studentID = req.params.studentID
    const user = await UserModel.findOne({ studentID: studentID })
    if (user) {
        try {
            if (req.body.activityID) {
                console.log(req.body.activityID)
                newActivity = await ActivityModel.findById(req.body.activityID);
                await user.activities.push(newActivity);
            }
            if (req.body.projectID) {
                newProject = await ProjectModel.findById(req.body.projectID);
                await user.projects.push(newProject)
            }
            if (req.body.skill) {
                await user.skills.push({
                    id: crypto.randomBytes(20).toString('hex'),
                    content: req.body.skill
                })
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
    if (req.body.avatarURL) {
        await UserModel.findOneAndUpdate({ studentID: studentID },
            { avatarURL: UserModel.schema.path("avatarURL").defaultValue })
    }
    try {
        await UserModel.findOneAndUpdate(
            {
                studentID: studentID
            },
            {
                $pull: {
                    projects: { _id: ObjectId(req.body.projectID) },
                    activities: { _id: ObjectId(req.body.activityID) },
                    skills: { id: req.body.skillID },
                },
            }
        )
    }
    catch (err) {
        next(err);
    }
    return res.redirect('/admin');
}

module.exports.updateByStudentID = async (req, res, next) => {
    //find user to update
    var updateUser = await UserModel.findOne({ studentID: req.params.studentID })
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
        if (req.body.skillID && req.body.skillContent) {
            content = await UserModel.findOneAndUpdate({
                studentID: req.params.studentID,
                'skills.id': req.body.skillID
            },
                {
                    $set: {
                        'skills.$.content': req.body.skillContent,
                    },
                },
            )
        };
        await UserModel.findOneAndUpdate({ studentID: req.params.studentID }, req.body)
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

module.exports.index = async (req, res, next) => {
    const users = await UserModel.find();
    return res.json(users)
};

