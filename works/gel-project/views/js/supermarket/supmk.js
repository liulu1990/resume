function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
var id = GetQueryString("id");
var specialTit = {};
specialTit.$SpecialInfo = $('.white_block'); //专题简介
specialTit.$courselist = $('#courselist'); //课程列表
specialTit.$infoList = $('.bk_lfn'); //资料列表

specialTit.specialTit = function () {
    $.ajax({
        url: rootPath + "/cm/courseSpecial/get.action",
        dataType: "JSON",
        data: {
            id: id
        },
        success: function (result) { // 服务器返回的 json 结果
            // 这里处理 res.lists 中的数据内容，使用 html() 方法显示
            specialTit.$SpecialInfo.html('<p>' + result.introduction + '</p>');

        }
    });
}

specialTit.specialCour = function () {
    $.ajax({
        url: rootPath + "/cm/specialCourse/manageList.action",
        dataType: "JSON",
        data: {
            specialId: id
        },
        success: function (result) { // 服务器返回的 json 结果
        	  var html = '<div class="tit_text01 tt_sp"><h3>课程分类 1</h3><em>共（<span>08</span>）课</em></div>';
              html += '<div class="kc_special clearfix"><ul class="kcdb">';
              $(result.data).each(function (index, o) {
            	  html += '<li><div class="kclb_img">';
                  html += '<a href="../supermarket/cource_detail.html" target="_blank"><img src="../images/kc_01.jpg" /></a>';
                  html += '<p><a href="../supermarket/cource_detail.html" target="_blank">' + o.introduction + '</a></p>';
                  html += '</div><div class="wb_area clearfix">';
                  html += '<div class="wb_fl">';
                  html += '<p>学时：' + o.coursePeriod + '分</p>';
                  html += '<p>导师：' + o.lecturerName + '</p>';
                  html += '</div>';
                  html += '<div class="wb_fr">';
                  html += '<p><img src="../images/xx.png" /><img src="../images/xx.png" /><img src="../images/xx.png" /><img src="../images/xx.png" /><img src="../images/xx.png" /></p>';
                  html += '<p class="img_ct"><img src="../images/rw.png" /><span>999人</span></p>';
                  html += '	</div></div></li>';
              });
               html += '</ul></div>';
              specialTit.$courselist.html(html);
        }
    });
};
specialTit.specialGp = function () {
    $.ajax({
        url: rootPath + "/cm/courseGroup/queryAllCourseGroupCount.action",
        dataType: "JSON",
        success: function (result) { // 服务器返回的 json 结果
         }
    });
};


specialTit.specialBu = function () {
    $.ajax({
        url: rootPath + "/rm/resourceBusiness/manageList.action",
        dataType: "JSON",
        success: function (result) { // 服务器返回的 json 结果
         }
    });
};
$(function () {
    specialTit.specialTit();
    specialTit.specialCour();
    specialTit.specialGp();
    specialTit.specialBu();
});

