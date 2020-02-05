<template>
    <div id="app">
        <transition :name="`app-${direction}`">
            <router-view></router-view>
        </transition>
        <!-- <van-loading v-if="updateLoading" size="40px" class="router-loading"/> -->
    </div>
</template>

<script>
import 'assets/css/reset.css'
import 'assets/css/icon.css'
import 'assets/css/quill.core.css'
import 'assets/css/style.css'
import 'assets/css/app.css'

import { mapState, mapActions } from 'vuex'
import { Loading } from 'vant'

import { getSearchParams } from 'assets/js/util'

export default {
    name: 'app',
    components: {
        VanLoading: Loading
    },
    data(){
        return {}
    },
    created(){
        this.setUserInfo(getSearchParams())
    },
    methods: {
        ...mapActions('app', ['setUserInfo'])
    },
    computed: {
        ...mapState('app', ['direction', 'updateLoading'])
    }
}
</script>

<style>
.router-loading {
    position: fixed;
    left: 50%;
    margin-left: -20px;
    top: 40%;
    z-index: 9;
}

.app-fade-enter-active,
.app-fade-leave-active {
    will-change: transform;
    transition: all 300ms ease;
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
}

.app-fade-enter {
    opacity: 0;
}
.app-fade-leave-to {
    opacity: 0;
}
</style>