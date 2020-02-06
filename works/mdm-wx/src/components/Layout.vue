<template>
    <div class="main">
        <transition :name="`layout-${direction}`">
            <router-view :key="routerKey"></router-view>
        </transition>
        <app-footer></app-footer>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AppFooter from './Footer'

export default {
    name: 'app',
    data (){
        return {}
    },
    computed: {
        ...mapState('app', ['direction', 'routerKey'])
    },
    components: {
        AppFooter
    }
}
</script>

<style>
/**
 * 路由转场动画
 */
.layout-back-enter-active,
.layout-back-leave-active,
.layout-forward-enter-active,
.layout-forward-leave-active {
    will-change: transform;
    transition: all 300ms ease;
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
}

.layout-back-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
.layout-back-leave-to {
    opacity: .6;
    transform: translate3d(-10px, 0, 0);
}
.layout-forward-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.layout-forward-leave-to {
    opacity: .6;
    transform: translate3d(10px, 0, 0);
}
</style>