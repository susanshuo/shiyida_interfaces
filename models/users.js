var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
exports.login = function(host_id,password,callback){
	client.hget("username:uid",host_id,function(err,uid){
		if(err){
			return callback(err);
		}

		if(uid == null){
			//username not exists
			return callback(0);
		}
		else{
			client.hget('user:'+uid,'password',function(err,pass){
				if(err){
					return callback(err);
				}
				if(password == pass){
				
				//correct password
					var msg = 1;
					return callback(msg);
				}
				else{
				//wrong password or 
					var msg = 2;
					return callback(msg);
				}
			});
		}
	});
};
exports.regist = function(host_id,password,host_id_pic,call){
	async.auto({
		check:function(callback){
			client.hget("username:uid",host_id,function(err,uid){
				console.log("username:uid:"+uid);
				if(uid != null){
					callback("0",uid);
				}
				else{
					callback(err,uid);
				}
			});
		},
		get_next_uid:['check',function(callback){
			client.hget('global','nextUid',function(err,next_uid){
				console.log("next_uid"+next_uid);
				callback(err,next_uid);
			});
		}
		],
		set_username_id:['check','get_next_uid',function(callback,results){//参数顺序：callback,results
			client.hmset('username:uid','username',host_id,'uid',results.get_next_uid,function(err,status){
				console.log(err);
				callback(err,status);
			});
		}
		],
		set_infor:['check','get_next_uid',function(callback,results){
			client.hmset('user:'+results.get_next_uid,'username',host_id,'password',password,'picture',host_id_pic,function(err,status){
				console.log(err);
				callback(err,status);
			});
		}
		],
		incr_next_uid:['set_infor',function(callback){
			client.hincrby('global','nextUid',1,function(err,status){
				callback(err,status);
			});
		}
		],
		incr_user_count:['set_infor',function(callback){
			client.hincrby('global','userCount',1,function(err,status){
				callback(err,status);
			});
		}
		],
	},
	function(err,results){
	//	console.log(err);
		if(err == "0"){
		//represents username exists
			console.log("0");
			return call(0);//这里要加上回调函数，否则无法跳转回去
		}
		if(err == null){
		//regist successfully
			console.log("1");
			return call(1);
		}
		else{
			console.log(err);
		//represents there is err!regist fail
			console.log("2");
			return call(2);
		}
	}
	);
};



