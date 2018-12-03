function isMatching(str, subStr) {
    return str.toLowerCase().indexOf(subStr.toLowerCase()) >= 0;
}

function isAnyOfArrayMatching(arr, str) {
    for (let item of arr) {
        if (isMatching(item, str)) {
            return true;
        }
    }

    return false;
}

export {
    isMatching,
    isAnyOfArrayMatching
}