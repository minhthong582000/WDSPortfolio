const Service = require('../../services/ActivityService')
const mongoose = require('mongoose');
const multer = require('multer');
const Activity = mongoose.model('activities');
const fs = require('fs');

//Thông tin hoạt động
async function getActivities(req, res, next) {
	try {
        let activities = Activity.find({}).exec();

        [activities] = await Promise.all([activities]);
        
        return res.render('activities.ejs', {
            activities: activities,
            success: req.flash('success'),
            fail: req.flash('fail')
        })
	} catch (error) {
		next(error);
	}
}

//Thông tin chi tiết hoạt động
async function getActivityInfo(req, res, next) {
	try {
		let activity = await Activity.findOne({ id: req.params.id });
		return res.json(activity);
	} catch (error) {
		next(error);
	}
}

//Thêm hoạt động
async function postCreateActivity(req, res, next) {
	try {
        let activity = new Activity({...req.body});
        //console.log('Tên: '+activity.name);
        Activity.findOne({name: activity.name}, async function(errFindAct, resFindAct) {
            if(errFindAct) console.log('Lỗi kiểm tra hoạt động: '+errCountAct);
            else if(!resFindAct) {
                //console.log(activity);
                await activity.save();
                Service.checkDirectorySync('public/images/activities/'+activity._id);
                req.flash('success', 'Tạo hoạt động thành công');
                return res.redirect('/activities');
            } else if(resFindAct) {
                //console.log('Rs: '+resFindAct);
                req.flash('fail', 'Hoạt động đã tồn tại');
                return res.redirect('/activities');
            }
        });

	} catch (error) {
		next(error)
	}
}

//Thêm ảnh cho hoạt động
async function postAddImgForActivity(req, res, next) {
	try {
        Activity.findOne({_id: req.params.id}, async function(errFindAct, resFindAct) {
            if(errFindAct) console.log('Lỗi kiểm tra hoạt động: '+errFindAct);
            else if(resFindAct) {
                var img = new Array();
                for (var i = 0; i < resFindAct.images.length; i++) img[i] = resFindAct.images[i];
                var imgName = '';
                var upload = multer({storage: multer.diskStorage({
                    destination: (req, file, cb) => {
                        cb(null, 'public/images/activities/'+resFindAct._id)
                    },
                    filename: (req, file, cb) => {
                        imgName = resFindAct._id + '_' + Date.now() + '_' +Service.randomString(5);
                        //console.log('Tên: '+imgName);
                        img.push(imgName);
                        cb(null, imgName);
                    }
                })}).array('images', 50-resFindAct.images.length);

                upload(req,res,function(err) {
                    //console.log('Body file 0: %j',req.body);
                    //console.log('Body file 1: '+req.files);
                    if(err) {
                        req.flash('fail', `Upload ảnh thất bại, lỗi: ${err}`);
                        return res.redirect('/activities');
                    }
                    resFindAct.images = img;
                    resFindAct.save({}, function(err) {
                        if(err) console.log('Lỗi cập nhật hình ảnh: '+err);
                        else {
                            req.flash('success', 'Cập nhật hình ảnh thành công');
                            return res.redirect('/activities');
                        }
                    })
                });
            } else if(!resFindAct) {
                console.log('Rs: '+resFindAct);
                req.flash('fail', 'Hoạt động không tồn tại tồn tại');
                return res.redirect('/activities');
            }
        });

	} catch (error) {
		next(error)
	}
}

//Xóa ảnh hoạt động
async function getDelImgForActivity(req, res, next) {
	try {
        await Activity.findOne({_id: req.params.id}, async function(errFindAct, resFindAct) {
            if(errFindAct) console.log(`[DEL-IMG]-Lỗi kiểm tra hoạt động: ${errFindAct}`);
            else if(resFindAct) {
                console.log(req.params.id+'|-|'+req.params.img);
                var img = [];
                var i = 0;
                for(var j = 0; j < resFindAct.images.length; j++) {
                    if(resFindAct.images[j] != req.params.img) img[i] = resFindAct.images[j]; 
                    else continue;
                    i++;
                }
                resFindAct.images = img;
                await resFindAct.save({}, function(err) {
                    if(err) {
                        console.log('Lỗi lưu dữ liệu: '+err);
                        req.flash('fail', 'Xóa ảnh thất bại, lỗi: '+err);
                        return res.status(200).redirect('/activities')
                    }
                });
                Service.deleteImg('public/images/activities/'+req.params.id+'/'+req.params.img);
                req.flash('success', 'Xóa ảnh thành công');
                return res.status(200).redirect('/activities')
            } else {
                req.flash('fail', 'Hoạt động không tồn tại');
                return res.redirect('/activities');
            }
        });

	} catch (error) {
        console.error(error)
        return errorNotify(res, error)
	}
}

//Chỉnh sửa hoạt động
async function postEditActivity(req, res, next) {
	try {
        await Activity.findOne({_id: req.params.id}, async function(errFindAct, resFindAct) {
            if(errFindAct) console.log(`[EDIT-ACT]-Lỗi kiểm tra hoạt động: ${errFindAct}`);
            else if(resFindAct) {
                resFindAct.startDate = req.body.startDate;
                resFindAct.endDate = req.body.endDate;
                resFindAct.description = req.body.description;
                await resFindAct.save({}, function(err) {
                    if(err) console.log(`Lỗi lưu thay đổi: ${err}`);
                    else {
                        req.flash('success', 'Chỉnh sửa hoạt động thành công');
                        res.redirect(`/activities`);
                    }
                })
            } else {
                req.flash('fail', 'Không tìm thấy hoạt động cần thay đổi');
                return res.redirect('/activities');
            }
        })
	} catch (error) {
		next(error);
	}
}

//Xóa hoạt động
async function getDeleteActivity(req, res, next) {
    //console.log('id'+req.params.id);
	try {
        await Activity.findOne({_id: req.params.id}, async function (errFindAct, resFindAct) {
            if(errFindAct) console.log(`Lỗi kiểm tra hoạt động: ${errFindAct}`);
            else if(resFindAct) {
                await Activity.deleteOne({_id: req.params.id}, function(err) {
                    if(err) return handleError(err);
                })
                Service.deleteFolderImg('public/images/activities/'+req.params.id)
                req.flash('success', 'Xóa hoạt động thành công');
                return res.status(200).redirect('/activities');
            } else {
                req.flash('fail', 'Không tìm thấy hoạt động cần xóa');
                return res.redirect('/activities');
            }
        })
	} catch (error) {
        console.error(error)
        return errorNotify(res, error)
	}
}

module.exports = { 
    getActivities,
    getActivityInfo,
    postCreateActivity,
    postAddImgForActivity,
    getDelImgForActivity,
    postEditActivity,
    getDeleteActivity
}