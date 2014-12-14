var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
exports.versionname = function(call){
	async.auto({
		versionname:function(callback){
			client.get("versionname",function(err,versionname){
					console.log(err,versionname);
					callback(err,versionname);
				});
		}
	},
	function(err,result){
		if(err == null){
			console.log(result);
			return call(result);
		}else{
			console.log(err);
			console.log("0");
			return call("0");
		}
	}
	);
};