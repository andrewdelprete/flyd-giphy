import flyd from 'flyd'
import filter from 'flyd/module/filter'
import afterSilence from 'flyd/module/aftersilence'
import 'whatwg-fetch'

// Assets
import './index.html'
import './PoweredBy_640_Horizontal_Light-Backgrounds_With_Logo.gif'
import './favicon-16x16.png'
import './favicon-32x32.png'

// Service Workers
require('offline-plugin/runtime').install()
import './manifest.json'

// Elements
const search = document.getElementById('search')
const resultList = document.getElementById('results')

// If online then show online things
if (navigator.onLine) {
  // Check if url has search param, if so then prepopulate field.
  const searchParam = location.search.split('search=')[1] || ''

  if (searchParam.length > 0) {
    search.value = searchParam
  }

  // Streams
  const search$ = flyd.stream()
  const searchText$ = flyd.map(e => e.target.value.trim(), search$)
  const filterByLength$ = filter(text => text.length > 1 || text.length == 0, searchText$)
  const giphyUrl$ = flyd.stream(searchParam)
  const giphyResponse$ = flyd.stream()

  // Events
  search.addEventListener('keyup', search$)

  // 1. Listen for searchText$ change and set giphyUrl$ with 500ms debounce (afterSilence)
  flyd.on(() => giphyUrl$(searchText$()), afterSilence(500, filterByLength$))

  // 2. Listen for giphyUrl$ change and fetch gifs from giphy
  flyd.on(() => giphyResponse$(fetchGifs(giphyUrl$())), giphyUrl$)

  // 3. Listen for giphyResponse$ change and render html
  flyd.on(render, giphyResponse$)

  // Render
  function render(response) {
    const results = response.data

    if (results.length > 0) {
      return resultList.innerHTML = results
        .reduce((html, current) => {
          const gif = `
            <a
              class='gif'
              href='${ current.url }'
              style='background-image: url(${ current.images.fixed_width.url })'
            ></a>`

          return html + gif
        }, '')
    }

    resultList.innerHTML = ""
  }

  // Fetch results with giphy and return a promise
  const fetchGifs = text => (
    fetch(`https://api.giphy.com/v1/gifs/search?q=${ text }&api_key=dc6zaTOxFJmzC`)
      .then(response => response.json())
  )

// Show offline things
} else {
  document.getElementById('powered-by-giphy').style.display = "none";
  search.value = "Check your internet wires."
  search.disabled = true
}
