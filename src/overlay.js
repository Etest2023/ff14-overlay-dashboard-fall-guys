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

        const lineType = line[0]
        const eventType = line[2]
        const message = line[4]
        console.log(data);

        if (eventType === '2239'){
            // 进出队
            const regxEnter = /加入了小队。$/
            const regxLeave = /离开了小队。$/
            const regxRemove = /被移出了小队。$/

            if (regxEnter.test(message)){
                enterHandler(message.replace(regxEnter, ''))
            } else if (regxLeave.test(message)){
                leaveHandler(message.replace(regxLeave, ''))
            } else if (regxRemove.test(message)){
                removeHandler(message.replace(regxRemove, ''))
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
