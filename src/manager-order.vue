<template>
    <div class="warpper">
        <div v-if="!listAll || listAll.length === 0" class="empty">
            <el-empty description="没有数据" :image-size="100" />
        </div>
        <template v-else>
            <div class="controller">
                <div class="rankBy">
                    <div class="txt">排序</div>
                    <el-select class="selector" v-model="rankBy" placeholder="排序" size="small">
                        <el-option label="编号" value="code"></el-option>
                        <el-option label="进队" value="enter"></el-option>
                    </el-select>
                </div>
                <div class="filter">
                    筛选：<el-segmented
                        v-model="activeFilter"
                        :options="filterOptions"
                        size="small"
                    />
                </div>
            </div>
            <div class="list">
                <div class="person" v-for="(item, index) in filteredList" :id="item.id">
                    <div class="name">
                        <div class="index">{{ index + 1 }}.</div>
                        <el-tag v-if="item && item.code" class="tag" size="small">{{
                            item.code
                        }}</el-tag>
                        <span class="id" :class="{'grey': !item.status}">{{ item.id }}</span>
                        <div class="toolbar">
                            <el-button class="item" type="text" :disabled="!item.status" @click.stop="gotoDetail(item)"><el-icon><Timer /></el-icon></el-button>
                            <div class="item" @click.stop="copy(item.id)"><el-icon><DocumentCopy /></el-icon>ID</div>
                            <div class="item" @click.stop="copy(`${item.code} ${item.id}`)"><el-icon><DocumentCopy /></el-icon>编号ID</div>
                            <div class="item" @click.stop="say(item)">TTS</div>
                        </div>
                    </div>
                    <el-segmented
                        v-if="item.status"
                        v-model="item.status"
                        size="small"
                        class="segmented"
                        :class="[clasMap[item.status]]"
                        :options="options"
                    />
                </div>
                <div class="clear-ct">
                    <el-button type="danger" size="small" @click.stop="emit('clear')">清空队伍</el-button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Timer, DocumentCopy } from '@element-plus/icons-vue'
import { sortByCode } from './common'
import { cactbotSay } from './overlay';

const emit = defineEmits(['clear', 'gotoDetail'])

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    listAll: {
        type: Array,
        default: () => []
    },
})

const clasMap = {
    空闲: 'green',
    组队中: 'orange',
    游戏中: 'red'
}
const options = Object.keys(clasMap)

const filterOptions = ref(['全部', '空闲', '游戏中'])
const activeFilter = ref('全部')
const rankBy = ref('code')

const filteredList = computed(() => {
    const filter = activeFilter.value
    let res = []
    let list = rankBy.value === 'code'? props.listAll : props.list

    if (filter === '全部') {
        res = list
    } else if (filter === '游戏中') {
        res = list.filter(item => item.status === filter)
    } else {
        res = list.filter(item => item.status === filter || !item.status)
    }

    if (rankBy.value === 'code') {
        return res.slice(0).sort(sortByCode)
    }
    return res
})

function say(item) {
    if(item.status === '组队中'){
        cactbotSay(`下一位：${item.id}`)
    }else{
        cactbotSay(`由请${item.id}进队`)
    }
}

function copy(text) {
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
}

function gotoDetail(id) {
    emit('gotoDetail', id)
}
</script>

<style lang="stylus" scoped>
.warpper
    height 100%
    display flex
    flex-direction column
.controller
    flex 0 0 auto
    display flex
    justify-content space-between
    align-items center
    margin-bottom 8px
.filter
    display flex
.list
    flex 1
    display flex
    flex-direction column
    overflow auto
.person
    position relative
    display flex
    justify-content space-between
    align-items center
    &:hover
        .toolbar
            display flex
.toolbar
    display none
    position absolute
    left 0
    top 0
    bottom 0
    padding 0 6px
    background-color #fff
    align-items center
    .item
        margin-right 5px
        padding 0 5px
        display flex
        align-items center
        cursor pointer
        height 100%
        &:last-of-type
            margin-right 0
        &:hover
            background-color #f5f5f5
        &:active
            color #fff
            background-color #409eff
.index
    flex 0 0 auto
    min-width 24px
.name
    flex 1
    display flex
    align-items center
    font-size 14px
    line-height 24px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    .grey
        color #aaa
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
.clear-ct
    display flex
    margin-top 10px
</style>
