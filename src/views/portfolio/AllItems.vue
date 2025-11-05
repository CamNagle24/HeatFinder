<script setup>
import portfolioData from '@/data/portfolio.json'
</script>

<template>
  <h1>My Portfolio</h1>

  <div class="container">

    <div class="preview-card" v-for="portfolioItem in portfolioData" :key="portfolioItem.id">
      <div>{{ portfolioItem.title }}</div>
      <img :src="portfolioItem.thumbnail"/>
      <router-link :to="{ name: 'PortfolioItemDetails', params: { portfolioId: portfolioItem.id } }">Learn More -></router-link>
    </div>

  </div>

</template>

<style scoped>

.container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;

  .preview-card {
    border: 1px solid black;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

</style>
