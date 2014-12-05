var express = require('express');
var publish_topic = require('../models/publish_topic.js');
var router = express.Router();
//handle publish topics
router.post('/',function(req,res){
	var host_id = req.body['host_id'];
	var msg_des = req.body['msg_des'];
	var msg_topic = req.body['msg_topic'];
	var classification = req.body['classification'];
	publish_topic.publish(host_id,msg_des,msg_topic,classification,function(msg){
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
	res.render('publish_topic');
});
module.exports = router;