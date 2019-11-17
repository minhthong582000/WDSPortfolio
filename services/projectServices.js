var projectModel = require('../models/projects');

const findByProjectId = async function (projectId){
    let project = await projectModel.find({_id : projectId});
    return project;
}

const create = async function (projectDTO){
    let project = new projectModel({...projectDTO});
    return await project.save();
}

const update = async function(projectDTO) {
    let { id, ...updateDoc } = projectDTO;
    if (!id) {
      throw new Error("Require Id");
    }
    await projectModel.findByIdAndUpdate(projectDTO.id, updateDoc);
};

const deleteById = async function(projectId){
    await projectModel.findByIdAndDelete(projectId);
}

module.exports = {
    findByProjectId,
    create, 
    update,
    deleteById
}