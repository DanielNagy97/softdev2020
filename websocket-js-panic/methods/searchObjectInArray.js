//Search specified object in array of objects

module.exports = function searchObjectInArray(value, key, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][key] === value) {
            return myArray[i];
        }
    }
    return null;
}
