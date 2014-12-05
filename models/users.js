var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
<<<<<<< HEAD
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
=======
exports.login = function(host_id,password,call){
	async.auto({
		//���ʹ���û�����½
		check_username:function(callback){
			client.hget("username:uid",host_id,function(err,username_uid){
				if(err){
					console.log("check_username");
				}
				console.log("username:"+username_uid);
				callback(err,username_uid);
			});
		},
		//���ʹ�������½��
		check_email:function(callback){
			client.hget("email:uid",host_id,function(err,email_uid){
				if(err){
					console.log("check_email");
				}
				console.log("email:"+email_uid);
				callback(err,email_uid);
			});
		},
		//����û��Ƿ����
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
		//��ȡ����
		get_passwpord:['check_if_user_exist',function(callback,results){
			client.hget('user:'+results.check_if_user_exist,'password',function(err,pass){
				if(err){
					console.log("check_passwpord");
				}
				callback(err,pass);
			});
		}
		],
		//��������Ƿ���ȷ
		check_passwpord:['check_if_user_exist','get_passwpord',function(callback,results){
			if(results.get_passwpord == password){
				//���õ�½״̬Ϊonline
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
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
				console.log("username:uid:"+uid);
				if(uid != null){
					callback("0",uid);
				}
				else{
					callback(err,uid);
				}
			});
		},
<<<<<<< HEAD
		get_next_uid:['check',function(callback){
=======
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
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
			client.hget('global','nextUid',function(err,next_uid){
				console.log("next_uid"+next_uid);
				callback(err,next_uid);
			});
		}
		],
<<<<<<< HEAD
		set_username_id:['check','get_next_uid',function(callback,results){//����˳��callback,results
			client.hmset('username:uid','username',host_id,'uid',results.get_next_uid,function(err,status){
=======
		set_username_id:['check_username','check_email','get_next_uid',function(callback,results){//����˳��callback,results
			client.hmset('username:uid',host_id,results.get_next_uid,function(err,status){
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
				console.log(err);
				callback(err,status);
			});
		}
		],
<<<<<<< HEAD
		set_infor:['check','get_next_uid',function(callback,results){
			client.hmset('user:'+results.get_next_uid,'username',host_id,'password',password,'picture',host_id_pic,function(err,status){
=======
		//����û���Ϣ��username��passord,picture,
		set_infor:['check_username','check_email','get_next_uid',function(callback,results){
			client.hmset('user:'+results.get_next_uid,'username',host_id,'password',password,'picture',host_id_pic,'email',email,function(err,status){
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
				console.log(err);
				callback(err,status);
			});
		}
		],
<<<<<<< HEAD
=======
		set_email_id:['set_infor','get_next_uid',function(callback,results){
			client.hmset('email:uid',email,results.get_next_uid,function(err,status){
				callback(err,status);
			});
		}	
		],
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
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
<<<<<<< HEAD
=======
		//���users:joindate
		add_users_joindate:['get_next_uid','set_infor',function(callback,results){
			var timestamp = Date.now();
			client.zadd('users:joindate',timestamp,results.get_next_uid,function(err,status){
				callback(err,status);
			});
		}
		]
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
	},
	function(err,results){
	//	console.log(err);
		if(err == "0"){
		//represents username exists
			console.log("0");
<<<<<<< HEAD
			return call(0);//����Ҫ���ϻص������������޷���ת��ȥ
=======
			return call("0");//����Ҫ���ϻص������������޷���ת��ȥ
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
		}
		if(err == null){
		//regist successfully
			console.log("1");
<<<<<<< HEAD
			return call(1);
=======
			return call("1");
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
		}
		else{
			console.log(err);
		//represents there is err!regist fail
			console.log("2");
<<<<<<< HEAD
			return call(2);
=======
			return call("2");
>>>>>>> 404bb80eaaaf4cd1ff0eb37e4b7140eff3976b4c
		}
	}
	);
};



