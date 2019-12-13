const blogmodel = require('../models/blog')

const createBlog = async function (newBlogParam) {
    const newBlog = new blogmodel({ ...newBlogParam });
    await newBlog.save();
}

const removeBlogByFindID = async function (_id) {
    return await usermodel.findByIdAndDelete(_id);
}

const updateBlogByID = async function (updateDoc){
    const {id, ...content} = updateDoc;
    try {
        await blogmodel.findByIdAndUpdate(id, content);
    }
    catch (err) {
        console.log(err + "");
        return false;
    }
}

const passCensorshipBlogByID = async function(_id){
    await blogmodel.findById(_id, function(BlogCrr){
        BlogCrr.censorship = true;
        blogmodel.save((err)=>{
            console.log(err + "");
        })
    });
}

const commmentBlogByID = async function(_id, _idUserCommnent, content){
    await blogmodel.findById(_id, function(BlogCrr){
        BlogCrr.commnent.add({
            _idUserCommnent,
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