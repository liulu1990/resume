/**
 * @Author: Jzy
 * @Date: 2017/12/12
 * @Last Modified by:   jzy
 * @Last Modified time: 2018-02-21 17:52:11
 */
function getRandom(a, b){
    return Math.floor(Math.random() * (b - a + 1)) + a
}

// 函数防抖
function debounce(fn, delay){
    return function(...args){
        fn.timer && clearTimeout(fn.timer)
        fn.timer = setTimeout(() => fn.apply(this, args), delay)
    }
}

// 函数节流
function throttle(fn, delay){
    return function (...args){
        let _nowTime = + new Date()
        if (!fn._lastTime || _nowTime - fn._lastTime > delay){
            fn.apply(this, args)
            fn._lastTime = _nowTime
        }
    }
}

function getSearchParams(){
    let search  = window.location.search,
        dataObj = {}
    if (search.indexOf('?') != -1){
        let str  = decodeURIComponent(search.substr(1)),
            strs = str.split('&')
        for (let i = 0; i < strs.length; i++){
            dataObj[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
        }
    }
    return dataObj
}

export { getRandom, debounce, throttle, getSearchParams }
