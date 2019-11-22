const Service = require('../../services/ActivityService')
const mongoose = require('mongoose');
const multer = require('multer');
const Activity = mongoose.model('activities');

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

async function getActivityInfo(req, res, next) {
	try {
		let activity = await Activity.findOne({ name: req.params.name });
		return res.json(activity);
	} catch (error) {
		next(error);
	}
}

async function postCreateActivity(req, res, next) {
	try {
        let activity = new Activity({...req.body});
        //console.log('Tên: '+activity.name);
        Activity.findOne({name: activity.name}, async function(errFindAct, resFindAct) {
            if(errFindAct) console.log('Lỗi kiểm tra hoạt động: '+errCountAct);
            else if(!resFindAct) {
                
                console.log(activity);
                var img = new Array();
                var imgName = '';

                var upload = multer({storage: multer.diskStorage({
                    destination: (req, file, cb) => {
                        cb(null, 'src/public/images/activities')
                    },
                    filename: (req, file, cb) => {
                        imgName = req.body.name + '_' + Date.now();
                        console.log('Tên: '+imgName);
                        img.push(imgName);
                        cb(null, imgName);
                    }
                })}).array('images',50);

                upload(req,res,function(err) {
                    console.log('Body file 0: '+req.body);
                    console.log('Body file 1: '+req.files);
                    if(err) {
                        req.flash('fail', `Upload ảnh thất bại, lỗi: ${err}`);
                        return res.redirect('/activities');
                    }
                    activity.images = img;
                });
                console.log(activity);
                await activity.save();
                req.flash('success', 'Tạo hoạt động thành công');
                return res.redirect('/activities');
            } else if(resFindAct) {
                console.log('Rs: '+resFindAct);
                req.flash('fail', 'Hoạt động đã tồn tại');
                return res.redirect('/activities');
            }
        });

	} catch (error) {
		next(error)
	}
}

async function postEditActivity(req, res, next) {
	try {
        Activity.findOne({name: req.params.name}, function(errFindAct, resFindAct) {
            if(errFindAct) console.log(`Lỗi kiểm tra hoạt động: ${errFindAct}`);
            else if(resFindAct) {
                resFindAct.startDate = req.body.startDate;
                resFindAct.endDate = req.body.endDate;
                resFindAct.description = req.body.description;
                resFindAct.save({}, function(err) {
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

async function getDeleteActivity(req, res, next) {
	try {
        Activity.findOne({name: req.params.name}, function (errFindAct, resFindAct) {
            if(errFindAct) console.log(`Lỗi kiểm tra hoạt động: ${errFindAct}`);
            else if(resFindAct) {
                Activity.deleteOne({name: req.params.name}, function(err) {
                    if(err) return handleError(err);
                    req.flash('success', 'Xóa hoạt động thành công');
                    return res.redirect('/activities');
                })
            } else {
                req.flash('fail', 'Không tìm thấy hoạt động cần xóa');
                return res.redirect('/activities');
            }
        })
	} catch (error) {
		next(error);
	}
}

module.exports = { 
    getActivities,
    getActivityInfo,
    postCreateActivity,
    postEditActivity,
    getDeleteActivity
}