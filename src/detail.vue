<template>
    <div>
        <ul class="list">
            <li class="item" v-for="item in data.records">
                <div class="time">[{{ formatTime(item.time) }}]</div>
                <div class="message">{{ item.message }}</div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
defineProps(['data'])

function formatTime(time) {
    return dayjs(time).format('HH:mm:ss')
}
</script>

<style lang="stylus" scoped>
.list
  list-style none
  padding 0
  margin 0
  display flex
  flex-direction column-reverse

.item
  margin 0
  display flex
  align-items center
.time
  margin-right 10px
  color #999
</style>