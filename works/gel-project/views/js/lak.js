var rootPath = "http://127.0.0.1:50523/views/";
function layeraw() {
    layer.open({
        type: 2
        , title: ''
        , shadeClose: true
        , shade: 0.8
        , area: ['1000px','396px']
        , content: rootPath+'mod/register/answer.html' //iframe的url
    });
}

function layerrg() {
    layer.open({
        type: 2
        , title: ''
        , shadeClose: true
        , shade: 0.8
        , area: ['618px', '712px']
        , content: rootPath+'mod/register/register.html' //iframe的url
    });
}

function layerpd() {
    layer.open({
        type: 2
        , title: ''
        , shadeClose: true
        , shade: 0.8
        , area: ['600px', '323px']
        , content: rootPath+'mod/register/passwd.html' //iframe的url
    });
}

function layertw() {
    layer.open({
        type: 2
        , title: ''
        , shadeClose: true
        , shade: 0.8
        , area: ['600px', '749px']
        , content: rootPath+'mod/register/infor.html' //iframe的url
    });
}
function layerfl() {
    layer.open({
        type: 2
        , title: ''
        , shadeClose: true
        , shade: 0.8
        , area: ['600px', '557px']
        , content: rootPath+'mod/faculty/pop.html' //iframe的url
    });
}
function layerfk() {
    layer.open({
        type: 2
        , title: '查看试卷弹出页'
        , shadeClose: true
        , shade: 0.8
        , area: ['1000px', '590px']
        , content: rootPath+'mod/personal/mod_cksj.html' //iframe的url
    });
}

function layerfx() {
    layer.open({
        type: 2
        , title: '消息详情弹出页'
        , shadeClose: true
        , shade: 0.8
        , area: ['460px', '410px']
        , content: rootPath+'mod/personal/mod_direc.html' //iframe的url
    });
}

function layerff() {
    layer.open({
        type: 2
        , title: '学习履历弹出页'
        , shadeClose: true
        , shade: 0.8
        , area: ['1000px', '510px']
        , content: rootPath+'mod/personal/mod_studyll.html' //iframe的url
    });
}

function layergk() {
    layer.open({
        type: 2
        , title: '考试履历弹出页'
        , shadeClose: true
        , shade: 0.8
        , area: ['1000px', '510px']
        , content: rootPath+'mod/personal/mod_exam.html' //iframe的url
    });
}