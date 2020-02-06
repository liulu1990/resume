var courseId = getUrlParam('courseId'),
    id = getUrlParam('id'),
    time = showTime(),
    pageName = "课程中心",
    pageRows = "5";
 //选中选课中心nav
function navSelect(){
    $('#navBox li').each(function() {
        if($(this).children('a').text()==pageName){
            $(this).children('a').addClass('cat');
            return false;
        }  
    });
};
//留言心得分页
function initMessagePage(pages) {
    laypage({
        cont: 'pagination', 
        pages: pages, 
        first: '首页', //若不显示，设置false即可
        last: '尾页', //若不显示，设置false即可
        prev: '上一页', //若不显示，设置false即可
        next: '下一页', //若不显示，设置false即可
        jump: function (obj) {
            messageThisDate(obj.curr);
        }
    });
}
//笔记分页
function initNotesPage(pages) {
    laypage({
        cont: 'pagination1', 
        pages: pages, 
        first: '首页', //若不显示，设置false即可
        last: '尾页', //若不显示，设置false即可
        prev: '上一页', //若不显示，设置false即可
        next: '下一页', //若不显示，设置false即可
        jump: function (obj) {
            notesThisDate(obj.curr);
        }
    });
}
//时间
function showTime(){
    var today = new Date();
    var y=today.getFullYear();
    //var month=today.getMonth()+1+"-";
    var month=today.getMonth()+1<10?'0'+((today.getMonth())+1):(today.getMonth())+1;
    var td=today.getDate()<10?'0'+today.getDate():today.getDate();
    var h=today.getHours()<10?'0'+today.getHours():today.getHours();
    var m=today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes();
    var s=today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
    var time =y+"-"+month+"-"+td+"　"+h+":"+m+":"+s ;
    return time;
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//课程信息
function course(){
    $.ajax({
           type: "GET",
           url: rootPath+"/web/webInfo/getSourceInfoById.action?id="+courseId+"&createUser=1",
           dataType:"json",
           success: function(result){
               console.log(result);
               if(!result.success){
                    return false;
               }
               var lefthtml = courseDataLeft(result.data),
                   righthtml= courseDataRight(result.data);
               var $container  = $('#container'),
                   $right      = $('#source_content');
               $container.html(lefthtml);
               $right.html(righthtml);
               if(result.data.collect == 1){
                    $('#collect').text('取消收藏');
                    $('#collect').attr('type','0');
                }
           },
           error: function(){
           }
    });
}
//课程左侧信息
function courseDataLeft(datas){
	var template = [];
    template.push('<div class="course_img"><img src="'+ datas.extStr1 + datas.courseImg+'" /></div><div class="lx_dec"><h2>' + $.fixedWidth(datas.courseName,46) + '</h2><div class="lx_z"><span class="lx_title fl"><em class="lxb fl">课程类型：</em><em class="lx_font fl">' + datas.coursetypeIdValue + '</em></span><a href="javascript:;" class="cl fr" id="collect">收藏课程</a></div><div class="lx_z"><span class=" fl">课程学时：<em>' + datas.sc + '</em></span><span class="lx_core fl">课程学分：' + datas.coursePoint + '</span><span class="lx_core fl">讲师：' + datas.docentName +'</span></div></div>');
	return template.join('');
}
//课程右侧信息列表
function courseDataRight(datas){
	var template = [];
    var serverUrl = datas.extStr1;
    for(var i = 0,len = datas.attachList.length;i < len;i++){
        var data = datas.attachList[i];
        template.push('<dd> <span class="s_fa fl">' + data.fileName + '</span> <a href="'+ serverUrl + data.resourcesName+'" class="onload fr">下 载<i></i></a> <a href="videoPlay.html?id='+ id +'&videoUrl='+serverUrl + data.resourcesName+'" target="_blank" class="play fr" onclick="point('+serverUrl + data.resourcesName+')">播 放<i></i></a> </dd>');
    }
	return template.join('');
}
//请求分页
function thisPages(getUrl,getType,type){
    $.ajax({
        url : getUrl,
        type : getType,
        dataType : 'json',
        success : function(dataJson) {
            if(!dataJson.success){
                UFQ.layer(dataJson.errorMessage);
                return false;
            }
            if(type=='message'){
                initMessagePage(dataJson.data.totalPages);
            }else if(type=='notes'){
                initNotesPage(dataJson.data.totalPages);
            }
        },
        error : function() {
        },
    });
};

//请求数据
function thisDate(curr,getUrl,getType,type){
    $.ajax({
        url : getUrl,
        type : getType,
        dataType : 'json',
        success : function(dataJson) {
            if(!dataJson.success){
                UFQ.layer(dataJson.errorMessage);
                return false;
            }
            //留言心得内容
            if(type = "message"){
                var html = messageTemplate(type, dataJson.data.data);
                var message = $('#message');
                message.html(html);
                fold();
            }
            //学习笔记内容
            if(type="notes"){
                var html = notesTemplate(type, dataJson.data.data);
                var notes = $('#notes');
                notes.html(html);
            }    
        },
        error : function() {
        },
    });
};


function parseData(datas){
    var result = [];
    for(var i = 0;i <datas.length;i++){
        var obj = datas[i];
        if(obj.isReply === '0'){
            result[obj.id] = obj;
        }
    }
    for(var i = 0;i <datas.length;i++){
        var obj = datas[i];
        if(obj.isReply === '1'){
            if(result[obj.pId]){
                var item = result[obj.pId];
                if(!item.comments){
                    item.comments = [];
                }
                item.comments.push(obj);
                //review[obj.pId] = item;
            }
        }
    }
    
    return result.reverse();
}


//留言请求数据
function messageThisDate(curr,type){
    var getUrl = rootPath+'/web/webInfo/manageCommentList.action?createUser=1&courseId='+courseId+'&page='+(curr || '1')+'&pageRows=' + pageRows,
        getType="GET";
    thisDate(curr,getUrl,getType,type);
};
//留言模板
function messageTemplate(type, datas) {
    var template = [];
    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        template.push('<li class="li" id="' + data.id +'"><div class="fl da"><div class="img"><img src="" /></div> <span class="re">' + data.createUserValue + '</span> <span>积分：888</span></div><div class="da_r"><div class="db"><div class="l_t"><span class="lib fl">' + data.createUserValue +'</span><span class="fr">' + data.createDate + '</span></div><div class="l_h"> <span>' + data.commentText + '</span></div><div class="dc"> <a href="javascript:void(0)" class="fold">展开</a><a href="javascript:void(0)" class="thumb">赞(0)</a><a  href="javascript:void(0)" class="reply">回复</a> </div>'+(data.replyList ? discussAndReview(parseData(data.replyList)) : "")+'</div></div></div></div></li>');
    };                    
    return template.join('');
};
//留言回复
function discuss(datas){
    var template = [];
    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        template.push('<div class="l_h_sub" id="'+ data.id +'" userid="'+ data.createUser +'"><div class="l_t"><span class="lib fl">' + data.createUserValue + '</span><span class="fr">' + data.createDate + '</span></div><div class="l_h"><span>' + data.replyText + '</span></div><div class="dc"><a data-id='+data.createUser+' href="javascript:void(0)" class="review">评论</a> </div></div>');
    };                    
    return template.join('');
}
//留言评论
function review(datas){
    var template = [];
    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        template.push('<div class="l_h_sub l_h_pinglun" id="'+ data.id +'" userid="'+ data.createUser +'"><div class="l_t"><span class="lib">' + data.createUserValue + '</span>评论<span class="lib">' + data.commentator + '</span><span class="fr">' + data.createDate + '</span></div><div class="l_h"><span>' + data.replyText + '</span></div><div class="dc"><a href="javascript:void(0)" class="review">评论</a> </div></div>');
    };                    
    return template.join('');
}
//留言回复加评论
function discussAndReview(datas){
    var template = [];
    for(var key in datas){
        if(datas.hasOwnProperty(key)){
            var data = datas[key];
            template.push('<div class="l_h_sub" id="'+ data.id +'" userid="'+ data.createUser +'"><div class="l_t"><span class="lib">' + data.createUserValue + '</span><span class="fr">' + data.createDate + '</span></div><div class="l_h"><span>' + data.replyText + '</span></div><div class="dc"><a data-id='+data.createUser+' href="javascript:void(0)" class="review">评论</a> </div></div>');
            if(data.comments){
                template.push(review(data.comments));
            }
        }
    }                   
    return template.join('');
}

//笔记请求数据
function notesThisDate(curr,type){ 
    var getUrl = rootPath+'/web/webInfo/manageNoteList.action?createUser=1&courseId='+courseId+'&page='+(curr || '1')+'&pageRows=' + pageRows,
        getType="GET";
    thisDate(curr,getUrl,getType,type);
};
//笔记模板
function notesTemplate(type, datas) {
    var template = [];
    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        template.push('<li class="li"><div class="fl da"><div class="img"><img src="" /></div> <span class="re">' + data.createUserValue + '</span> <span>积分：888</span></div><div class="da_r"><div class="db"><div class="l_t">' + data.createUserValue + '<span class="fr">' + data.createDate + '</span></div><div class="l_h"> <span class="lib">用户名具体：</span><span>' + data.notes + '</span></div></div></div></div></li>');
    };                    
    return template.join('');
};

//留言心得
function getMessage(){
    var getUrl = rootPath+'/web/webInfo/manageCommentList.action?createUser=1&courseId='+courseId+'&page=1&pageRows=' + pageRows,
        getType = 'GET',
        type = 'message';
    thisPages(getUrl,getType,type);
}
//学习笔记
function getNote(){
    var getUrl = rootPath+'/web/webInfo/manageNoteList.action?createUser=1&courseId='+courseId+'&page=1&pageRows=' + pageRows,
        getType = 'GET',
        type = 'notes';
    thisPages(getUrl,getType,type);
}
//点击收藏
function clickCollect(){
    $(document).on('click' , '#collect' , function(e){
        var $this = $(this);
        $.ajax({
            url : rootPath+'/web/webInfo/collectByUserId.action?createUser=1&courseId='+courseId+'&collect=1',
            getType : 'POST',
            success : function(dataJson){
                if(!dataJson.success){
                    UFQ.layer(dataJson.errorMessage);
                    return false;
                }
                if($.trim($this.text())=='收藏课程'){
                    $this.text('取消收藏');
                    $this.attr('type','0');
                    UFQ.layer('取消成功');
                }else{
                    $this.text('收藏课程');
                    $this.attr('type','1');
                    UFQ.layer('收藏成功');
                }
            },
            error : function() {
            },
        })
    });
}
//回复评论输入框
function commentBox(id,className,userId){
    var commentBox ='<div class="commentBox mgT10">'+
                '<div class="commentBox_top cl"><span>回复</span><a href="javascript:;" class="closeBtn" title="关闭">X</a></div>'+
                '<div class="commentBox_middle">'+
                '<div class="right"><div class="commentBox_inputBox">'+
                '<input type="text" value="写点什么吧" class="commentBox_input" />'+
                '<textarea rows="5" cols="" class="commentBox_textarea"></textarea></div>'+
                '<div class="commentBox_inputBtn"> <a href="javascript:;" data-id="' + id + '" class="' + className + '" user-id="' + userId + '">发表</a></div></div></div></div>';
    return commentBox;
}

//回复文本框焦点
$(document).ready(function(){ 
    //focusblur 
    jQuery.focusblur = function(focusid) { 
        var focusblurid = $(focusid); 
        focusblurid.focus(function(){ 
            $(this).hide();
            $(this).next().show().focus();
        }); 
        focusblurid.next().blur(function(){ 
            var commentBoxVal = this.value;
            if(commentBoxVal){
                return false;
            }
            $(this).hide();
            $(this).prev().show();
        }); 
    }; 
    
}); 
function messageFocus(){
   $('#messageText').focus();
}
function noteFocus(){
   $('#noteText').focus();
}
//发表心得
function messageText(){
    $('.commentBtn').click(function(){
        var messageText = $('#messageText').val();
        if(messageText == ""){
            UFQ.layer("发表内容不能为空。",messageFocus);
            return false;
        }
        $.ajax({
            url : rootPath+'/web/webInfo/saveCommentInfo.action',
            type : 'POST',
            data : {"createUser":"1","courseId":courseId,"commentText":messageText,"businessType":""},
            success : function(dataJson) {
                if(!dataJson.success){
                    UFQ.layer(dataJson.errorMessage);
                    return false;
                }
                else{
                    window.location.reload();
                }
            },
            error : function() {
                UFQ.hide();
            },
        });
    });
};
//发表笔记
function noteText(){
    $('.noteBtn').click(function(){
        var noteText = $('#noteText').val();
        if(noteText == ""){
            UFQ.layer("发表内容不能为空。",noteFocus);
            return false;
        }
        $.ajax({
            url : rootPath+'/web/webInfo/saveNoteInfo.action',
            type : 'POST',
            data : {"createUser":"1","courseId":courseId,"notes":noteText},
            success : function(dataJson) {
                if(!dataJson.success){
                    UFQ.layer(dataJson.errorMessage);
                    return false;
                }
                else{
                    getNote();
                    $('#noteText').val("");
                    
                }
            },
            error : function() {
                UFQ.hide();
            },
        });
    });
}
function commentBox_textareaFocus(){
   $('#commentBox_textarea').focus();
}

function commentString(data){
    var createDate = showTime();

    var datas = [{'id':data.id,'createUserValue':data.createUserValue,'createDate':data.createDate,'replyText':data.replyText,'createUser':data.createUser}];
    var comment = discuss(datas);
    return comment;
}
function replyString(data){
    var createDate = showTime();
    var datas = [{'id':data.id,'createUserValue':data.createUserValue,'commentator':data.commentator,'createDate':data.createDate,'replyText':data.replyText,'createUser':data.createUser}];
    var reply = review(datas);
    return reply;
}
//留言心得回复
function commentBox_textarea(){
    $(document).on('click', '.submitBtn', function () {
        var liId= $(this).attr('data-id');
        var commentBox_textarea = $('.commentBox_textarea').val();
        if(commentBox_textarea == ""){
            UFQ.layer("发表内容不能为空。",commentBox_textareaFocus);
            return false;
        }
        $.ajax({
            url : rootPath+'/web/webInfo/saveCommentReply.action',
            type : 'POST',
            data : {"createUser":"1","commentatorId":liId,"studyCommentId":liId,"replyText":commentBox_textarea,"isReply":"0"},
            success : function(dataJson) {
                if(!dataJson.success){
                    UFQ.layer(dataJson.errorMessage);
                    return false;
                }
                else{
                    var comment = commentString(dataJson.data);
                    $("#"+liId).find(".db").children('.commentBox').after(comment);
                    $("#"+liId).find(".db").children('.commentBox').remove();
                }
            },
            error : function() {
                UFQ.hide();
            },
        });
    });

    $(document).on('click', '.replyBtn', function () {
        var liId= $(this).parents('li').attr('id');
        var userId= $(this).attr('user-id');
        var pId = $(this).parents('li').find('.l_h_sub:first').attr('id');
        var commentBox_textarea = $('.commentBox_textarea').val();
        if(commentBox_textarea == ""){
            UFQ.layer("发表内容不能为空。",commentBox_textareaFocus);
            return false;
        }
        $.ajax({
            url : rootPath+'/web/webInfo/saveCommentReply.action',
            type : 'POST',
            data : {"createUser":"1","commentatorId":userId,"pId":pId,"studyCommentId":liId,"replyText":commentBox_textarea,"isReply":"1"},
            success : function(dataJson) {
                if(!dataJson.success){
                    UFQ.layer(dataJson.errorMessage);
                    return false;
                }
                var reply = replyString(dataJson.data);
                $("#"+liId).find(".db").children('.commentBox').after(reply);
                $("#"+liId).find(".db").children('.commentBox').remove();
            },
            error : function() {
                UFQ.hide();
            },
        });
    });
};
function fold(){
    $('ul.ul li').each(function(){
        var pinglun = $(this).find('.l_h_pinglun');
        if(pinglun.length > 3){
            $(this).find('.fold').css("display","inline-block");
            pinglun.eq(2).nextAll().hide();
        }
    })
}
$(function(){
    navSelect();
    course();
    getMessage();
    $('.c_m_learn li').click(function(){
        var index = $(this).index();
        $(this).parent(".c_m_learn").find("li").eq(index).addClass("active").siblings().removeClass('active');
        if($(this).attr('type')=='message'){
            getMessage(); 
        }else{
            getNote();
        }
        $(this).parents('.c_message').find(".c_m_con").hide().eq(index).show();  
    });
    messageText();
    noteText();
    commentBox_textarea();
    $(document).on('click', '.reply', function () {
        var liId= $(this).parents('li').attr('id');
        $('.c_message').find('.commentBox').remove();
        $(this).parents('.db').children('.dc').after(commentBox(liId,"submitBtn"));
        $.focusblur(".commentBox_input"); 
    })
    $(document).on('click', '.review', function () {
        var prevId= $(this).parents('.l_h_sub').attr('id');
        var userId= $(this).parents('.l_h_sub').attr('userid');
        $('.c_message').find('.commentBox').remove();
        $(this).parents('.l_h_sub').after(commentBox(prevId,"replyBtn",userId));
        $.focusblur(".commentBox_input"); 
    })
    $(document).on('click', '.closeBtn', function () {
        $(this).parents('.commentBox').remove();
        $.focusblur(".commentBox_input"); 
    })
    $(document).on('click', '.fold', function () {
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $(this).parents('.db').find('.l_h_pinglun:eq(2)').nextAll().stop().slideDown(200);
            $(this).html("收起")
        }else{
            $(this).parents('.db').find('.l_h_pinglun:eq(2)').nextAll().stop().slideUp(200);
            $(this).html("展开") 
        }
        
    })
    clickCollect();
});

/*后缀名*/
function point(videoUrl){
    alert(1);
    var point = videoUrl.lastIndexOf("."); 
    var type = videoUrl.substr(point);
    if(type==".ppt"||type==".pptx"||type==".xls"||type==".xlsx"||type==".doc"||type==".docx"||type==".pdf"){ 
        alert(1);
        type=".swf";
    }
}