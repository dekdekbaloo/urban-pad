function main () {
  let pageStart = 0
  const listContent = document.querySelector('#list-content')
  const seeMoreButton = document.querySelector('#see-more')

  seeMoreButton.addEventListener('click', seeMore)

  function loadPage () {
    const pagesPromise = pageApp.getPages(pageStart, 10)
      .then(Object.entries)
      .then(appendList)

    pageStart += 10

    return pagesPromise
  }

  function appendList (values) {
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
}

main()