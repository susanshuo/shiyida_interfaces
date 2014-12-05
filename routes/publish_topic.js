var express = require('express');
var publish_topic = require('../models/publish_topic.js');
var router = express.Router();
//handle publish topics
router.post('/',function(req,res){
	var host_id = req.body['host_id'];
	var msg_des = req.body['msg_des'];
	var msg_topic = req.body['msg_topic'];
<<<<<<< HEAD
	var classification = $_POST['classification'];
	public_topic.publish(host_id,msg_des,msg_topic,classification,function(msg){
=======
	var classification = req.body['classification'];
	publish_topic.publish(host_id,msg_des,msg_topic,classification,function(msg){
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
		res.write(msg.toString());
		res.end();
	});
});
router.get('/',function(req,res){
<<<<<<< HEAD
	render('publish_topic');
=======
	res.render('publish_topic');
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
});
module.exports = router;