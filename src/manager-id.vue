<template>
    <div>
        <div class="btns">
            <el-button size="small" @click="reset">重置</el-button>
            <el-button size="small" @click="importClipboard">剪贴板导入</el-button>
        </div>
        <div class="dashboard">
            <p>已存储ID总数：{{ list.length }}</p>
            <p>可在 组队信息-已入队/未入队 中查看</p>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['setList'])

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const reset = () => emit('setList', [])
const importClipboard = () => {
    window.addEventListener('message', (e) => {
        emit('setList', e.data)
    })

    const page = window.open('about:blank', '请在输入框粘贴从腾讯文档复制的内容', `width=320,height=120,left=800,top=400,popup=yes,location=no,dialog=yes`)
    page.location.href = location.href + '?paste'
}
</script>

<style lang="stylus" scoped>
.el-button+.el-button{
    margin-left: 4px;
}
</style>