const api_key = 'PUTAPIKEYHERELATER'
const movie_title = 'The Shawshank Redemption'

fetch(`http://www.omdbapi.com/?apikey=${api_key}&t=${ movie_title }`)
  .then(res => res.json())
  .then(data => {
    // const title = data.Title;
    // const plot = data.Plot;
    // console.log('Title ', title)
    // console.log('Plot ', plot)

    console.log('Entire response: ', data)

  })
  .catch(err => console.log(err))
