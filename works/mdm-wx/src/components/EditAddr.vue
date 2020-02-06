<template>
    <div class="edit-addr">
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
        <div class="btn-box">
            <van-button class="btn" type="primary"
                :loading="btnLoading"
                @click.stop="modHandler">保 存</van-button>
        </div>
        <div class="btn-box">
            <van-button class="btn" type="danger"
                :loading="btnLoading"
                @click.stop="delHandler">删 除</van-button>
        </div>
        <van-popup class="addr-panel" v-model="isShowPanel" position="bottom">
            <van-area :area-list="areaList" :value="areaCode" title="选择省 / 市 / 区" 
                @cancel="clickHandler"
                @confirm="confirmHandler"/>
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, SwitchCell, Popup, Area, Dialog, Toast } from 'vant'
import area from 'assets/js/area'
import { mapState } from 'vuex'
import { getAddrOne, modAddrInfo, delAddrRecord } from 'api'

export default {
    name: 'edit-addr',
    data() {
        return {
            form: {
                id: this.$route.params.id,
                name: '',
                phone: '',
                addr: '',
                address: '',
                isDefault: false
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
        async getAddrRecord(){
            const res = await getAddrOne({ userId: this.userInfo.userId, id: this.form.id })
            if (res.code == 1){
                this.form = res.data
            }
        },
        async modHandler(){
            if (this.form.name == '' || this.form.phone == '' || this.form.address == ''){
                for (let attr in this.rules){
                    this.rules[attr] = this.form[attr] == ''
                }
                return
            }
            const res = await modAddrInfo({
                userId: this.userInfo.userId,
                ...this.form
            })
            if (res.code == 1){
                this.$router.go(-1)
            } else {
                Toast.fail(res.message)
            }
        },
        delHandler(){
            Dialog.confirm({
                title: '提示',
                message: '确认删除吗？'
            }).then(async () => {
                const res = await delAddrRecord({ userId: this.userInfo.userId, id: this.form.id })
                if (res.code == 1){
                    Toast.success('删除成功')
                    setTimeout(() => this.$router.go(-1), 500)
                } else {
                    Toast.fail(res.message)
                }
            }).catch(() => {})
        }
    },
    created(){
        this.getAddrRecord()
    },
    components: {
        VanCellGroup: CellGroup,
        VanCell: Cell,
        VanButton: Button,
        VanField: Field,
        VanSwitchCell: SwitchCell,
        VanPopup: Popup,
        VanArea: Area,
        VanDialog: Dialog
    }
}
</script>

<style>
.edit-addr {
    min-height: 100vh;
    background: #f8f8f8;
    overflow-x: hidden;
}
.edit-addr .addr-panel {
    width: 100%;
    height: 50vh;
}
.edit-addr .btn-box {
    margin: .3rem .3rem 0;
}
.edit-addr .btn-box .btn {
    width: 100%;
}
</style>