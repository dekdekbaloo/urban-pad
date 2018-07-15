function createUrbanDictionary () {
  let randomCache = []
  let isFetching = false

  return {
    random () {
      if (isFetching) {
        alert('ใจเย็นๆ: Calm down')
        return Promise.reject('ใจเย็นๆ: Calm down')
      }
      isFetching = true
      if (randomCache[0]) {
        isFetching = false
        return Promise.resolve(randomCache.shift())
      }

      return fetch('https://api.urbandictionary.com/v0/random')
        .then(response => response.json())
        .then((data) => {
          isFetching = false
          randomCache = data.list
          return randomCache.shift()
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
}

const urbanDictionary = createUrbanDictionary()
