/*
意见反馈接口
提供参数：意见内容content；用户id：host_id;邮箱：email；电话：phone
*/
var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
exports.suggestion = function(content,host_id,email,phone,call){
	//waterfall：上一个函数产生的返回值会当做参数传递给下一个函数
	async.waterfall([
	//得到下一个suggestion_id
		function(callback){
			client.hget('global','nextSuggestId',function(err,nextSuggestId){
				if(err){
					console.log("nextSuggestId:"+err);
				}	
				callback(err,nextSuggestId);
			});
		},
		//插入意见数据
		function(nextSuggestId,callback){
			client.hmset('suggestion:'+nextSuggestId,'content',content,'host_id',host_id,'email',email,'phone',phone,function(err,status){
				if(err){
					console.log("insert:"+err);
				}
				callback(err,status);
			});
		},
		//nextSuggestId+1
		function(status,callback){
			client.hincrby('global','nextSuggestId',1,function(err,status){
				if(err){
					console.log("incrby:"+err);
				}
				callback(err,status);
			});
		}
	]
	,function(err,results){
		if(err){
			return call('0');
		}
		else{
			return call('1');
		}
	});
};
