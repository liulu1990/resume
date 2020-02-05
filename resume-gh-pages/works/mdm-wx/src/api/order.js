import fetch from '@/api/fetch.js'

class Order {
  static list (data) {
    return fetch('orders', data)
  }
  static view (data) {
    return fetch('orderView', data)
  }
}

export default Order