<template>
    <div class="contact">
        <div class="list">
            <van-cell-group>
                <van-cell v-for="item in list" :key="item.id"
                     :title="`${item.name} - ${item.phone}`" 
                     :label="item.address" 
                     :to="`/edit_addr/${item.id}`"
                     is-link>
                     <van-tag type="danger" v-if="item.isDefault == '1'">默认</van-tag>
                </van-cell>
            </van-cell-group>
        </div>
        <div class="add-box">
            <van-button class="add-btn" type="primary" @click.stop="clickHandler">添加联系信息</van-button>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Button, Tag } from 'vant'
import { getAddrList } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'contact',
    data(){
        return {
            list: []
        }
    },
    computed: {
        ...mapState('app', ['userInfo'])
    },
    methods: {
        async getAddrList(){
            const res = await getAddrList({ userId: this.userInfo.userId })
            if (res.code == 1){
                this.list = res.list || []
            }
        },
        clickHandler(){
            this.$router.push('/add_addr')
        }
    },
    created(){
        this.getAddrList()
    },
    components: {
        VanCellGroup: CellGroup,
        VanCell: Cell,
        VanButton: Button,
        VanTag: Tag
    }
}
</script>

<style>
.contact {
    min-height: 100vh;
    background: #f8f8f8;
}
.contact .add-box {
    margin: .3rem;
}
.contact .add-btn {
    width: 100%;
}
</style>
