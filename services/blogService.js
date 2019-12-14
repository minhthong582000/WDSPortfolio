const blogModel = require('../models/blog')

const createBlog = async function (newBlogParam) {
    try {
        const newBlog = new blogModel(newBlogParam);
        const newBlogURL = removeTone(newBlog.get('title'));
        newBlog.set('customURL', newBlogURL);
        console.log('Creating new blog at /%s', newBlog.get('customURL'));
        await newBlog.save({}, function(err, doc){
            if (err){
                console.log(err);
            }else{
                console.log('Saved new blog at /%s', doc.get('title'));
            }
        });
        return newBlog;
    } catch(err) {
        console.log(err);
    }
}

const findBlogByURL = function(URL){
    console.log('Finding blog by URL: ', URL);

    const query = blogModel.findOne({customURL: URL});
    query.select('body customURL');
    query.exec(function(err, doc){
        if (err){
            return handleError(err);
        }else{
            console.log(query.body);
        }
    })
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