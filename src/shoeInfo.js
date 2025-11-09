import { ref, onMounted } from 'vue'

export function shoeInfo(stockxId) {
  const api_key = 'sd_DwRHOWzxY3z6TxcWOSQH7DwMOBZeocY8'

  const product = ref({})
  const error = ref(null)

  async function fetchProduct() {
    // Use the StockX endpoint with the product ID
    const url = `https://api.kicks.dev/v3/stockx/products/${stockxId}`

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: api_key,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      product.value = data.data
    } catch (err) {
      console.error(err)
      error.value = 'Error fetching product data.'
    }
  }

  onMounted(fetchProduct)

  return { product, error }
}
