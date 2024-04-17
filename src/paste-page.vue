<template>
    <el-input class="input" placeholder="请在输入框粘贴从腾讯文档复制的内容" @paste="handlePaste"></el-input>
</template>
<script setup>
document.title = '请粘贴复制的内容'
function handlePaste(e) {
    e.preventDefault()
    const html = e.clipboardData.getData('text/html')
    
    // 正则表达式匹配 [A-Z]\d+ 和其后紧跟的 <td>...</td>
    let regex = /<td[^>]*>\s*([A-Z]\d+)\s*<\/td>\s*<td[^>]*>\s*(.*?)\s*<\/td>/g;

    let matches;
    let domParser = new DOMParser()
    let result = []
    let codeCache = [] // 防止重复添加
    while ((matches = regex.exec(html)) !== null) {
        const code = matches[1]
        if(codeCache.includes(code)) continue;
        codeCache.push(code)
        let customStr = matches[2]
        if(customStr[0] === '<') customStr = domParser.parseFromString(customStr, 'text/html').body.textContent;
        if(customStr) {
            const match =customStr.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+/)
            if(match) customStr = match[0]
            result.push({ code, id: customStr })
        }
    }

    window.opener.postMessage(result.sort(customSort), '*')
    window.close()
}
    
function customSort(a, b) {
    const codeA = a.code
    const codeB = b.code
    if (codeA[0] < codeB[0]) {
        return -1
    }else if (codeA[0] > codeB[0]) {
        return 1
    }else {
        return parseInt(codeA.slice(1)) - parseInt(codeB.slice(1))
    }
}
</script>
<style scoped>
.input {
    margin: 10px;
    width: 280px;
}
</style>