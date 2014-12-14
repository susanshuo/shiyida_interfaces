var express = require('express');
var versionname = require('../models/versionname.js');
var router = express.Router();

router.get('/',function(req,res){
	versionname.versionname(function(msg){
		console.log("msg:",msg);
		res.write(JSON.stringify(msg));
		res.end();
	});
});
module.exports = router;