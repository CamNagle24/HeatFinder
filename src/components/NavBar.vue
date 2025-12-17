<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const inputValue = ref('')
const router = useRouter()

// const submitSearch = (e: Event) => {
//   e.preventDefault()
//   const query = inputValue.value.trim()
//   if (!query) return
//
//   // Navigate to results page with query param
//   router.push({ name: 'Results', params: { sku: query } })
//   inputValue.value = ''
// }

const submitSearch = (e: Event) => {
  e.preventDefault()
  const query = inputValue.value.trim()
  if (!query) return

  // Navigate to results page with query param
  router.push({ name: 'Results', query: { q: query } })
  inputValue.value = ''
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img class="HeroImage" src="../assets/HeatFinderLogo.png" alt="HeatFinder Logo" />
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form class="d-flex" role="search" @submit="submitSearch">
          <input v-model="inputValue" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" @click="$router.push({ name: 'Home' })">
            <img class="IconImage" src="../assets/svg/home-2.svg" alt="Home Icon" />
            <span class="nav-link active" aria-current="page">Home</span>
          </li>
          <li class="nav-item" @click="$router.push({ name: 'Shop' })">
            <img class="IconImage" src="../assets/svg/shop.svg" alt="Shop Icon" />
            <span class="nav-link">Shop</span>
          </li>
          <li class="nav-item" @click="$router.push({ name: 'Add' })">
            <img class="IconImage" src="../assets/svg/add.svg" alt="Add Icon" />
            <span class="nav-link">Add</span>
          </li>
          <li class="nav-item" @click="$router.push({ name: 'Profile' })">
            <img class="IconImage" src="../assets/svg/profile.svg" alt="Profile Icon" />
            <span class="nav-link">Profile</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.HeroImage {
  display: block;
  margin: 0 auto;
  max-width: 50%;
  height: auto;
  @media (width >= 992px) {
    display: inline-block;
    margin: 0;
    max-width: 20%;
    height: auto;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .IconImage {
    height: 30px;
    width: 30px;
  }
}
</style>
