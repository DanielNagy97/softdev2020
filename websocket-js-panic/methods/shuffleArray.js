//TODO: Random number generator with seed! (for the card shuffle)
//In plain JS you can't do that...
//See: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
//Maybe these will work...
//Note: seed can not be zero or any multiple of Math.PI
function random(seed) {
    var x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
}
