<template>
    <div class="input-number" @click.stop>
        <transition name="move">
            <span class="minus icon-remove_circle_outline" v-show="isShow" 
                @click.stop="minusHandler"></span>
        </transition>
        <div class="input" v-show="isShow">
            <input type="tel" :value="value" @input.prevent="inputHandler">
        </div>
        <span class="plus icon-add_circle" @click.stop="plusHandler"></span>
    </div>
</template>

<script>
export default {
    name: 'input-number',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {}
    },
    computed: {
        isShow(){
            return this.value > 0
        }
    },
    methods: {
        inputHandler(){
            if (event.target.value == '') return
            let val = Number(event.target.value)
            val = Number.isNaN(val) ? this.value : val
            if (val < 0) val = 0
            this.emitFunc(val)
        },
        minusHandler(){
            let val = this.value
            val = val <= 0 ? 0 : --val
            this.emitFunc(val)
        },
        plusHandler(){
            let val = this.value
            this.emitFunc(++val)
        },
        emitFunc(val){
            this.$emit('input', val)
            this.$emit('change', val)
        }
    }
}
</script>

<style scoped>
.input-number {
    display: inline-block;
    height: .48rem;
    font-size: 0;
    overflow: hidden;
}
.input-number > span {
    display: inline-block;
    height: inherit;
    line-height: .48rem;
    font-size: .48rem;
    color: rgb(35, 149, 255);
}
.input-number > .input {
    display: inline-block;
    width: .65rem;
    height: inherit;
    vertical-align: top;
}
.input-number > .input input {
    width: 100%;
    height: .48rem;
    line-height: .48rem;
    border: none;
    text-align: center;
    font-family: Arial;
    font-size: 12px;
}
.move-enter-active,
.move-leave-active {
    transition: all .3s ease;
}

.move-enter, .move-leave-to {
    opacity: 0;
    transform: translate3d(.6rem, 0, 0) rotate(180deg);
}
</style>