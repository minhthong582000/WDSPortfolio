const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const blogModel = require('../models/blog')


const createBlog = async function (newBlogParam) {
    const newBlog = new blogModel({ ...newBlogParam });
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
 * @param {mongoose.Schema.Type.ObjectID} _blogID           id of the blog
 * @param {mongoose.Schema.Type.ObjectID} _idUserCommnent   email of the user
 * @param {string} content                                  content of the comment
 */
const commmentBlogByID = async function(_blogID, _idUserCommnent, content){
    await blogmodel.findById(_blogID, function(BlogCrr){
        BlogCrr.comment.push(new blogModel.commentModel())
    })
}


/**
 * Reply comment by ID
 */
const replyCommentByID = async function(_commentID, _idUserReply, content){
    await commnent.findById(_commentID, function(BlogCrr){
        BlogCrr.commnent.add({
            _idUserReply,
            content
        });
    })
}


module.exports = {
    createBlog, 
    removeBlogByFindID, 
    updateBlogByID,
    passCensorshipBlogByID,
    commmentBlogByID
}