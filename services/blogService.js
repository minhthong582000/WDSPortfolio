const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const blogModel = require('../models/blog')


const createBlog = async function (newBlogParam) {
    const newBlog = new blogModel(newBlogParam);
    await newBlog.save();
}


const removeBlogByFindID = async function (_id) {
    return await usermodel.findByIdAndDelete(_id);
}


const updateBlogByID = async function (updateDoc){
    const {id, ...content} = updateDoc;
    try {
        await blogModel.findByIdAndUpdate(id, content);
    }
    catch (err) {
        console.log(err + "");
        return false;
    }
}


const passCensorshipBlogByID = async function(_id ){
    await blogmodel.findById(_id, function(BlogCrr){
        BlogCrr.censorship = true;
        blogModel.save((err)=>{
            console.log(err + "");
        })
    });
}


/**
 * add a comment to a blog
 * @param {mongoose.Schema.Type.ObjectID} _blogID   id 
 * @param {mongoose.Schema.Type.ObjectID} _idUserCommnent 
 * @param {string} content 
 */
const commmentBlogByID = async function(_blogID, _idUserCommnent, content){
    // await blogmodel.findById(_blogID, function(BlogCrr){
    //     BlogCrr.comment.add({
    //         _blogID,
    //         _idUserCommnent,
    //         content
    //     });
    //     console.log(BlogCrr.comment);
    // })
    console.log('commentBlogByID');
}


module.exports = {
    createBlog, 
    removeBlogByFindID, 
    updateBlogByID,
    passCensorshipBlogByID,
    commmentBlogByID
}