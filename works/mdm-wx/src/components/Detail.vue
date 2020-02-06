<template>
    <div>
        <p>详情页面 - {{ $route.params.id }} - <router-link to="/home">首页</router-link></p>
        <app-scroll ref="scroll" class="box"
            :data="list"
            :pullDownRefresh="true"
            @pulldown="getData(0)"
            :pullUpLoad="true"
            @pullup="getData(++pageIndex)">
            <ul>
                <li v-for="(item, key) in list" :key="item" @click.stop="clickHandler">{{ (key + 1) + ' - ' + item }}</li>
            </ul>
        </app-scroll>
    </div>
</template>

<script>
import AppScroll from './Scroll'
export default {
    name: 'detail',
    data (){
        return {
            list: [],
            pageIndex: 0
        }
    },
    created(){
        this.getData(this.pageIndex)
    },
    methods: {
        getData(index){
            var tmp = []
            for (let i = 0; i < 20; i++){
                tmp.push(Math.random().toString().slice(2))
            }
            setTimeout(() => {
                if (!index){
                    this.list = tmp
                    this.pageIndex = 0
                } else {
                    if (index >= 2){
                        this.$refs.scroll.forceUpdate(false)
                    } else {
                        this.list = this.list.concat(tmp)
                    }
                }
            }, 1000)
        },
        clickHandler(){
            console.log(event.target.innerHTML)
            alert(event.target.innerHTML)
        }
    },
    destroyed(){
        // 释放内存空间，防止内存泄漏
    },
    components: {
        AppScroll
    }
}
</script>

<style scoped>
.box {
    width: 70%;
    height: 60vh;
    margin: 50px auto 0;
    background: #f0f0f0;
}
.box ul li {
    line-height: 40px;
    margin-bottom: 5px;
    padding-left: 10px;
    background: darkorange;
    color: #fff;
}
</style>