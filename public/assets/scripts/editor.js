function main () {
  let keyDownCount = 0
  let nutsInterval = 10
  let currentPage = null
  const editor = document.querySelector('#editor-content')
  const title = document.querySelector('#title')
  const saveButton = document.querySelector('button#save')

  function init () {
    nuts.animate()
    chains.animate()

    getPageDataByQuery()
      .then((page) => {
        if (!page) {
          return Promise.reject()
        }

        currentPage = page

        title.innerHTML = page.title
        editor.innerHTML = page.content
        editor.setAttribute('contenteditable', 'true')
        editor.focus()

        editor.addEventListener('keydown', onKeyDown)
      })
      .catch(() => {
        const title = window.prompt('Please enter your page title', 'My title')

        urbanDictionary.random().then(({ word }) => {
          const alteredTitle = word
          const slug = sluggify(alteredTitle)

          pageApp.getPageBySlug(slug)
            .then(page => {
              const realSlug = page ? `${slug}-${uuid()}` : slug
              return pageApp.addPage(alteredTitle, realSlug)
            })
            .then((slug) => window.location.href = '/editor?page=' + slug)
        })
      })

    saveButton.addEventListener('click', () => {
      saveButton.setAttribute('disabled', 'true')
      pageApp
        .saveContent(currentPage.id, editor.innerHTML)
        .then(() => {
          window.location.reload()
        })
    })
  }

  function getPageDataByQuery () {
    const slugMatch = window.location.search.match(/page=([^&]*)/)

    if (slugMatch) {
      return pageApp.getPageBySlug(slugMatch[ 1 ])
    }

    return Promise.reject()
  }

  function onKeyDown (event) {
    keyDownCount++

    if (keyDownCount % nutsInterval === 0) {
      const range = window.getSelection().getRangeAt(0)
      const { top, left } = range.getBoundingClientRect()
      if (Math.random() > 0.5) {
        nuts.spawn(left, top)
      } else {
        chains.spawn(left, top)
      }
      nutsInterval = Math.round(Math.random() * 20) + 10
    }

    if (event.key === ' ') {
      event.preventDefault()

      const wordRange = getCurrentWordRange()

      if (!wordRange) {
        return
      }

      urbanDictionary.random().then(({ word }) => {
        replaceContentAt(wordRange, word)
      })
    }
  }

  function replaceContentAt (wordRange, text) {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)

    wordRange.deleteContents()

    const textNode = document.createTextNode(text + '\u00a0')
    range.insertNode(textNode)
    range.setStartAfter(textNode)
  }

  function getCurrentWordRange () {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const clonedRange = range.cloneRange()

    const end = selection.focusOffset - 1
    if (end < 0) {
      return null
    }

    for (let i = end - 1; i >= 0; i -= 1) {
      clonedRange.setStart(range.startContainer, i)
      if (clonedRange.toString().match(/\s/)) {
        clonedRange.setStart(range.startContainer, i + 1)
        return clonedRange
      }
    }

    clonedRange.setStart(range.startContainer, 0)
    return clonedRange
  }

  init()
}

main()

