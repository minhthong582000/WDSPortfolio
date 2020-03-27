const UserModel = require('../models/user')
// const password = require('../services/password') //này đang lỗi, tạm cmt(Dưa Hauz)
const ProjectModel = require('../models/projects')
const ActivityModel = require('../models/activities')
const validator = require('validator')
const password = require('../services/password')

module.exports.createByStudentID = async(req, res, next) => {
    try {
        const studentID = req.params.studentID
        const user = await UserModel.findOne({ studentID: studentID })
        if (!user) {
            return res.status(404).send({ error: "User does not found!" })
        }
        if (req.body.activityID) {
            activity = await ActivityModel.findById(req.body.activityID);
            if (!activity) {
                return res.status(404).send({ error: "Activity not found!" })
            }
            if (!user.activities.every(activity => activity._id != req.body.activityID)) {
                throw ("Activity is existed!")
            }
            user.activities.push(activity)
        }
        if (req.body.projectID) {
            project = await ProjectModel.findById(req.body.projectID);
            if (!project) {
                return res.status(404).send({ error: "ProjectID not found!" })
            }
            if (!user.projects.every(project => project._id != req.body.projectID)) {
                throw ("Project is existed!")
            }
            user.projects.push(project)
        }
        if (req.body.skill) {
            user.skills = user.skills.concat({ skill: req.body.skill })
        }
        await user.save()
        res.send({ user })
    } catch (error) {
        res.status(400).send({ error })
        next(error)
    }
}


module.exports.deleteByStudentID = async(req, res, next) => {
    //find and delete
    try {
        let deletedUser = await UserModel.findOne({ studentID: req.params.studentID })
        if (!deletedUser) {
            return res.status(404).send({ message: "User not found!" })
        }
        if (req.body.avatarURL) {
            deletedUser.avatarURL = UserModel.schema.path("avatarURL").defaultValue
        }
        if (req.body.projectID) {
            const index = deletedUser.projects.findIndex(project => project._id == req.body.projectID)
            if (index == -1) {
                return res.status(404).send({ error: "ProjectID not found!" })
            }
            deletedUser.projects.splice(index, 1)
        }
        if (req.body.activityID) {
            const index = deletedUser.activities.findIndex(activity => activity._id == req.body.activityID)
            if (index == -1) {
                return res.status(404).send({ error: "Activity not found!" })
            }
            deletedUser.activities.splice(index, 1)
        }
        if (req.body.skillID) {
            const index = deletedUser.skills.findIndex(skill => skill._id == req.body.skillID)
            if (index == -1) {
                return res.status(404).send({ error: "Skill not found!" })
            }
            deletedUser.skills.splice(index, 1)
        }
        await deletedUser.save()
        res.send({ user: deletedUser })
    } catch (error) {
        res.status(500).send({ error })
        next(error);
    }
}
module.exports.updateByStudentID = async(req, res, next) => {

    try {
        //find userByStudentID
        let updateUser = await UserModel.findOne({ studentID: req.params.studentID })
        if (!updateUser) {
            return res.status(404).send({ message: "User not found!" })
        }


        //validate
        const updates = Object.keys(req.body)
        const allowedUpdates = ['email', 'pwd', 'role', 'studentID', 'birthday', 'avatarURL', 'university']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))
        if (!isValidOperation) {
            throw ("Invalid fields!")
        }
        if (req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                throw ("Invalid Email")
            }
            const existedEmail = await UserModel.findOne({ email: req.body.email })
            if (existedEmail) {
                throw ("This email has already been registered")
            }
        }
        if (req.body.pwd) {
            if (!validator.matches(req.body.pwd, /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)) {
                throw ("Password must contain at least 1 uppercase, numeric and must be eight characters or longer")
            }
            req.body.pwd = password.hashPwd(req.body.pwd)
        }
        if (req.body.role) {
            if (!validator.isIn(req.body.role, UserModel.schema.path('role').enumValues)) {
                throw ("Role must be Guest, member or admin")
            }
        }
        if (req.body.studentID) {
            if (!validator.isNumeric(req.body.studentID)) {
                throw ("Student ID must be numeric characters")
            }
            if (await UserModel.exists({ studentID: req.body.studentID })) {
                throw ("This student ID has already existed")
            }
        }
        if (req.body.avatarURL) {
            if (!validator.isURL(req.body.avatarURL)) {
                throw ("Avatar URL is invalid!")
            }
        }

        //update
        updates.forEach(update => updateUser[update] = req.body[update])
        await updateUser.save()

        res.send({ user: updateUser });
    } catch (error) {
        res.status(400).send({ error: error })
        next()
    }
}


module.exports.index = async(req, res, next) => {
    const users = await UserModel.find();
    return res.json(users)
};

