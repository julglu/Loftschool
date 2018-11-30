function isMatching(str, subStr) {
    return str.toLowerCase().indexOf(subStr.toLowerCase()) >= 0;
}

export {
    isMatching
}