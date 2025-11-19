<script setup>
import { shoeInfo } from '../shoeInfo.js'

const sku = 'air-jordan-4-retro-red-thunder'

const { product, error } = shoeInfo(sku)

</script>

<template>
  <div class="card" v-if="error">
    <p>{{ error }}</p>
  </div>

  <div class="card">
    <h2>{{ product.title }}</h2>
    <img :src="product.image" :alt="product.title" style="max-width: 400px">
    <p><strong>Brand:</strong> {{ product.brand }}</p>
    <p><strong>SKU:</strong> {{ product.sku }}</p>
    <p><strong>Price (US 10):
      {{ product.min_price ? `$${product.min_price}` : 'N/A' }}</strong></p>
    <a :href="product.link" target="_blank" rel="noopener">
      View on StockX
    </a>
    <p>{{ product }}</p>
  </div>
</template>

<style scoped>

</style>
