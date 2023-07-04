// returns a random number between the two numbers provided
function randomRange(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

module.exports = {randomRange}