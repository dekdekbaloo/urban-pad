const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync('./urban-dictionary-pad-export.json', 'utf8'))

async function main () {
  for (const key in data.pages) {
    await new Promise((resolve) => {
      setTimeout((() => {
        data.pages[key].timestamp = Date.now()
        resolve()
      }), 10)
    })
  }

  fs.writeFileSync('./urban-dictionary-pad-export.json', JSON.stringify(data))
}

main()