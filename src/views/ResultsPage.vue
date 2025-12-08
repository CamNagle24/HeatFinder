<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchShoes } from '@/searchShoes.js'

const route = useRoute()

const results = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchResults(query: string) {
  loading.value = true
  error.value = null

  const { products, error: fetchError } = await searchShoes(query)

  results.value = products
  error.value = fetchError

  loading.value = false
}

// Fetch product on mount or whenever route query changes
watch(
  () => route.query.q,
  (q) => {
    if (q) fetchResults(q as string)
  },
  { immediate: true }
)
</script>

<template>
  <h2 v-if="route.query.q">
    Results for: <strong>{{ route.query.q }}</strong>
  </h2>

  <div v-if="loading">Loading...</div>
  <div v-if="error">{{ error }}</div>

  <div class="results-grid">
    <router-link
      v-for="item in results"
      :key="item.id"
      class="result-card"
      :to="{ name: 'Product', params: { sku: item.id } }"
    >
      <img :src="item.image" :alt="item.title" class="product-image" />
      <h3>{{ item.title }}</h3>
    </router-link>
  </div>
</template>

<style scoped>
  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border: 1px solid black;
    .result-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .product-image {
        width: 100%;
        height: 100%;
        border: 1px solid black;
      }
    }
  }
</style>
