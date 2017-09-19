var DataStore = class {
  constructor (key) {
    this.key = key
  }

  load () {
    var retrievedObject = window.localStorage.getItem(this.key)
    if (typeof retrievedObject === 'string') {
      return JSON.parse(retrievedObject)
    } else {
      return null
    }
  }

  save (data) {
    return window.localStorage.setItem(this.key, JSON.stringify(data))
  }
}

export default DataStore
