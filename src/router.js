import {createRouter, createWebHistory} from 'vue-router';
import Home from './views/Home.vue';
import AllItems from "@/views/portfolio/AllItems.vue";
import PortfolioItemDetails from "@/views/portfolio/PortfolioItemDetails.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/examples/portfolio/',
    children: [
      {
        path: '',
        name: 'PortfolioLandingPage',
        component: AllItems
      },
      {
        path: ':portfolioId',
        name: 'PortfolioItemDetails',
        component: PortfolioItemDetails
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
