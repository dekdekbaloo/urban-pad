function createUrbanDictionary () {
  let randomCache = []

  return {
    random () {
      if (!randomCache[0]) {
        return Promise.resolve(randomCache.shift())
      }

      return fetch('http://api.urbandictionary.com/v0/random')
        .then(({ data }) => {
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