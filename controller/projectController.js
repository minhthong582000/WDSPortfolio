var express = require('express');
var projectServices = require ('../services/projectServices');

const info = async function(req,res,next){
    try {
        let projectId = req.body.id;
        let project = await projectServices.findByProjectId(projectId);
        return res.json({project});
    } catch (error) {
        return next(error);
    }
}

const create = async function(req,res,next){
    try {
        let projectDTO  = req.body;
        await projectServices.create(projectDTO);
    } catch (error) {
        return next(error);
    }
}

const update = async function(req, res, next){
    try {
        let projectDTO = req.body;
        await projectServices.update(projectDTO);
    } catch (error) {
        return next(error);
    }
}

const deleteById = async function(req, res, next){
    try {
        await projectServices.deleteById(projectId);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    info,
    create,
    update,
    deleteById
}