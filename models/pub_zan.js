//赞 需要  点赞的用户的id guest_id   帖子的id  post_id
var redis = require('redis');
var async = require('async');
var client = redis.createClient(6379,"121.42.8.51");
client.auth('memeda');

exports.pub_zan = function(guest_id,post_id,call){
	
	console.log(guest_id,post_id);
	var host_id;
	var topic_id;
	var timestamp = new Date().getTime();
	
	async.auto({
		check_post:function(callback){
			client.hget("post:"+post_id,'uid',function(err,uid){
				console.log('uid:'+uid);
				if(uid == null){
					//post的id 不存在
					callback('0',post_id);
				}else{
					host_id = uid;
					if(host_id == guest_id)//发帖的用户不能给自己的帖子点赞
						return call(0);
					callback(err,uid);
				}
			});
		},
		get_topic_id:function(callback){
			client.hget("post:"+post_id,'pid',function(err,pid){
				console.log('pid:'+pid);
				if(pid == null){
					//post的id 不存在
					callback('0',post_id);
				}else{
					topic_id = pid;
					callback(err,pid);
				}
			});
		},
		check_guest:function(callback){
			client.hget("user:"+guest_id,'uid',function(err,uid){
				console.log(uid);
				if(uid == null){
					//guest的id 不存在
					callback('0',uid);
				}else{
					callback(err,uid);
				}
			});
		},
		incr_post_votes:['check_post',function(callback){
			client.hincrby('post:'+post_id,'votes',1,function(err,status){
				console.log('incr_post_votes',err,status);
				callback(err,status);
			});
		}],
		update_tidPosts_votes:['check_post',function(callback){
			client.zincrby('tid:'+topic_id+':posts:votes',1,post_id,function(err,status){
				console.log('update_tidPosts_votes',err,status);
				callback(err,status);
			});
		}],
		incr_host_reputation:['check_post',function(callback){
			client.hincrby('user:'+host_id,'reputation',1,function(err,status){
				console.log('incr_host_reputation',err,status);
				callback(err,status);
			});
		}],
		//判断用户是否已点过赞
		check_vote_again:['check_guest','check_post',function(callback){
			client.sismember('pid:'+post_id+':upvote',guest_id,function(err,isset){
				console.log('isset:',isset);
				if(isset == 1){
					callback('0',isset);
				}else{
					callback(err,isset);
				}
			})
		}],
		//记录点赞用户的id到post里
		add_guest_votes:['check_vote_again',function(callback){
			client.sadd('pid:'+post_id+':upvote',guest_id,function(err,status){
				console.log('add_guest_votes',err,status);
				callback(err,status);
			});
		}],
		//更新用户列表users
		update_users_reputation:['add_guest_votes','check_post',function(callback){
			client.zincrby('users:reputation',1,host_id,function(err,status){
				console.log('update_users_reputation',err,status);
				callback(err,status);
			})
		}],
		//更新发帖用户的uid upvote 列表
		update_uid_upvote:['add_guest_votes',function(callback){
			client.zadd('uid:'+guest_id+':upvote',timestamp,post_id,function(err,status){
				console.log('update_uid_upvote',err,status);
				callback(err,status);
			});
		}]
	},
	function(err,res){
		console.log(err);
		if(err == '0')
		{
			return call(0);//点赞失败
		}else if(err == null){
			console.log('1');
			return call(1);//点赞成功	
		}else{
			console.log(err,2);
			return call(2);//点赞失败
		}
	}
	);
};