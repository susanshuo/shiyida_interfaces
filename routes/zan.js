var express = require('express');
var zan = require('../models/pub_zan.js');
var router = express.Router();

router.post('/',function(req,res){
	var guest_id = req.body['guest_id'];
	var post_id = req.body['post_id'];
	zan.pub_zan(guest_id,post_id,function(msg){
		console.log("msg:",msg);
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('zan');
});
module.exports = router;