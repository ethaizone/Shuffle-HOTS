// https://github.com/coolaj86/knuth-shuffle
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
var shuffle = function (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

var swapArrayElements = function (arr, indexA, indexB) {
  var temp = arr[indexA]
  arr[indexA] = arr[indexB]
  arr[indexB] = temp
}

// http://stackoverflow.com/questions/11344531/pure-javascript-store-object-in-cookie
function bakeCookie (name, value) {
  var cookie = [name, '=', JSON.stringify(value), '; expires=Thu, 01-Jan-2299 00:00:01 GMT; domain=.', window.location.host.toString(), '; path=/;'].join('')
  document.cookie = cookie
}
function readCookie (name) {
  var result = document.cookie.match(new RegExp(name + '=([^;]+)'))
  result && (result = JSON.parse(result[1]))
  return result
}
function deleteCookie (name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('')
}

export {
  shuffle,
  bakeCookie,
  readCookie,
  deleteCookie,
  swapArrayElements
}
