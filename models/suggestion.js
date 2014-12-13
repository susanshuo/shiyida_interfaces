/*
��������ӿ�
�ṩ�������������content���û�id��host_id;���䣺email���绰��phone
*/
var redis = require('redis');
var async = require('async');
var	client = redis.createClient(6379, "121.42.8.51");
client.auth('memeda');
exports.suggestion = function(content,host_id,email,phone,call){
	//waterfall����һ�����������ķ���ֵ�ᵱ���������ݸ���һ������
	async.waterfall([
	//�õ���һ��suggestion_id
		function(callback){
			client.hget('global','nextSuggestId',function(err,nextSuggestId){
				if(err){
					console.log("nextSuggestId:"+err);
				}	
				callback(err,nextSuggestId);
			});
		},
		//�����������
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
