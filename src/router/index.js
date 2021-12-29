import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import FrequencyDictionary from '../views/FrequencyDictionary.vue';
import Assessment from '../views/Assessment.vue';
import Crud from '../views/Crud.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/frequency-dictionary',
    name: 'Frequency Dictionary',
    component: FrequencyDictionary,
  },
  {
    path: '/assessment',
    name: 'Vocab Assessment',
    component: Assessment,
  },
  {
    path: '/crud',
    name: 'Data Editor',
    component: Crud,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
