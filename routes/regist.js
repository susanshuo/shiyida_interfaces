var express = require('express');
var router = express.Router();
var users = require('../models/users');
//handle the register
router.post('/',function(req,res){
<<<<<<< HEAD
	var username = req.body['host_id'];
	var password = req.body['password'];
	var host_id_pic = req.body['host_id_pic'];
	users.regist(username,password,host_id_pic,function(msg){
=======
	var host_id = req.body['host_id'];
	var password = req.body['password'];
	var host_id_pic = req.body['host_id_pic'];
	var email = req.body['email'];
	users.regist(email,host_id,password,host_id_pic,function(msg){
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('reg');
});
//中间件暴露接口
module.exports = router;