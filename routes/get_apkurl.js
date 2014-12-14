var express = require('express');
var apk_url = require('../models/apk_url.js');
var router = express.Router();

router.get('/',function(req,res){
	apk_url.apk_url(function(msg){
		console.log("msg:",msg);
		res.write(JSON.stringify(msg));
		res.end();
	});
});
module.exports = router;