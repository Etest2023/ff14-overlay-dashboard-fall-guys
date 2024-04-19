export function sortByCode(a, b) {
    const codeA = a.code
    const codeB = b.code
    console.log('sortByCode', codeA, codeB)
    if (!codeA && !codeB) return 0
    if (!codeA) return 1
    if (!codeB) return -1

    if (codeA[0] < codeB[0]) {
        return -1
    } else if (codeA[0] > codeB[0]) {
        return 1
    } else {
        return parseInt(codeA.slice(1)) - parseInt(codeB.slice(1))
    }
}
