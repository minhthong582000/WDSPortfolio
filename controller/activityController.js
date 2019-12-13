var activityServices = require ('../services/activityService');
var mongoose = require('mongoose');

module.exports.all = async function(req,res,next){
    try {
        let activities = await activityServices.getActivities();
        return res.send({activities});
    } catch (error) {
        return next(error);
    }
}

module.exports.info = async function(req,res,next){
    try {
        let activityId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(activityId)) return res.send({mess: 'Incorrect input format'});
        let activity = await activityServices.findByActivityId(activityId);
        return res.send({activity});
    } catch (error) {
        return next(error);
    }
}

module.exports.create = async function(req,res,next){
    try {
        const activityDTO  = req.body;
        console.log(req.body);
        await activityServices.create(activityDTO);
        return res.redirect('/activities');
    } catch (error) {
        return next(error);
    }
}

module.exports.update = async function(req, res, next){
    try {
        let activityDTO = req.body;
        let id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)) return res.send({mess: 'Incorrect input format'});
        await activityServices.update(id, activityDTO);
        return res.redirect('/activities');
    } catch (error) {
        return next(error);
    }
}

module.exports.deleteById = async function(req, res, next){
    try {
        let activityId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(activityId)) return res.send({mess: 'Incorrect input format'});
        await activityServices.deleteById(activityId);
        return res.redirect('/activities');
    } catch (error) {
        return next(error);
    }
}
