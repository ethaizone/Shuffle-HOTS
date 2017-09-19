import DataStore from '../libs/DataStore'

var store = new DataStore('shuffle-hots')

export default {
  saveData (data, resolve, reject) {
    return new Promise((resolve, reject) => {
      try {
        resolve(store.save(data))
      } catch (err) {
        reject(err)
      }
    }).then(resolve).catch(reject)
  },

  loadData (resolve, reject) {
    return new Promise((resolve, reject) => {
      try {
        var result = store.load()
        if (result === null) {
          result = []
        }
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }).then(resolve).catch(reject)
  }
}
