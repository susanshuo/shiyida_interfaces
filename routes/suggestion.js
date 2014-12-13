var express = require('express');
var suggest = require('../models/suggestion.js');
var router = express.Router();
//handle_login
router.post('/',function(req,res){
	var host_id = req.body['host_id'];
	var content = req.body['content'];
	var email = req.body['email'];
	var phone = req.body['phone'];
	suggest.suggestion(host_id,content,email,phone,function(msg){
		console.log("msg:"+msg);
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('suggestion');
});
//中间件暴露接口
module.exports = router;