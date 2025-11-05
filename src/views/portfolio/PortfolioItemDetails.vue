<script setup>
import { useRoute } from 'vue-router'
import portfolioData from '@/data/portfolio.json'

const route = useRoute()
const itemData = portfolioData.filter(item => item.id === Number(route.params.portfolioId))[0]
</script>

<template>
  <div>{{itemData}}</div>
  <div v-if="itemData">
    <div class="top-line">
      <h1>{{ itemData.title }}</h1>
      <img :src="itemData.thumbnail"/>
      <p>{{ itemData.description }}</p>
      <div class="specifics">
        <h4>Tools Used: {{ itemData.tools_used }}</h4>
        <h4>When Created: {{ itemData.when_created }}</h4>
        <h4>Created For: {{ itemData.created_for }}</h4>
      </div>
    </div>
  </div>
  <p v-else>Sorry, this id doesn't exist</p>
</template>

<style scoped>
.specifics {
  display: flex;
  gap: 1rem;
}
.top-line {
  display: flex;
  flex-direction: column;
  border: 10px solid blue;
  justify-content: center;
  align-items: center;
  img {
    width: 50%;
  }
}

</style>
