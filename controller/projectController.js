var projectServices = require ('../services/projectServices');

module.exports.info = async function(req,res,next){
    try {
        let projectId = req.body.id;
        let project = await projectServices.findByProjectId(projectId);
        return res.send('/',{project});
    } catch (error) {
        return next(error);
    }
}

module.exports.create = async function(req,res,next){
    try {
        const projectDTO  = req.body;
        //console.log(req.body);
        await projectServices.create(projectDTO);
        return res.redirect('/');
    } catch (error) {
        return next(error);
    }
}

module.exports.update = async function(req, res, next){
    try {
        let projectDTO = req.body;
        //console.log(projectDTO);
        await projectServices.update(projectDTO);
    } catch (error) {
        return next(error);
    }
}

module.exports.deleteById = async function(req, res, next){
    try {
        let projectId = req.body.id;
        //console.log(req.body.id);
        //console.log(projectId);
        await projectServices.deleteById(projectId);
    } catch (error) {
        return next(error);
    }
}
