export async function searchShoes(query, options = {}) {
  const api_key = 'sd_DwRHOWzxY3z6TxcWOSQH7DwMOBZeocY8'

  const params = new URLSearchParams({
    query: query,
    sort: options.sort || 'rank',
    limit: options.limit || 30,
    market: options.market || 'US',
    currency: options.currency || 'USD',
  })

  params.append("display[prices]", "true")
  params.append("display[traits]", "true")
  params.append("display[identifiers]", "true")
  params.append("display[variants]", "true")

  const url = `https://api.kicks.dev/v3/stockx/products?${params.toString()}`

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: api_key,
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()
    return {
      products: data.data || [],
      error: null
    }

  } catch (err) {
    console.error(err)
    return {
      products: [],
      error: 'Error fetching search results.'
    }
  }
}
