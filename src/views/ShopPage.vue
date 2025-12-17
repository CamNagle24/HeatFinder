<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPopular as fetchPopularAPI } from '@/fetchPopular.js'

const route = useRoute()

const results = ref([])
const loading = ref(false)
const error = ref(null)
const sort = ref<'rank' | 'release_date'>('rank')

async function loadPopular() {
  loading.value = true
  error.value = null

  const { products, error: fetchError } = await fetchPopularAPI({
    sort: sort.value
  })

  results.value = products
  error.value = fetchError

  loading.value = false
}

onMounted(loadPopular)

watch(sort, () => {
  loadPopular()
})
</script>

<template>
  <h2 v-if="route.query.q">
    Results for: <strong>{{ route.query.q }}</strong>
  </h2>

  <label>
    Sort by:
    <select v-model="sort">
      <option value="rank">Popularity</option>
      <option value="release_date">Release Date</option>
    </select>
  </label>

  <div v-if="loading">Loading...</div>
  <div v-if="error">{{ error }}</div>

  <div class="results-grid">
    <router-link
      v-for="item in results"
      :key="item.id"
      class="result-card"
      :to="{ name: 'Product', params: { sku: item.id } }"
    >
      <div class="image-wrapper">
        <img :src="item.image" :alt="item.title" class="product-image" />
      </div>
      <h3>{{ item.title }}</h3>
    </router-link>
  </div>
</template>

<style scoped>
  .results-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 280px;
    gap: 1rem;
  }

  /* Tablets */
  @media (max-width: 1024px) {
    .results-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Large phones */
  @media (max-width: 768px) {
    .results-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Small phones */
  @media (max-width: 480px) {
    .results-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .result-card {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    height: 100%;
    border: 1px solid black;
    box-sizing: border-box;
  }

  .result-card h3 {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
  }

  .image-wrapper {
    width: 100%;
    height: 200px;
    border-radius: 6px;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>

