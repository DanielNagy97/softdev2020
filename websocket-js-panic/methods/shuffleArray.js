
//Randomize array in-place using Durstenfeld shuffle algorithm
module.exports = function shuffleArray(array, seed) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(random(seed) * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
//NOTE: seed can not be zero or any multiple of Math.PI
//This generator function can be replaced if needed
function random(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
