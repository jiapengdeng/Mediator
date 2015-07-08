(function(root){
    function guidGenerator(){
        //生成GUID，唯一标识每一个订阅者to
        var date=new Date();
        return date.get;
    }

    //订阅者构造函数
    function Subscriber(fn,options,context){
        if(!this instanceof Subscriber){
            return new Subscriber(fn,option,context);//单例模式
        }else{
            this.id=guidGenerator();
            this.fn=fn;
            this.options=options;
            this.context=context;
            this.topic=null;
        }
    }

    //模拟topic
    //JavaScript允许我们使用Function对象作为原型的结合与新对象和构造函数一起使用
    function Topic(namespace){
        if(!this instanceof Topic){
            return new Topic(namespace);
        }else{
            this.namespace=namespace||"";
            this._callbacks=[];
            this._topics=[];
            this.stopped=false;
        }
    }
    //定义topic的peototype原型，包括添加订阅者和获得订阅者的方式
    Topic.prototype={
        //添加订阅者
        AddSubscriber:function(fn,options,context){
            var callback=new Subscriber(fn,options,context);
            this._callbacks.push(callback);
            callback.topic=this;
            return callback;
        },
        //Topic实列作为一个参数传递给Mediator回调，然后可以StopPropagation() 的简便方法来调用进一步的回调传播
        StopPropagation:function(){
            this.stopped=true;
        },
        //当给定Guid时，获取对应标识的订阅者
        GetSubscriber:function(identifier){
            for(var i= 0,l=this._callbacks.length;i<l;i++){
                if(this._callbacks[i].id==identifier||this._callbacks[fn]==identifier){
                    var sub=this._callbacks[i];
                }
                for(var key in this._topics){
                    if(this._topics.hasOwnProperty(key)){
                        var sub=this._topics[j].GetSubscriber(identifier);
                        if(sub!==undefined){
                            return sub;
                        }
                    }
                }
            }
        },
        //如果需要他们，我们可以提供简单的方法添加新的topic，检查现有的topic或获得topic
        AddTopic:function(topic){
            this._topics[topic]=new Topic((this.namespace?this.namespace+":":"")+topic);
        },
        HasTopic:function(topic){
            return this._topics.hasOwnProperty(topic);
        },
        ReturnTopic:function(topic){
            return this._topics[topic];
        },
        //如果不需要订阅者，可以显示的删除他们，通过他的主题递归的删除订阅者例如a:b:c
        RemoveSubscriber:function(identifier){
            if(!identifier){
                this._callbacks=[];
                for(var key in this._topics){
                    if(this._topics.hasOwnProperty(key)){
                        this._topics[key].RemoveSubscriber(identifier);
                    }
                }
            }
            for(var i= 0,l=this._callbacks.length;i<l;i++){
                if(this._callbacks[i].topic==identifier||this._callbacks[i].id==identifier){
                    this._callbacks[i].topic=null;
                    this._callbacks.splice(i,1);
                    i--;y--;
                }
            }
        },
        //通过子topic向订阅者发布任意参数，Mediator帖子将向下递归
        Publish:function(data){
            for(var i= 0,len=this._callbacks.length;i<len;i++){
                var callback=this._callbacks[i],l;
                callback.fn.apply(callback.context,data);
                l=this._callbacks.length;
                if(l<len){
                    i--;
                    len=l;
                }
            }
            for(var key in this._topics){
                if(!this.stopped){
                    if(this._topics.hasOwnProperty(key)){
                        this._topics[key].Publish(data);
                    }
                }
            }
            this.stopped=false;
        }
    };
    function Mediator(){
        if(!this instanceof Mediator){
            return new Mediator();
        }else{
            this._topics=new Topic("");
        }
    }
    //对于更高级的使用场景，我们可以让Mediator支持用于inbox:messages:read等主题topic命名空间，在接下来的
    //实例中，getTopic根据命名空间返回相应的主题示例
    Mediator.prototype={
        GetTopic:function(namespace){
            var topic=this._topics,
                namespaceHierarchy=namespace.split(":");
            if(namespace===""){
                return topic;
            }
            if(namespaceHierarchy.length>0){
                for(var i= 0,l=namespaceHierarchy.length;i<l;i++){
                    if(!topic.HasTopic(namespaceHierarchy[i])){
                        topic.AddTopic(namespaceHierarchy[i]);
                    }
                    topic=topic.ReturnTopic(namespaceHierarchy[i]);
                }
            }
            return topic;
        },
        Subscribe:function(topicName,fn,options,context){
            var options=options||{},
                context=context||{},
                topic=this.GetTopic(topicName),
                sub=topic.AddSubscriber(fn,options,context);
            return sub;
        },
        GetSubscriber:function(identifier,topic){
            return this.GetTopic(topic||"").GetSubscriber(identifier);
        },
        Remove:function(topicName,identifier){
            this.GetSubscriber(topicName).RemoveSubscriber(identifier);
        },
        Publish:function(topicName){
            var args=Array.prototype.slice.call(arguments,1),
                topic=this.GetTopic(topicName);
            args.push(topic);
            this.GetTopic(topicName).Publish(args);
        }
    };
    root.Mediator=Mediator;
    Mediator.Topic=Topic;
    Mediator.Subscriber=Subscriber;
})(window);
