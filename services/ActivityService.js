const activities = require('../models/activities')
const fs = require('fs');
const fse = require('fs-extra');

function randomString(num) {
    var str = '';
    var character = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var charLength = character.length;
    for ( var i = 0; i < num; i++ ) {
       str += character.charAt(Math.floor(Math.random() * charLength));
    }
    return str;
}

//Kiểm tra thư mục
function checkDirectorySync(directory) {  
    try {
        fs.statSync(directory);
    } catch(e) {
        fs.mkdirSync(directory);
    }
}

//Xóa hình ảnh - xóa file
function deleteImg(path) {
    fs.unlink(path, (err) => {
        if (err) throw err;
        console.log('Đã xóa file hình ảnh');
    });
}

//Xóa hoạt động - Xóa folder
function deleteFolderImg(path) {
    fse.remove(path, err => {
        if (err) return console.error(err)
        console.log('Đã xóa thư mục chứa hình ảnh của hoạt động');
    })
}

module.exports = {
    randomString,
    checkDirectorySync,
    deleteImg,
    deleteFolderImg
}