var mediator=(function(){
    //监听者队列，里面记录了所有监听者
    var topics={};

    //定义订阅函数
    var subscribe=function(topic,fn){
        if(!topics[topic]){
            //把改topic添加到事件队列中去
            topics[topic]=[];
        }
        topics[topic].push({context:this,fn:fn});
    }

    //订阅发布函数
    var publish=function(topic,obj){
        if(!topics[topic]){
            //如果事件队列中不存在topic，那么添加也没意义
            console.log("对应主题不存在");
            return false;
        }
        var subscribes=topics[topic];
        // 获取处topic外的参数
        var args=Array.prototype.slice.call(arguments,1);
        for(var i=0,l=subscribes.length;i<l;i++){
            var subscription=subscribes[i];
            subscription.fn.apply(subscription.context,args);
        }
        return this;
    };
    return {
        publish:publish,
        subscribe:subscribe,
        installTo:function(obj){
            obj.publish=publish;
            obj.subscribe=subscribe;
        }
    }
})()