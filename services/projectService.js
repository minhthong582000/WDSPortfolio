var projectModel = require('../models/projects');

module.exports.findByProjectId = async function (projectId){
    let project = await projectModel.find({_id : projectId});
    return project;
}

module.exports.create = async function (projectDTO){
    const project = new projectModel({...projectDTO});
    return await project.save();
}

module.exports.update = async function(projectDTO) {
    let { id, ...updateDoc } = projectDTO;
    if (!id) {
      throw new Error("Require Id");
    }
    await projectModel.findByIdAndUpdate(projectDTO.id, updateDoc);
};

module.exports.deleteById = async function(projectId){
    await projectModel.findByIdAndDelete(projectId);
}

//module.exports.uploadImg = async function()

// module.exports = {
//     findByProjectId,
//     create, 
//     update,
//     deleteById
// }