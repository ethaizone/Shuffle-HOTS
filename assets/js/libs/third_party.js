  /**
 * js-weighted-list.js
 *
 * version 0.2
 *
 * This file is licensed under the MIT License, please see MIT-LICENSE.txt for details.
 *
 * https://github.com/timgilbert/js-weighted-list is its home.
 */
var WeightedList=function(){function t(t){if(this.weights={},this.data={},this.length=0,this.hasData=!1,t="undefined"!=typeof t?t:[],!Array.isArray(t))throw new Error('Unknown object "'+t.toString()+'" passed to WeightedList constructor! (Expected array or nothing)');for(var e=0;e<t.length;e++)this.push(t[e])}function e(t,e,h){this.weight=t,this.value=e,this.total=h}function h(t){this.heap=[null];for(var h=0;h<t.length;h++){var i=t[h][1],r=t[h][0];this.heap.push(new e(i,r,i))}for(h=this.heap.length-1;h>1;h--)this.heap[h>>1].total+=this.heap[h].total}return t.prototype={push:function(t){var e,h,i;if(Array.isArray(t)){if(e=t[0],h=t[1],i=t[2],"undefined"==typeof e)throw new Error("In WeightedList.push([ ... ]), need at least two elements");if("undefined"==typeof h)throw new Error("In array passed to WeightedList.push([ ... ]), second element is undefined!")}else{if("object"!=typeof t)throw new Error('WeightedList.push() passed unknown type "'+typeof t+'", expected [key, weight] or {"key": k, "weight": w}');if(e=t.key,h=t.weight,i=t.data,"undefined"==typeof e)throw new Error("In WeightedList.push({ ... }), no {'key': 'xyzzy'} pair found");if("undefined"==typeof h)throw new Error("In array passed to WeightedList.push({ ... }), no {'weight': 42} pair found")}return this._push_values(e,h,i)},_push_values:function(t,e,h){if(this.weights[t])throw new Error("");if("number"!=typeof e)throw new Error("Weight must be numeric (got "+e.toString()+")");if(0>=e)throw new Error("Weight must be >= 0 (got "+e+")");this.weights[t]=e,"undefined"!=typeof h&&(this.hasData=!0,this.data[t]=h),this.length++},addWeight:function(t,e){this.weights[t]+=e},peek:function(t,e){if("undefined"==typeof t&&(t=1),e=!!e,this.length-t<0)throw new Error("Stack underflow! Tried to retrieve "+t+" element"+(1===t?"":"s")+" from a list of "+this.length);for(var h=this._buildWeightedHeap(),i=[],r=0;t>r;r++){var n=h.pop();this.hasData?i.push({key:n,data:this.data[n]}):i.push(n),e&&(delete this.weights[n],delete this.data[n],this.length--)}return i},shuffle:function(){return this.peek(this.length)},pop:function(t){return this.peek(t,!0)},_buildWeightedHeap:function(){var t=[];for(var e in this.weights)this.weights.hasOwnProperty(e)&&t.push([e,this.weights[e]]);return new h(t)}},h.prototype={pop:function(){for(var t=this.heap[1].total*Math.random(),e=1;t>this.heap[e].weight;)t-=this.heap[e].weight,e<<=1,t>this.heap[e].total&&(t-=this.heap[e].total,e++);var h=this.heap[e].value,i=this.heap[e].weight;for(this.heap[e].weight=0;e>0;)this.heap[e].total-=i,e>>=1;return h}},t}();


Array.prototype.remove=function(){for(var t,r,e=arguments,i=e.length;i&&this.length;)for(t=e[--i];-1!==(r=this.indexOf(t));)this.splice(r,1);return this};

//https://github.com/coolaj86/knuth-shuffle
function shuffle(r){for(var f,n,o=r.length;0!==o;)n=Math.floor(Math.random()*o),o-=1,f=r[o],r[o]=r[n],r[n]=f;return r}

var swapArrayElements = function(arr, indexA, indexB) {
  var temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};


//http://stackoverflow.com/questions/11344531/pure-javascript-store-object-in-cookie
function bake_cookie(name, value) {
  var cookie = [name, '=', JSON.stringify(value), '; expires=Thu, 01-Jan-2299 00:00:01 GMT; domain=.', window.location.host.toString(), '; path=/;'].join('');
  document.cookie = cookie;
}
function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}
function delete_cookie(name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}

module.exports = {
    WeightedList: WeightedList,
    shuffle: shuffle,
    bake_cookie: bake_cookie,
    read_cookie: read_cookie,
    delete_cookie: delete_cookie,
    swapArrayElements: swapArrayElements,
};
