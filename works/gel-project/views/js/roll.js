function getElement(id) {
    return document.getElementById(id);
}
var speed = 30;
function roll(obj, obj1, obj2) {
    if (document.getElementById(obj)) {
        var demo = getElement(obj);
        var demo2 = getElement(obj2);
        var demo1 = getElement(obj1);
        demo2.innerHTML = demo1.innerHTML;
        function Marqueetop() {
            if (demo2.offsetTop - demo.scrollTop <= 0){
                demo.scrollTop -= demo1.offsetHeight;
            }else{
                demo.scrollTop++;
            }  
        }
        var MyMar = setInterval(Marqueetop, speed)
        Direction = 'Left';
        demo.onmouseover = function () { clearInterval(MyMar) }
        demo.onmouseout = function () { MyMar = setInterval(Marqueetop, speed) }
    }
}

$(function () {
    roll('scroll1', 'scroll_1', 'scroll_2');
});