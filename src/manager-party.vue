<template>
    <div class="warpper">
        <el-anchor class="anchor" :offset="0" direction="horizontal" :container="scroller">
            <el-anchor-link v-for="(value, key) in party" :href="`#${key}`">{{ key }}</el-anchor-link>
        </el-anchor>
        <div class="scroller" ref="scroller">
            <div v-for="(list, key) in party" :id="key">
                <p class="title">{{ key }}</p>
                <div class="id" v-for="item in list">
                    <div><el-tag v-if="item.code" class="tag" size="small">{{ item.code }}</el-tag>{{ item.id }}</div>
                    <el-button v-if="key === '陌生ID'" type="primary" size="small" @click="add(item)">加入</el-button>
                    <el-button v-if="key === '未入队'" type="danger" size="small" @click="del(item)">删除</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ref } from 'vue'
const scroller = ref(null)
const props = defineProps({
    idMap: {
        type: Object,
        default: () => ({})
    },
    realMap: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['add', 'del'])

const party = computed(() => {
    const result = {
        '陌生ID': [],
        '未入队': [],
        '已入队': [],
    }

    Object.values(props.realMap).forEach(value => {
        const {id, code} = value
        if(!code && !props.idMap[id]) return result['陌生ID'].push({ id, code: '' })

        if(value.status === '组队中'){
            result['已入队'].push({ id, code: props.idMap[id].code })
        }else{
            result['未入队'].push({ id, code: props.idMap[id].code })
        }
    })

    Object.values(props.idMap).forEach(value => {
        const {id, code} = value
        if(props.realMap[id] && props.realMap[id].status === '组队中') return
        if(result['未入队'].find(item => item.id === id)) return
        result['未入队'].push({ id, code })
    })

    return result
})
window.fallGuys['party'] = party

function add(item){
    if(!item) return
    if(!item.code){
        const temporaryList = Object.values(props.idMap).filter(value => value.code[0] === 'T')
        if(temporaryList.length){
            const maxCode = Math.max(...temporaryList.map(value => parseInt(value.code.slice(1))))
            item.code = `T${maxCode + 1}`
        }else{
            item.code = 'T1'
        }
    }
    emit('add', item)
}

function del(item){
    emit('del', item)
}
</script>

<style lang="stylus" scoped>
.warpper
    height 100%
    display flex
    flex-direction column
.anchor
    flex 0 0 auto
    height 30px
    font-size 14px
    background-color transparent
.scroller
    flex 1
    overflow auto
.title
    font-size 14px
    font-weight bold
    margin 0
    padding 8px 0
.id
    display flex
    align-items center
    justify-content space-between
    margin-bottom 6px
    &:hover{
        background-color #f5f5f5
    }
.tag
    margin-right 4px
    padding 0 4px
</style>