var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
exports.login = function(host_id,password,call){
	async.auto({
		//如果使用用户名登陆
		check_username:function(callback){
			client.hget("username:uid",host_id,function(err,username_uid){
				if(err){
					console.log("check_username");
				}
				console.log("username:"+username_uid);
				callback(err,username_uid);
			});
		},
		//如果使用邮箱登陆；
		check_email:function(callback){
			client.hget("email:uid",host_id,function(err,email_uid){
				if(err){
					console.log("check_email");
				}
				console.log("email:"+email_uid);
				callback(err,email_uid);
			});
		},
		//检查用户是否存在
		check_if_user_exist:['check_email','check_username',function(callback,results){
			if(results.check_email == null){
				if(results.check_username == null){
					console.log("not exist");
					callback('0',null);
				}
				else{
					callback(null,results.check_username);
				}
			}
			else{
				callback(null,results.check_email);
			}
		}
		],
		//获取密码
		get_passwpord:['check_if_user_exist',function(callback,results){
			client.hget('user:'+results.check_if_user_exist,'password',function(err,pass){
				if(err){
					console.log("check_passwpord");
				}
				callback(err,pass);
			});
		}
		],
		//检查密码是否正确
		check_passwpord:['check_if_user_exist','get_passwpord',function(callback,results){
			if(results.get_passwpord == password){
				//设置登陆状态为online
				var timestamp = Date.now();
				client.zadd('users:online',tiemstamp,results.check_if_user_exist);
				client.hset('user:'+results.check_if_user_exist,'status','online');
				callback(null,'1');
			}
			else{
				callback(null,'2');
			}
		}
		]
	},
	function(err,results){
		if(err == '0'){
			return call("0");
		}
		if(results.check_passwpord == '1'){
			return call('1');
		}
		if(results.check_passwpord == '2'){
			return call('2');
		}
	}
	);
};
exports.regist = function(email,host_id,password,host_id_pic,call){
	async.auto({
		check_username:function(callback){
			client.hget("username:uid",host_id,function(err,uid){
				console.log("username:"+host_id);
				console.log("username:uid:"+uid);
				if(uid != null){
					callback("0",uid);
				}
				else{
					callback(err,uid);
				}
			});
		},
		check_email:function(callback){
			client.hget("email:uid",host_id,function(err,uid){
				if(uid != null){
					callback("0",uid);
				}
				else{
					callback(err,uid);
				}
			})
		},
		get_next_uid:['check_username','check_email',function(callback){
			client.hget('global','nextUid',function(err,next_uid){
				console.log("next_uid"+next_uid);
				callback(err,next_uid);
			});
		}
		],
		set_username_id:['check_username','check_email','get_next_uid',function(callback,results){//参数顺序：callback,results
			client.hmset('username:uid',host_id,results.get_next_uid,function(err,status){
				console.log(err);
				callback(err,status);
			});
		}
		],
		//添加用户信息；username，passord,picture,
		set_infor:['check_username','check_email','get_next_uid',function(callback,results){
			client.hmset('user:'+results.get_next_uid,'username',host_id,'password',password,'picture',host_id_pic,'email',email,function(err,status){
				console.log(err);
				callback(err,status);
			});
		}
		],
		set_email_id:['set_infor','get_next_uid',function(callback,results){
			client.hmset('email:uid',email,results.get_next_uid,function(err,status){
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
		//添加users:joindate
		add_users_joindate:['get_next_uid','set_infor',function(callback,results){
			var timestamp = Date.now();
			client.zadd('users:joindate',timestamp,results.get_next_uid,function(err,status){
				callback(err,status);
			});
		}
		]
	},
	function(err,results){
	//	console.log(err);
		if(err == "0"){
		//represents username exists
			console.log("0");
			return call("0");//这里要加上回调函数，否则无法跳转回去
		}
		if(err == null){
		//regist successfully
			console.log("1");
			return call("1");
		}
		else{
			console.log(err);
		//represents there is err!regist fail
			console.log("2");
			return call("2");
		}
	}
	);
};



