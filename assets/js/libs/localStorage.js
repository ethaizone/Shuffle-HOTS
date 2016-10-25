module.exports = {
  key: 'example_data',
  get: function() {
    var retrievedObject = localStorage.getItem(this.key);
    return JSON.parse(retrievedObject);
  },
  set: function(data) {
    return localStorage.setItem(this.key, JSON.stringify(data));
  }
};