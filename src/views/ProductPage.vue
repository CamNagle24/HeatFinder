<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { shoeInfo } from '@/shoeInfo.js'

const route = useRoute()
const product = ref(null)
const error = ref(null)

const fetchProduct = async (sku: string) => {
  try {
    const { product: fetchedProduct, error: fetchError } = shoeInfo(sku)
    product.value = fetchedProduct
    error.value = fetchError || null
  } catch (e) {
    error.value = (e as Error).message
    product.value = null
  }
}

// Fetch product on mount or whenever route query changes
watch(
  () => route.params.sku,
  (sku) => {
    if (sku) fetchProduct(sku as string)
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="error" class="card">
    <p>{{ error }}</p>
  </div>

  <div v-if="product" class="card">
    <h2>{{ product.value.title }}</h2>
    <img :src="product.value.image" :alt="product.value.title" style="max-width: 400px">
    <p><strong>Brand:</strong> {{ product.value.brand }}</p>
    <p><strong>SKU:</strong> {{ product.value.sku }}</p>
    <p><strong>Lowest Ask:</strong> {{ product.value.min_price ? `$${product.value.min_price}` : 'N/A' }}</p>
    <a :href="product.value.link" target="_blank" rel="noopener">View on StockX</a>
  </div>
</template>

<style scoped></style>
