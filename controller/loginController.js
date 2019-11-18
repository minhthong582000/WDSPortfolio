const loginService = require('../services/loginService')
async function createNewAcount(req, res, next) {
    try {
        const DTO = req.body;
        // if (!(await checkUserExist(DTO.email)))
        await loginService.createUser(DTO);
    }
    catch (err) {
        res.status(401).json({
            "code": 401,
            "message": "error!"
        });
        return;
        
    }
    res.json({ "message": 'Successfully' });
    next();
}
module.exports = { createNewAcount }