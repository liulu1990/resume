import Mock from 'mockjs'

let login = Mock.mock({
  'status': 200,
  'message': '短信验证码不正确',
  'data': {}
})

let getCode = Mock.mock({
  'status': 200,
  'message': '已发送信息',
  'data': {}
})

let logout = Mock.mock({
  "status": 200,
  "message": "退出成功",
  "data": {}
})

let userInfo = Mock.mock({
  "code": 0,
  "result": "ok",
  "description": "success",
  "data": {
    "send_order": 1,
    "unpaid_order": 2,
    "user": {
      "icon": "//s1.mi-img.com/mfsv2/download/fdsc3/p01EqaJOqAcW/Iyi86dNydBoYWa.jpg",
      "email": "",
      "mobile": "155****0426",
      "userName": "lu",
      "user_id": 1313124239
    }
  }
})

export {
  login,
  getCode
}
