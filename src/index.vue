<template>
    <PastePage v-if="isPage" />
    <el-container v-else class="ct">
        <el-aside class="aside" width="40px">
            <el-menu :default-active="activeMenu" class="menu" collapse @select="onChangeMenu">
                <el-menu-item class="menu-item" index="0">
                    <el-icon><Setting /></el-icon>
                </el-menu-item>
                <el-menu-item class="menu-item" index="1">
                    <el-icon><Histogram /></el-icon>
                </el-menu-item>
                <el-menu-item class="menu-item" index="2">
                    <el-icon><Finished /></el-icon>
                </el-menu-item>
                <div
                    class="toggle"
                    :class="{ collapsed: !rightVisible }"
                    @click="rightVisible = !rightVisible"
                >
                    <el-icon class="icon"><DArrowLeft /></el-icon>
                </div>
            </el-menu>
        </el-aside>
        <el-container class="container" v-show="rightVisible">
            <el-header class="header">
                <el-row justify="space-between" align="middle">
                    <div class="title">{{ menuList[activeMenu] }}</div>
                    <div class="tips" v-if="activeMenu === '2'">
                        距上次解散移出人数：<span
                            class="count"
                            :class="{ 'text-danger': removeCount > 7 }"
                            >{{ removeCount }}</span
                        >
                    </div>
                </el-row>
            </el-header>
            <el-main class="main">
                <ManagerId v-show="activeMenu === '0'" :list="partyList" @setList="setPartyList" />
                <ManagerParty
                    v-show="activeMenu === '1'"
                    :idMap="partyMap"
                    :realMap="realtimeParty"
                    @add="addPartner"
                    @del="delPartner"
                />
                <ManagerOrder
                    v-show="activeMenu === '2'"
                    :list="realtimePartyList"
                    :listAll="realtimePartyListComposePartyList"
                    @clear="clearRealtimeParty"
                    @gotoDetail="gotoDetail"
                />
                <Detail :data="detailData"
                    v-show="activeMenu === '3'"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Setting, Histogram, Finished, DArrowLeft } from '@element-plus/icons-vue'

import { handleOverlayEvent } from './overlay'
import ManagerId from './manager-id.vue'
import ManagerParty from './manager-party.vue'
import ManagerOrder from './manager-order.vue'
import Detail from './detail.vue'
import PastePage from './paste-page.vue'

// 是否是粘贴页面
const isPage = location.search.includes('paste')

const menuList = ref(['名单管理', '组队信息', '跟车顺序', '历史记录'])
const activeMenu = ref('0')
const onChangeMenu = index => (activeMenu.value = index)

// 名单表（填表，表可能错）
const partyList = ref([])
const setPartyList = list => {
    partyList.value = list
    if (list && list.length) activeMenu.value = '2'
}
const partyMap = computed(() => {
    const map = {}
    partyList.value.forEach(item => {
        map[item.id] = item
    })
    return map
})

// 组队信息（实时，人可能多）
const realtimeParty = ref({})
const realtimePartyList = computed(() => Object.values(realtimeParty.value))
const realtimePartyListComposePartyList = computed(() => {
    const list = partyList.value.slice()
    Object.values(realtimeParty.value).forEach(item => {
        const foundIndex = partyList.value.findIndex(p => p.id === item.id)
        if (foundIndex > -1) list.splice(foundIndex, 1, item)
        else list.push(item)
    })
    return list
})
function clearRealtimeParty() {
    realtimeParty.value = {}
}

const removeCount = ref(0)
const rightVisible = ref(true)

function addPartner({ id, code }) {
    partyList.value.push({
        id,
        code
    })
}

function delPartner({ id }) {
    const index = partyList.value.findIndex(item => item.id === id)
    if (index !== -1) partyList.value.splice(index, 1)
}

const detailData = ref({})
function gotoDetail(item) {
    detailData.value = item
    activeMenu.value = '3'
}

handleOverlayEvent({
    enterHandler(id, message) {
        const item = realtimeParty.value[id]
        if (item) {
            item.status = '组队中'
            item.records.push({
                time: Date.now(),
                message
            })
        } else {
            const realtimePartner = {
                id,
                status: '组队中',
                records: [{ time: Date.now(), message }]
            }
            Object.defineProperty(realtimePartner, 'code', {
                get: () => {
                    const item = partyMap.value[id]
                    return item ? item.code : ''
                }
            })
            realtimeParty.value[id] = realtimePartner
        }
    },
    leaveHandler(id, message) {
        const item = realtimeParty.value[id]
        if (item) {
            item.status = '空闲'
            item.records.push({
                time: Date.now(),
                message
            })
        }
    },
    removeHandler(id, message) {
        removeCount.value++
        const item = realtimeParty.value[id]
        if (item) {
            item.status = '游戏中'
            item.records.push({
                time: Date.now(),
                message
            })
        }
    },
    clearHandler(message) {
        removeCount.value = 0
        Object.values(realtimeParty.value).forEach(item => {
            if (item.status === '组队中') {
                item.status = '空闲'
                item.records.push({ time: Date.now(), message })
            }
        })
    }
})
</script>

<style lang="stylus">
body
    margin 0
    padding 0
#app
    width 100vw
    height 100vh
    color #333
    text-shadow none
.ct,
.aside,
.menu
    height 100%
.menu
    width 100%
.menu-item
    width 100%
    display flex
    justify-content center
.container
    background-color rgba(255, 255, 255, 0.9)
.header
    padding 8px
    height 40px
    line-height 24px
.filter
    font-size 12px
    display flex
    align-items center
.main
    padding 0 10px
.title
    flex: 1
.tips
    display flex
    align-items center
    font-size 12px
    .count
        font-size 14px
.rankBy
    display flex
    align-items center
    width 88px
    .txt
        flex: 0 0 auto
        font-size 12px
        margin-right 4px
.text-danger
    color #f5222d
.toggle
    position absolute
    bottom 0
    left 0
    right 0
    height 56px
    display flex
    justify-content center
    align-items center
    cursor pointer
    .icon
        transition all 0.3s ease-in-out
.collapsed
    .icon
        transform rotate(180deg)
</style>
