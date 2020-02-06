const host = 'http://rap2api.taobao.org/app/mock/239042/'

const url = {
  getCode: '/user/getCode',
  userInfo: '/user/logout', 
  logout: '/user/userInfo',
  navList: '/home/navList',
  homePage: '/home/homePage',
  category: '/home/category',
  commodity: '/home/commodityList',
  forRecommend: '/home/forRecommend',
  productView: '/product/productView',
  recommend: '/product/recommend',
  cartIndex: '/cart/index',
  cartSelect: '/cart/selcart',
  cartEdit: '/cart/edit',
  cartAdd: '/cart/add',
  cartDelete: '/cart/del',
  cartSelService: '/cart/selService',
  addressList: '/address/list',
  addressAdd: '/address/add',
  addressSave: '/address/save',
  addressView: '/address/view',
  addressDel: '/address/del',
  addressAll: '/address/all',
  addressRegion: '/address/region'
}

Object.keys(url).forEach(key => {
  url[key] = host + url[key]
})

export default url
