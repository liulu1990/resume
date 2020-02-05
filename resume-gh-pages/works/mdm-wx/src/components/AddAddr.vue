<template>
    <div class="add-addr">
        <van-cell-group>
            <van-field
                v-model="form.name"
                required
                clearable
                label="用户名"
                :error="rules.name"
                placeholder="请输入用户名"/>
            <van-field
                v-model="form.phone"
                type="tel"
                required
                clearable
                label="联系电话"
                :error="rules.phone"
                placeholder="请输入电话号码"/>
            <van-field
                v-model="form.addr"
                readonly
                is-link
                label="联系地址"
                placeholder="选择省 / 市 / 区"
                @click.stop.prevent="clickHandler"/>
            <van-field
                v-model="form.address"
                type="textarea"
                clearable
                required
                label="详细地址"
                :error="rules.address"
                placeholder="详细地址"/>
            <van-switch-cell v-model="form.isDefault" title="设为默认收获地址"/>
        </van-cell-group>
        <div class="add-btn-box">
            <van-button class="add-btn" type="primary"
                :loading="btnLoading"
                @click.stop="saveHandler">保 存</van-button>
        </div>
        <van-popup class="addr-panel" v-model="isShowPanel" position="bottom">
            <van-area :area-list="areaList" :value="areaCode" title="选择省 / 市 / 区" 
                @cancel="clickHandler"
                @confirm="confirmHandler"/>
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, SwitchCell, Popup, Area, Toast } from 'vant'
import area from 'assets/js/area'
import { saveAddrInfo } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'add-addr',
    data() {
        return {
            form: {
                name: '',
                phone: '',
                addr: '',
                address: '',
                isDefault: true
            },
            rules: { name: false, phone: false, address: false },
            isShowPanel: false,
            areaList: area,
            areaCode: ''
        }
    },
    computed: {
        ...mapState('app', ['btnLoading', 'userInfo'])
    },
    methods: {
        clickHandler(){
            this.isShowPanel = !this.isShowPanel
        },
        confirmHandler(val){
            this.form.addr = val.map(item => item.name).join('/')
            this.clickHandler()
        },
        async saveHandler(){
            if (this.form.name == '' || this.form.phone == '' || this.form.address == ''){
                for (let attr in this.rules){
                    this.rules[attr] = this.form[attr] == ''
                }
                return
            }
            const res = await saveAddrInfo({
                userId: this.userInfo.userId,
                ...this.form
            })
            if (res.code == 1){
                this.$router.go(-1)
            } else {
                Toast.fail(res.message)
            }
        }
    },
    components: {
        VanCellGroup: CellGroup,
        VanCell: Cell,
        VanButton: Button,
        VanField: Field,
        VanSwitchCell: SwitchCell,
        VanPopup: Popup,
        VanArea: Area
    }
}
</script>

<style>
.add-addr {
    min-height: 100vh;
    background: #f8f8f8;
    overflow-x: hidden;
}
.add-addr .addr-panel {
    width: 100%;
    height: 50vh;
}
.add-addr .add-btn-box {
    margin: .3rem .3rem 0;
}
.add-addr .add-btn-box .add-btn {
    width: 100%;
}
</style>