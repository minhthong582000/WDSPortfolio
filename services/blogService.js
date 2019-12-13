const blogModel = require('../models/blog')

const createBlog = async function (newBlogParam) {
    const newBlog = new blogModel({ ...newBlogParam });
    await newBlog.save();
}

const removeBlogByFindID = async function (_id) {
    return await userModel.findByIdAndDelete(_id);
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

const passCensorshipBlogByID = async function(_id){
    await blogModel.findById(_id, function(BlogCrr){
        BlogCrr.censorship = true;
        blogModel.save((err)=>{
            console.log(err + "");
        })
    });
}

const commentBlogByID = async function(_id, _idUserComment, content){
    await blogModel.findById(_id, function(BlogCrr){
        BlogCrr.comment.add({
            _idUserComment,
            content
        });
    })
}

module.exports = {
    createBlog, 
    removeBlogByFindID, 
    updateBlogByID,
    passCensorshipBlogByID,
    commentBlogByID
}