<template>
    <div>
        <div class="btns">
            <el-button size="small" @click="reset">重置</el-button>
            <el-button size="small" @click="importClipboard">剪贴板导入</el-button>
        </div>
        <div class="dashboard">
            <p>已存储ID总数：{{ list.length }}。<br />可在 组队信息-已入队/未入队 中查看详情。</p>
            <p>
                请从腾讯文档框选复制本次发车的ID、编号，然后点击“剪贴板导入”，Ctrl+V粘贴到输入框，即可将ID导入到列表中。
            </p>
            <p>注意：</p>
            <p>1. 复制内容不要包含非本次发车的ID、编号。</p>
            <p>2. 不要使用重复的编号，例如一队A1、二队A1</p>
            <p>3. ID填写与实际玩家ID不符合时，可以在 组队信息-陌生ID 中点击“加入”</p>
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
    window.addEventListener('message', e => {
        emit('setList', e.data)
    })

    const page = window.open(
        'about:blank',
        '请在输入框粘贴从腾讯文档复制的内容',
        `width=320,height=120,left=800,top=400,popup=yes,location=no,dialog=yes`
    )
    page.location.href = location.href + '?paste'
}
</script>

<style lang="stylus" scoped>
.el-button+.el-button{
    margin-left: 4px;
}
.dashboard{
    font-size 12px;
}
</style>
