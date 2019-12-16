const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const blogModel = require('../models/blog');
const user = require('../models/user');


/**
 * Remove Vietnamese tone & replace space by '-';
 * @param {str} str The string that needs to be replaced.
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


/**
 * Create a new blog article & save it in the database.
 * @param {String} m_title The title of the blog article.
 * @param {String} m_body The body of the blog article (with tags).
 * @param {mongoose.Schema.Types.ObjectId} m_authID The _id of the article author.
 * @param {[String]} m_tags The tags that the author has given.
 */
const createBlog = async function (m_title, m_body, m_authID, m_tags) {
    const newBlog = await new blogModel({title: m_title, body: m_body, auth: m_authID, customURL: removeTone(m_title)});

    const newBlogURL = removeTone(newBlog.get('title'));
    newBlog.set('customURL', newBlogURL);
    console.log('Creating new blog at /%s', newBlog.get('customURL'));

    try{
        await newBlog.$__save({}, function(err, doc){
            if (err){
                throw(err);
            }else{
                console.log('Saved new blog at /%s', doc.get('customURL'));
                return newBlogURL;
            }
        });
    }catch(err){
        console.log(err.errmsg);
    }
}


/**
 * Finds a blog by a URL.
 * @param {String} m_blogURL The URL of the blog.
 * @returns {{censorship, title, body, date, auth, tags}}
 */
const findBlogByURL = async function(m_blogURL){
    console.log('Finding a blog by URL:', m_blogURL);


    try{
        return await blogModel.findOne({customURL: m_blogURL}, function(err, res){
            if (err){
                throw err;
            }else{
                console.log('Found a blog at %s: %s', m_blogURL, res.title);
                 return {censorship: res.censorship, title: res.title, body: res.body, date: res.date, auth: res.auth, tags: res.tags};
            }
        })
    }catch(err){
        console.log(err);
    }
}


const removeBlogByURL = async function(m_blogURL){

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


const emptyDatabase = function(){
    blogModel.deleteMany({}, function(err){
        if (err){
            throw err;
        }else{
            console.log('Emptied database.')
        }
    }).catch(function(err){
        console.log(err);
    })
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
    findBlogByURL,
    emptyDatabase,
    removeBlogByURL
}