<template>
    <div ref="wrapper" class="scroll-wrapper">
        <div class="scroll-box">
            <div ref="content">
                <slot :list="data"></slot>
            </div>
            <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
                <div class="pullup-wrapper" v-if="pullUpLoad">
                    <div class="before-trigger" v-if="!isPullUpLoad">
                        <span>{{pullUpTxt}}</span>
                    </div>
                    <div class="after-trigger" v-else>
                        <van-loading type="spinner" size="20px" />
                    </div>
                </div>
            </slot>
        </div>
        <slot name="pulldown"
            :pullDownRefresh="pullDownRefresh"
            :pullDownStyle="pullDownStyle"
            :beforePullDown="beforePullDown"
            :isPullingDown="isPullingDown"
            :bubbleY="bubbleY">
            <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
                <div class="before-trigger" v-if="beforePullDown">
                    <bubble :y="bubbleY"></bubble>
                </div>
                <div class="after-trigger" v-else>
                    <div v-if="!isPullingDown">
                        <span>{{refreshTxt}}</span>
                    </div>
                    <div v-else>
                        <van-loading type="spinner" size="20px" />
                    </div>
                </div>
            </div>
        </slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import Bubble from './Bubble'
import { Loading } from 'vant'

const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
    name: 'app-scroll',
    props: {
        /**
         * 1 滚动的时候会派发scroll事件，会截流
         * 2 滚动的时候实时派发scroll事件，不会截流
         * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
         */
        probeType: {
            type: Number,
            default: 1
        },
        /**
         * 点击列表是否派发click事件和tap事件
         */
        click: {
            type: Boolean,
            default: true
        },
        /**
         * 滚动方向
         */
        direction: {
            type: String,
            default: DIRECTION_V
        },
        /**
         * 是否派发滚动事件
         */
        listenScroll: {
            type: Boolean,
            default: false
        },
        listenBeforeScroll: {
            type: Boolean,
            default: false
        },
        listenScrollEnd: {
            type: Boolean,
            default: false
        },
        /**
         * 列表的数据
         */
        data: {
            type: Array,
            default(){
                return []
            }
        },
        /**
         * 是否派发滚动到底部的事件，用于上拉加载
         */
        pullUpLoad: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发顶部下拉的事件，用于下拉刷新
         */
        pullDownRefresh: {
            type: Boolean,
            default: false
        },
        /**
         * 当数据更新后，刷新scroll的延时
         */
        refreshDelay: {
            type: Number,
            default: 20
        }
    },
    data(){
        return {
            beforePullDown: true,
            isRebounding: false,
            isPullingDown: false,
            isPullUpLoad: false,
            pullUpDirty: true,
            pullDownStyle: '',
            bubbleY: 0
        }
    },
    computed: {
        pullUpTxt() {
            const moreTxt = (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more) || '加载更多...'
            const noMoreTxt = (this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore) || '已到最后'
            return this.pullUpDirty ? moreTxt : noMoreTxt
        },
        refreshTxt() {
            return (this.pullDownRefresh && this.pullDownRefresh.txt) || '刷新成功'
        }
    },
    created() {
        this.pullDownInitTop = -40
    },
    mounted() {
        // 保证在DOM渲染完毕后初始化 better-scroll
        setTimeout(() => this.initScroll(), this.refreshDelay)
    },
    destroyed() {
        this.scroll && this.scroll.destroy()
    },
    methods: {
        initScroll() {
            if (!this.$refs.wrapper) return

            if (this.$refs.content && (this.pullDownRefresh || this.pullUpLoad)) {
                this.$refs.content.style.minHeight = `${this.$refs.wrapper.clientHeight + 1}px`
            }

            // better-scroll的初始化
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
                tap: this.click,
                scrollY: this.direction === DIRECTION_V,
                scrollX: this.direction === DIRECTION_H,
                pullDownRefresh: this.pullDownRefresh,
                pullUpLoad: this.pullUpLoad
            })
            
            // 是否派发滚动事件
            if (this.listenScroll) {
                this.scroll.on('scroll', pos => {
                    this.$emit('scroll', pos)
                })
            }
            if (this.listenScrollEnd) {
                this.scroll.on('scrollEnd', pos => {
                    this.$emit('scroll-end', pos)
                })
            }
            if (this.listenBeforeScroll) {
                this.scroll.on('scrollStart', pos => {
                    this.$emit('scroll-start', pos)
                })
            }
            if (this.pullDownRefresh) {
                this._initPullDownRefresh()
            }
            if (this.pullUpLoad) {
                this._initPullUpLoad()
            }
        },
        disable() {
            // 代理better-scroll的disable方法
            this.scroll && this.scroll.disable()
        },
        enable() {
            // 代理better-scroll的enable方法
            this.scroll && this.scroll.enable()
        },
        refresh() {
            // 代理better-scroll的refresh方法
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            // 代理better-scroll的scrollTo方法
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            // 代理better-scroll的scrollToElement方法
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        forceUpdate(dirty) {
            if (this.pullDownRefresh && this.isPullingDown) {
                this.isPullingDown = false
                this._reboundPullDown().then( () => this._afterPullDown() )
            } else if (this.pullUpLoad && this.isPullUpLoad) {
                this.isPullUpLoad = false
                this.scroll.finishPullUp()
                this.pullUpDirty = dirty
                this.refresh()
            } else {
                this.refresh()
            }
        },
        _initPullUpLoad() {
            // this.scroll.on('pullingUp', () => {
            //     this.$emit('pullup')
            //     this.scroll.finishPullUp()
            // })
            this.scroll.on('pullingUp', () => {
                this.isPullUpLoad = true
                this.$emit('pullup')
            })
        },
        _initPullDownRefresh() {
            // this.scroll.on('pullingDown', () => {
            //     this.$emit('pulldown')
            //     this.scroll.finishPullDown()
            // })
            this.scroll.on('pullingDown', () => {
                this.beforePullDown = false
                this.isPullingDown = true
                this.$emit('pulldown')
            })
            this.scroll.on('scroll', pos => {
                if (!this.pullDownRefresh) return
                if (this.beforePullDown) {
                    this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
                    this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
                } else {
                    this.bubbleY = 0
                }
                if (this.isRebounding) {
                    this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
                }
            })
        },
        _reboundPullDown() {
            const { stopTime = 600 } = this.pullDownRefresh
            return new Promise(resolve => {
                setTimeout(() => {
                    this.isRebounding = true
                    this.scroll.finishPullDown()
                    resolve()
                }, stopTime)
            })
        },
        _afterPullDown() {
            setTimeout(() => {
                this.pullDownStyle = `top:${this.pullDownInitTop}px`
                this.beforePullDown = true
                this.isRebounding = false
                this.refresh()
            }, this.scroll.options.bounceTime)
        }
    },
    watch: {
        data: {
            handler(){
                setTimeout(() => this.forceUpdate(true), this.refreshDelay)
            },
            deep: true
        }
    },
    components: {
        Bubble,
        VanLoading: Loading
    }
}
</script>

<style>
.scroll-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.scroll-wrapper > .scroll-box {
    position: relative;
    z-index: 1;
}
.pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
}
.pulldown-wrapper .after-trigger {
    color: #999;
}
.pullup-wrapper {
    width: 100%;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.pullup-wrapper .before-trigger {
    color: #999;
}
</style>