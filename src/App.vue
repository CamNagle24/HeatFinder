<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <section class="web-app-container">

    <header>
      <NavBar/>
    </header>

    <section class="page-content">
      <router-view/>
    </section>

    <footer>
      <p>Created by Cameron Nagle in 2025</p>
    </footer>
  </section>
</template>

<style scoped>

</style>
