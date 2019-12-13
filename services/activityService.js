var activityModel = require('../models/activities');

module.exports.getActivities = async function (){
    let activities = await activityModel.find();
    return activities;
}

module.exports.findByActivityId = async function (activityId){
    let activity = await activityModel.find({_id : activityId});
    return activity;
}

module.exports.create = async function (activityDTO){
    const activity = new activityModel({...activityDTO});
    return await activity.save();
}

module.exports.update = async function(activityId, updateDoc) {
    return await activityModel.findByIdAndUpdate(activityId, updateDoc);
};

module.exports.deleteById = async function(activityId){
    await activityModel.findByIdAndDelete(activityId);
}

//module.exports.uploadImgs = async function()
