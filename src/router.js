import {createRouter, createWebHistory} from 'vue-router';
import HomePage from './views/HomePage.vue';
import ShopPage from './views/ShopPage.vue';
import AddPage from './views/AddPage.vue';
import AllItems from "@/views/portfolio/AllItems.vue";
import PortfolioItemDetails from "@/views/portfolio/PortfolioItemDetails.vue";
import ResultsPage from "@/views/ResultsPage.vue";
import ProductPage from "@/views/ProductPage.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopPage
  },
  {
    path: '/add',
    name: 'Add',
    component: AddPage
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
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsPage
  },
  {
    path: '/product/:sku',
    name: 'Product',
    component: ProductPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
