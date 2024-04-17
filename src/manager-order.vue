<template>
    <div class="warpper">
        <div v-if="!list || list.length === 0" class="empty"><el-empty description="没有数据" :image-size="100"/></div>
        <div class="person" v-for="item in list" :id="item.id">
            <div class="name"><el-tag v-if="item.code" class="tag" size="small">{{ item.code }}</el-tag>{{ item.id }}</div>
            <el-segmented v-model="item.status" size="small" class="segmented" :class="[clasMap[item.status]]" :options="options"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const clasMap = {
    '空闲': 'green',
    '组队中': 'orange',
    '游戏中': 'red'
}
const options = Object.keys(clasMap)
</script>

<style lang="stylus" scoped>
.warpper
    height 100%
    display flex
    flex-direction column
.person
    display flex
    justify-content space-between
    align-items center
.name
    flex 1
    display flex
    align-items center
    font-size 14px
    line-height 24px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
.tag
    margin-right 2px
    vertical-align middle
    padding 0 4px
.segmented
    flex 0 0 auto
.green
    &::v-deep(.el-segmented__item-selected)
        color #fff
        background-color lightgreen
.orange
    &::v-deep(.el-segmented__item-selected)
        color #fff
        background-color #ffa500
.red
    &::v-deep(.el-segmented__item-selected)
        color #fff
        background-color #ff0000
</style>