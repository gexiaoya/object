//封装一些公用的方法
let app = {
    // onclick="app.f1(this,'admin','status','{{@$value._id}}')"
    f1:function(el,collectionName,attr,id){
        // alert('更新状态成功...666')
        //在后端开一个api接口，利用ajax去请求这个接口，这个接口就可以给你
        //返回是否更新成功
        $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(data){
            //如果后端给你返回的data中有success，表示成功
            console.log(data);
            if(data.success){
                if(el.src.indexOf("yes") != -1){
                    el.src = "/admin/images/no.gif"
                }else{
                    el.src = "/admin/images/yes.gif"
                }
            }
        })
    }
};