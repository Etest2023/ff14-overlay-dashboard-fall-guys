const { addOverlayListener, startOverlayEvents } = window

export function handleOverlayEvent({
    enterHandler,
    leaveHandler,
    removeHandler,
    clearHandler,
}) {
    addOverlayListener('LogLine', (data) => {
        const { line } = data
        if (!line) return
        const eventType = line[2]
        const message = line[4]

        if (eventType === '2239'){
            // 进出队
            const regxEnter = /加入了小队。$/
            const regxLeave = /离开了小队。$/
            const regxRemove = /被移出了小队。$/

            if (regxEnter.test(message)){
                enterHandler(removeServer(message.replace(regxEnter, '')))
            } else if (regxLeave.test(message)){
                leaveHandler(removeServer(message.replace(regxLeave, '')))
            } else if (regxRemove.test(message)){
                removeHandler(removeServer(message.replace(regxRemove, '')))
            }
        }

        if (eventType === '0039'){
            // 开关招募
            if(message === '解散了队员招募用的团队。'){
                clearHandler()
            }
        }
    })

    startOverlayEvents()
}

function removeServer(str){
    const serverList = ['宇宙和音', '幻影群岛', '拉诺西亚', '晨曦王座', '沃仙曦染', '神意之地', '红玉海', '萌芽池']
    serverList.forEach(server => {
        str = str.replace(new RegExp(server+'$', 'g'), '')
    })
    return str
}