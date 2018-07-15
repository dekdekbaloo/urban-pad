function main () {
  let startTimeStamp = 0
  const listContent = document.querySelector('#list-content')
  const seeMoreButton = document.querySelector('#see-more')
  const alert = document.querySelector('#alert')

  seeMoreButton.addEventListener('click', seeMore)

  function loadPage () {
    const pagesPromise = pageApp.getPages(startTimeStamp, 10)
      .then(Object.entries)
      .then(list => {
        startTimeStamp = list[list.length - 1][1].timestamp
        return list
      })
      .then(appendList)


    return pagesPromise
  }

  function appendList (values) {
    if (startTimeStamp > 0) {
      // HACK: Fix duplicated list
      values.shift()
    }
    values.forEach(([ key, value ]) => {
      const node = document.createElement('div')
      node.className = 'card mt-3'
      node.innerHTML = `
        <div class='card-body'>
          <h5 class='card-title'>
            ${value.title}
          </h5>
          <p class="card-text">${value.content.slice(0, 100)}...</p>
          <a href="/editor?page=${value.slug}" class="btn btn-primary">Read and Write!</a>
        </div>
      `

      listContent.appendChild(node)
    })
  }

  function seeMore () {
    this.setAttribute('disabled', 'true')
    loadPage().then(() => {
      this.removeAttribute('disabled')
    })
  }

  loadPage()
  nuts.animate()
  chains.animate()
  setInterval(() => {
    const rect = alert.getBoundingClientRect()
    nuts.spawn(rect.right, rect.top)
  }, 250)
  setInterval(() => {
    const rect = alert.getBoundingClientRect()
    chains.spawn(rect.right, rect.top)
  }, 5000)
}

main()