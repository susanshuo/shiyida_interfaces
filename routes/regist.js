var express = require('express');
var router = express.Router();
var users = require('../models/users');
//handle the register
router.post('/',function(req,res){
	var username = req.body['host_id'];
	var password = req.body['password'];
	var host_id_pic = req.body['host_id_pic'];
	users.regist(username,password,host_id_pic,function(msg){
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('reg');
});
//中间件暴露接口
module.exports = router;