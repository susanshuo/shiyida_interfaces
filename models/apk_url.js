var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
exports.apk_url = function(call){
	async.auto({
		apk_url:function(callback){
			client.get("apk_url",function(err,apk_url){
					console.log(err,apk_url);
					callback(err,apk_url);
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