
<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="grey lighten-1" app dark>
      <!--  -->
      <!-- <v-navigation-drawer permanent> -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Portal </v-list-item-title>
          <v-list-item-subtitle> m11 </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="onNavigate(item.route)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- </v-navigation-drawer> -->
    </v-navigation-drawer>

    <v-main>
      <!--  -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Trackers', icon: 'mdi-view-dashboard', route: '/' },
        { title: 'Regions', icon: 'mdi-image', route: 'regions' },
        { title: 'Alets', icon: 'mdi-help-box', route: '/' },
      ],
      right: null,
      drawer: null,
    };
  },
  methods: {
    onNavigate(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style lang="scss">
.main {
  border: 1px solid red;
}
.side-nav {
  border: 1px solid yellow;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
