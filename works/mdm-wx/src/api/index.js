import axios from 'api/fetch'

// 获取分类和商品
export const getGoodsInfo = params => axios.get('/wm/mobile/mall/showGoodsList2', { params })

// 获取公告
export const getNoticeList = () => axios.get('/wm/mobile/mall/queryMessage')

// 获取收获信息
export const getAddrList = params => axios.get('/wm/mobile/my/showHarvestAddress', { params })

//保存收获信息
export const saveAddrInfo = params => axios.post('/wm/mobile/my/addHarvestAddress', params)

// 获取收获地址信息
export const getAddrOne = params => axios.get('/wm/mobile/my/showHarvestAddressById', { params })

// 修改收获地址
export const modAddrInfo = params => axios.post('/wm/mobile/my/modifyHarvestInformation', params)

// 删除收获地址
export const delAddrRecord = params => axios.get('/wm/mobile/my/deleteHarvestAddress', { params })

// 获取确认订单信息
export const getConfirmInfo = params => axios.get('/wm/mobile/order/querySubmitOrder', { params })

// 提交订单信息
export const saveOrderRecord = params => axios.post('/pay/index', params)

// 获取商品详情
export const getGoodDetail = params => axios.get('/wm/mobile/mall/getProductDetail', { params })

// 获取用户信息
export const getWxUserInfo = params => axios.get('/wm/mobile/my/queryInfo2', { params })

// 订单查询
export const searchOrder = params => axios.post('/wm/mobile/order/queryOrder', params)

//提交订单
export const detailOrder = params => axios.post('/wm/mobile/order/queryOrderById', params)






