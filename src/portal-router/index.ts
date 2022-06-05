import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Portal from '../views/Portal.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Portal',
    component: Portal,
    meta: {
      title: 'Trackers',
    },
  },
  {
    path: '/regions',
    name: 'Regions',
    // route level code-splittingF
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Regions.vue'),
    meta: {
      title: 'Regions',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
