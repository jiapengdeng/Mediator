var pubsub={};
(function(q){
    var topics={},
        subUid=-1;
    //发布或广播事件，包含特定的topic名称和参数（比如传递的数据）
    q.publish=function(topic,args){
        if(!topics[topic]){
            //如果发布者队列中没有这种事件（事件队列中没有该事件），
            console.log("没有发布该事件")
            return false;
        }
        var subscribers=topics[topic],//查询
        len=subscribers?subscribers.length:0;//一个一个主题可以有多个观察者
        while(len--){
            subscribers[len].func(topic,args);
        }
        return this;
    };
    q.subscribe=function(topic,func){
        if(!topics[topic]){
            topics[topic]=[];
        }
        var token=(++subUid).toString();
        topics[topic].push({
            token:token,//给特殊的标记订阅号
            func:func
        });
        return token;
    };
    // 基于订阅上的标记引用，通过特定topic取消订阅
    q.unsubscribe=function(token){
        for(var m in topics){
            if(topics[m]){
                for(var i=0,j=topics[m].length;i<j;i++){
                    if(topics[m][i].token===token){
                        topics[m].splice(i,1);
                        return token;
                    }
                }
            }
        }
        return this;
    };

})(pubsub)