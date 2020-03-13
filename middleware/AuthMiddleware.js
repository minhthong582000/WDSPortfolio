const Joi = require('@hapi/joi');
const jwtAuth = require('./jwt.authenticate');
const accessTokenSecret = process.env.TOKEN_SECRET || "access-token-secret-Webdev-Studio";

//login user
function checkInputLogin(req, res, next) {
    const loginSchema = Joi.object({
        email: Joi.string().min(7).max(30).email().required(),
        password: Joi.string().min(3).max(30).required()
    });
    var criteria = req.body;
    let valid = loginSchema.validate(criteria, { abortEarly: false });
    if (valid.error) {
        res.status(422).json({ errors: valid.error.details });
    }
    else {
        const criteria = (username.indexOf('@') === -1) ? { studentID: username } : { email: username }; //kiểm tra username là email hay mssv để check database
        DataUsers.findOne(criteria, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                res.status(422).json({ "msg": "Incorrect username or password" })
            }
            if (!user.validPassword(password)) {
                res.status(422).json({ "msg": "Incorrect username or password" })
            }
            const userData = {
                id: user.studentID,
                name: user.name,
                email: user.email,
            }
            const accessToken = await jwtAuth.generateToken(userData, accessTokenSecret);
            res.cookie('access-token', accessToken, {
                maxAge: 365 * 24 * 60 * 60 * 100,
                httpOnly: true
                //secure: true; //chạy localhost thì k cần bật
            })
            res.status(200).json({"msg": 'success login'});
        });
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send("You must login!");
    }
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

//function kiểm tra token
let isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.cookies.access_token || req.get("access-token");

    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await jwtAuth.verifyToken(tokenFromClient, accessTokenSecret);
            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
}



module.exports = {
    checkInputLogin: checkInputLogin, //validate dữ liệu login
    isLoggedIn: isLoggedIn,
    notLoggedIn: notLoggedIn,
    isAuth: isAuth
}