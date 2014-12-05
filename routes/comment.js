var express = require('express');
var comment = require('../models/pub_comment.js');
var router = express.Router();

router.post('/',function(req,res){
	var guest_id = req.body['guest_id'];
	var topic_id = req.body['topic_id'];
	var content = req.body['content'];
	comment.comment(guest_id,topic_id,content,function(msg){
		console.log("msg:",msg);
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('comment');
});
module.exports = router;