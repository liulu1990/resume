<template>
  <div class="pagination">
    <button @click="changeBtn">首页</button>
    <button @click="changeBtn">上一页</button>
    <button v-if="jduge" class="pagebtn">......</button>
    <button v-for="btn in pagebtns" :key="btn" @click="changeBtn(btn)"
      :class="[{currentPage:btn==currentPage},'pagebtn']"
    >
      {{btn}}
    </button>
    <button @click="changeBtn">下一页</button>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Pagination',
  data () {
    return {
     pagebtns:[1,2,3,4,5,'......'],
     currentPage:1,
     jduge:false
    }
  },
  methods:{
    changeBtn(page){
      //点击上一页，下一页,首页
      if(typeof page != 'number'){
        switch(page.target.innerText){
          case '上一页':
            $('button.currentPage').prev().click();
            break;
          case '下一页':
            $('button.currentPage').next().click();
            break;
          case '首页':
            this.pagebtns = [1,2,3,4,5,'......'];
            this.changeBtn(1);
            break;
          default:
            break;
        }
        return;
      }
      this.currentPage=page;
      if(page>4){
        this.jduge = true;
      }else{
        this.jduge = false;
      }
      if(page==this.pagebtns[4]){
        this.pagebtns.shift();//移除第一个元素
        this.pagebtns.splice(4,0,this.pagebtns[3]+1);//添加最后一个
      }else if(page==this.pagebtns[0] && page!=1){
        //先在第一个位置加一个
        this.pagebtns.unshift(this.pagebtns[0]-1);
        //移除最后一个数字
        this.pagebtns.splice(5,1);
      }
      this.$emit('handle',this.currentPage)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .pagination {
    margin-top: 5px;
    margin-bottom: 20px;
    background-color: white;
    padding: 6px 20px;
    border-radius: 5px;
    /*box-shadow: 0px 2px 9px #888888;*/
    border: 1px solid #888888;
  }

  button {
    background-color: #fff;
    border: 1px solid #ddd;
    color: #778087;
    border-radius: 3px;
    outline: none;
    height: 21px;
    cursor: pointer;
    padding: 0 2px;
    width: 55px;
    height: 29px;
  }

  .pagebtn {
    position: relative;
    bottom: 1px;
    width: 40px;
    margin: 0 4px;
  }

  .currentPage {
    color: white;
    background-color: #1f1b1b;
  }
</style>
