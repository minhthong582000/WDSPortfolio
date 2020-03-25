const Joi = require('@hapi/joi');
const jwtAuth = require('./jwt.authenticate');
const accessTokenSecret = process.env.TOKEN_SECRET || "access-token-secret-Webdev-Studio";
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h"; //thời gian sống token 1h

//login user
let checkInputLogin = async(req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().min(7).max(30).email().required(),
        password: Joi.string().min(3).max(30).required()
    });
    var criteria = req.body;
    let valid = loginSchema.validate(criteria, { abortEarly: false });
    if (valid.error) {
        return res.status(422).json({ errors: valid.error.details });
    }
    else {
        const criteria = (username.indexOf('@') === -1) ? { studentID: username } : { email: username }; //kiểm tra username là email hay mssv để check database
        DataUsers.findOne(criteria, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(422).json({ "msg": "Incorrect username or password" })
            }
            if (!user.validPassword(password)) {
                return res.status(422).json({ "msg": "Incorrect username or password" })
            }
            const userData = {
                id: user.studentID,
                name: user.name,
                email: user.email,
            }
            const accessToken = await jwtAuth.generateToken(userData, accessTokenSecret,accessTokenLife);
            res.cookie('access_token', accessToken, {
                maxAge: 365 * 24 * 60 * 60 * 100,
                httpOnly: true
                //secure: true; //chạy localhost thì k cần bật
            })
            return res.status(200).json({"msg": 'success login'});
        });
    }
}


module.exports = {
    checkInputLogin: checkInputLogin
}
