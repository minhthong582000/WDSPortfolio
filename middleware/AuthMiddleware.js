const jwtAuth = require('./jwt.authenticate');
const accessTokenSecret = process.env.TOKEN_SECRET || "access-token-secret-Webdev-Studio";

//function kiểm tra token
let isAuth = async (req, res, next) => {
    const tokenFromClient = req.body.token || req.cookies.access_token || req.get("access_token");

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
    isAuth: isAuth
}