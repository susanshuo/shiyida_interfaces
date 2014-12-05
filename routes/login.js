var express = require('express');
var users = require('../models/users.js');
var router = express.Router();
//handle_login
router.post('/',function(req,res){
<<<<<<< HEAD
	var username = req.body['host_id'];
	var password = req.body['password'];
	users.login(username,password,function(msg){
=======
	var host_id = req.body['host_id'];
	var password = req.body['password'];
	users.login(host_id,password,function(msg){
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
		console.log("msg:"+msg);
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('login');
});
//中间件暴露接口
module.exports = router;