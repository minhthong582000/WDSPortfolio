/**
 * This file is for blog services at WDS' Portfolio project.
 * Auth:    Le Cong Nhan (https://www.facebook.com/lecongnhan.293)
 *          Pham Van Minh Nhut (https://www.facebook.com/phamvmnhut)
 */


 /**
  * As the max length of the title is 256;
  */
 const HASH_KEY = 257;


const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

/**
 * Mongoose's findOneAndUpdate() long pre-dates the MongoDB driver's findOneAndUpdate() function, 
 * so it uses the MongoDB driver's findAndModify() function instead.
 * See https://mongoosejs.com/docs/deprecations.html#-findandmodify-
 */
mongoose.set('useFindAndModify', false);

const blogModel = require('../models/blog');
const user = require('../models/user');


/**
 * Hash the id of the blog so that no url is duplicated.
 * See https://cp-algorithms.com/string/string-hashing.html
 * @param {String} m_ID The ID string that needs to hash.
 * 
 * @returns {number}    The hashed number.
 */
const idHash = function(m_ID){
    var hashValue = 0;

    for (var i = 0; i < m_ID.length; i++){
        hashValue += (Math.pow(m_ID[i].charCodeAt(0), i) * Math.pow(HASH_KEY, m_ID.length - i)) % (Math.pow(10, 9) + 9); 
    }

    return hashValue;
}


/**
 * Removes Vietnamese tone & replaces ' ' by '-';
 * @param {str} str The string that needs to be replaced.
 * 
 * @returns {String}    The removed & replaced string.
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
 * Creates a new blog article & saves it in the database.
 * @param {String}                          m_title The title of the blog article.
 * @param {String}                          m_body The body of the blog article (with tags).
 * @param {mongoose.Schema.Types.ObjectId}  m_authID The _id of the article author.
 * @param {[String]}                        m_tags The tags that the author has given.
 * @param {function}                        callback The callback function.
 * 
 * @returns {String}    The customURL of the blog.
 */
const createBlog = async function (m_title, m_body, m_authID, m_tags, callback) {
    const newBlog = await new blogModel({title: m_title, body: m_body, auth: m_authID, customURL: removeTone(m_title), tags: m_tags});

    const newBlogURL = removeTone(newBlog.get('title')) + '-' + idHash(newBlog.get('id')).toString();
    newBlog.set('customURL', newBlogURL);
    console.log('Creating new blog at /%s.', newBlog.get('customURL'));


    // todo handles the case where title is too short or too long.


    try{
        await newBlog.$__save({}, function(err, res){
            if (err){
                throw(err);
            }else{
                console.log('Saved new blog at /%s with title %s.', res.get('customURL'), res.get('title'));
                callback(newBlogURL);
            }
        });
    }catch(err){
        console.log(err.errmsg);
    }
}


/**
 * Finds and returns a blog by a URL.
 * @param {String} m_blogURL    The URL of the blog.
 * 
 * @returns {blogModel}   The found blog.
 */
const findBlogByURL = async function(m_blogURL){
    console.log('Finding a blog by URL: %s.', m_blogURL);


    return await blogModel.findOne({customURL: m_blogURL}, function(err, res){
        if (err){
            throw err;
        }else{
            if (res){
                console.log('Found a blog at %s with title %s.', m_blogURL, res.title);
                return res;
            }else{
                console.log('Cannot find any blog.');
                return false;
            }
        }
    }).catch(function(err){
    console.log(err.errmsg);
    return null;
    });
}


/**
 * Finds and removes a blog by a URL.
 * @param {String}      m_blogURL   The URL of being removed blog.
 * @param {function}    callback    The callback function.
 * 
 * @returns {boolean}   If the removing is succeed.
 */
const removeBlogByURL = async function(m_blogURL, callback){
    console.log('Removing a blog at URL %s.', m_blogURL);


    await blogModel.findOneAndRemove({customURL: m_blogURL}, function(err, res){
        if (err){
            throw err;
        }else{
            if (res){
                console.log('Removed a blog at %s.', m_blogURL);
                callback(true);
            }else{
                console.log('The blog doesn\'t exist.');
                callback(false);
            }
        }
    }).catch(function(err){
        console.log(err.errmsg);
        callback(false);
    })
}


/**
 * Finds one or more blogs by a tag.
 * @param {String}      m_tag       The tag that needs to find.
 * @param {function}    callback    The callback function.
 */
const findBlogByTag = async function(m_tag, callback){
    var result = [];

    await blogModel.find(function(err, res){
        if (!err){
            for (i in res){
                if (res[i].tags.includes(m_tag)){
                    result.push(res[i]);
                }
            }

            callback(result);
        }else{
            throw err;
        }
    }).catch(function(err){
        console.log(err.errmsg);
    })
}


/**
 * 
 * @param {*} _id 
 */
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
 * Finds the blog(s) by the user ID.
 * @param {mongoose.Schema.Types.ObjectId}  m_userID    The author ID.
 * @param {function}                        callback    The call back function.
 * 
 * @returns {[blogModel]}   The blogs that was created by m_userID.
 */
const findBlogsByUser = async function(m_userID, callback){
    console.log('Finding blogs by user %s', m_userID);
    var result = [];

    await blogModel.find(function(err, res){
        if (err){
            throw err;
        }else{
            for (i in res){
                if (res[i].auth == m_userID){
                    result.push(res[i]);
                }
            }

            callback(result);
        }
    }).catch(function(err){
        console.log(err.errmsg);
    });
}; // todo


/**
 * 
 * @param {String} m_blogURL 
 */
const updateView = async function(m_blogURL){
    await blogModel.updateOne({customURL: m_blogURL}, {$inc: {viewsCount: 1}, function(err, raw){
        if (err){
            throw err;
        }else{
            console.log('Updated views at %s', raw.customURL);
        }
    }}).catch(function(err){
        console.log(err.errmsg);
    })
}

const rankBlog = function(){}; // todo


const addTag = function(){}; // todo


module.exports = {
    createBlog, 
    removeBlogByFindID, 
    updateBlogByID,
    passCensorshipBlogByID,
    findBlogByURL,
    removeBlogByURL,
    findBlogsByUser,
    updateView,
    findBlogByTag
}