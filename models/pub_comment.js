//需要 发评论的用户id guest_id 主题的id topic_id  评论的内容 content
var redis = require('redis');
var async = require('async');
var client = redis.createClient(6379,"121.42.8.51");
client.auth('memeda');
exports.comment = function(guest_id,topic_id,content,call){
	var newPostId;
	var timestamp = new Date().getTime();
	async.auto({
		check_guest:function(callback){
			client.hget("user:"+guest_id,'uid',function(err,uid){
				console.log('check_guest',uid);
				if(uid == null){
					//guest的id 不存在
					callback('0',uid);
				}else{
					callback(err,uid);
				}
			});
		},
		check_topic:function(callback){
			client.hget("topic:"+topic_id,'tid',function(err,tid){
				console.log('check_topic',tid);
				if(tid == null){
					//topic的id 不存在
					callback('0',tid);
				}else{
					callback(err,tid);
				}
			});
		},
		//获取新帖post的id
		get_next_pid:function(callback){
			client.hget("global","nextPid",function(err,nextPid){
				console.log("nextPid:"+nextPid,err);
				if(nextPid != null){
					newPostId = nextPid;
					callback(err,nextPid);
				}else{
					callback('0',nextPid);
				}
			});
		},
		//添加新帖
		add_post:['check_guest','check_topic','get_next_pid',function(callback){
			client.hmset('post:'+newPostId,'pid',newPostId,'uid',guest_id,'tid',topic_id,'content',content,'timestamp',timestamp,'reputation',0,'votes',0,'editor','','edited',0,'deleted',0,function(err,status){
				console.log('add_post',err,status);
				callback(err,status);
			});
		}],
		//更新global表里的nextPid
		incr_next_pid:['add_post',function(callback){
			client.hincrby('global','nextPid',1,function(err,status){
				console.log('incr_next_pid',err,status);
				callback(err,status);
			});
		}],
		//更新global表里的postCount
		incr_post_count:['add_post',function(callback){
			client.hincrby('global','postCount',1,function(err,status){
				console.log('incr_post_count',err,status);
				callback(err,status);
			});
		}],
		//更新topic表中的 postcount
		incr_topic_postcount:['add_post',function(callback){
			client.hincrby('topic:'+topic_id,'postcount',1,function(err,status){
				console.log('incr_topic_postcount',err,status);
				callback(err,status);
			});
		}],
		//更新topic表中的 lastposttime
		update_topic_lastposttime:['add_post',function(callback){
			client.hset('topic:'+topic_id,'lastposttime',timestamp,function(err,status){
				console.log('update_topic_lastposttime',err,status);
				callback(err,status);
			});
		}],
		//更新tid表中的tid posts表
		update_tid_posts:['add_post',function(callback){
			client.zadd('tid:'+topic_id+':posts',timestamp,newPostId,function(err,status){
				console.log('update_tid_posts',err,status);
				callback(err,status);
			});
		}],
		//更新tid表中的tid posts:votes表
		update_tid_posts_votes:['update_tid_posts',function(callback){
			client.zadd('tid:'+topic_id+':posts:votes',0,newPostId,function(err,status){
				console.log('update_tid_posts_votes',err,status);
				callback(err,status);
			});
		}],
		//更新用户user:uid 中的用户发帖数量postcount
		incr_user_postcount:['add_post',function(callback){
			client.hincrby('user:'+guest_id,'postcount',1,function(err,status){
				console.log('incr_user_postcount',err,status);
				callback(err,status);
			});
		}],
		//更新用户user:uid 中的最近发帖时间lastposttime
		update_user_lastposttime:['add_post',function(callback){
			client.hset('user:'+guest_id,'lastposttime',timestamp,function(err,status){
				console.log('update_user_lastposttime',err,status);
				callback(err,status);
			});
		}],
		//更新用户列表users:postcount 对应的发帖的用户id的发帖数量postcount
		incr_users_postcount:['incr_user_postcount',function(callback){
			client.zincrby('users:postcount',1,guest_id,function(err,status){
				console.log('incr_users_postcount',err,status);
				callback(err,status);
			});
		}],
		//更新uid表中的uid posts 表
		update_uid_posts:['incr_user_postcount',function(callback){
			client.zadd('uid:'+guest_id+':posts',timestamp,newPostId,function(err,status){
				console.log('update_uid_posts',err,status);
				callback(err,status);
			});
		}]
	},
	function(err,res){
		console.log(err);
		if(err == '0')
		{
			return call(0);//评论失败
		}else if(err == null){
			console.log('1');
			return call(1);//评论成功	
		}else{
			console.log(err,2);
			return call(2);//评论失败
		}
	});
};