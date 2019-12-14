const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const blogModel = require('../models/blog')


/*
    Remove Vietnamese tones to create a custom URL.
    @param str: The string that needs to remove tones.
*/
removeTone = function(str){
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/ /g, "-");
    return str;
}


const createBlog = async function (newBlogParam) {
    const newBlog = new blogModel(newBlogParam);

    const newBlogURL = removeTone(newBlogParam.get('title'));
    newBlog.set('customURL', newBlogURL);
    console.log('Creating new blog at /%s', newBlog.get('customURL'));

    return await newBlog.save({}, function(err, doc){
        if (err){
            handleError(err);
        }else{
            console.log('Saved new blog at /%s', doc.get('title'));
        }
    });
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


const findBlogsByUser = function(){}; // todo


const rankBlog = function(){}; // todo


const addTag = function(){}; //todo


module.exports = {
    createBlog, 
    removeBlogByFindID, 
    updateBlogByID,
    passCensorshipBlogByID,
    commmentBlogByID,
    findBlogByURL
}