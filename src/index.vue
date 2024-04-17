<template>
    <PastePage v-if="isPage"/>
    <el-container v-else class="ct">
        <el-aside class="aside" width="40px">
            <el-menu
                default-active="0"
                class="menu"
                collapse
                @select="onChangeMenu"
            >
                <el-menu-item class="menu-item" index="0">
                    <el-icon><Setting /></el-icon>
                </el-menu-item>
                <el-menu-item class="menu-item" index="1">
                    <el-icon><Histogram /></el-icon>
                </el-menu-item>
                <el-menu-item class="menu-item" index="2">
                    <el-icon><Finished /></el-icon>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <el-row justify="space-between" align="middle">
                    {{ menuList[activeMenu] }}
                    <div class="filter" v-if="activeMenu === 2">筛选：<el-segmented v-model="activeFilter" :options="filterOptions" size="small"/></div>
                </el-row>
            </el-header>
            <el-main class="main">
                <ManagerId v-show="activeMenu === 0" :list="partyList" @setList="setPartyList"/>
                <ManagerParty v-show="activeMenu === 1" :idMap="partyMap" :realMap="realtimeParty" @add="addPartner" @del="delPartner"/>
                <ManagerOrder v-show="activeMenu === 2" :idMap="partyMap" :list="filteredPartyList"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Setting,
  Histogram,
  Finished,
} from '@element-plus/icons-vue'

import { handleOverlayEvent } from './overlay'
import ManagerId from './manager-id.vue';
import ManagerParty from './manager-party.vue';
import ManagerOrder from './manager-order.vue';
import PastePage from './paste-page.vue';

// 是否是粘贴页面
const isPage = location.search.includes('paste')

const menuList = ref(['名单管理', '组队信息', '跟车顺序'])
const activeMenu = ref(0)
const onChangeMenu = index => activeMenu.value = parseInt(index)
const activeFilter = ref('全部')
const filterOptions = ref(['全部', '空闲', '游戏中'])

// 名单表（填表，表可能错）
const partyList = ref([])
const setPartyList = list => partyList.value = list
const partyMap = computed(() => {
    const map = {}
    partyList.value.forEach(item => {
        map[item.id] = item
    })
    return map
})

// 组队信息（实时，人可能多）
const realtimeParty = ref({})
const filteredPartyList = computed(() => {
    const filter = activeFilter.value
    const list = Object.values(realtimeParty.value)
    if(filter === '全部'){
        return list
    }else{
        return list.filter(item => item.status === filter)
    }
})

window.fallGuys = {
    partyList,
    realtimeParty,
}

function addPartner({id, code}){
    partyList.value.push({
        id,
        code,
    })
}

function delPartner({id}){
    const index = partyList.value.findIndex(item => item.id === id)
    if(index !== -1) partyList.value.splice(index, 1)
}

handleOverlayEvent({
    enterHandler(id){
        const item = realtimeParty.value[id]
        if(item) item.status = '组队中'
        else realtimeParty.value[id] = { id, code: '', status: '组队中' }
    },
    leaveHandler(id){
        const item = realtimeParty.value[id]
        if(item) item.status = '空闲'
    },
    removeHandler(id){
        const item = realtimeParty.value[id]
        if(item) item.status = '游戏中'
    },
    clearHandler(){
        Object.values(realtimeParty.value).forEach(item => {
            if(item.status === '组队中'){
                item.status = '空闲'
            }
        })
    },
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
    background-color rgba(255, 255, 255, 0.9)
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
</style>