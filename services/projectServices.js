var projectModel = require('../models/projects');

module.exports.findByProjectId = async function (projectId){
    let project = await projectModel.find({_id : projectId});
    return project;
}

module.exports.create = async function (projectDTO){
    //console.log(projectDTO);
    const project = new projectModel({...projectDTO});
    //console.log(project);
    return await project.save();
}

module.exports.update = async function(projectDTO) {
    let { id, ...updateDoc } = projectDTO;
    //console.log(projectDTO);
    //console.log(projectDTO.id);
    if (!id) {
      throw new Error("Require Id");
    }
    await projectModel.findByIdAndUpdate(projectDTO.id, updateDoc);
};

module.exports.deleteById = async function(projectId){
    await projectModel.findByIdAndDelete(projectId);
}

// module.exports = {
//     findByProjectId,
//     create, 
//     update,
//     deleteById
// }