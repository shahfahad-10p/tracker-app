<template>
  <v-app>
    <v-app-bar app color="secondary" dark>
      <v-toolbar-title>{{$route.meta.title}}</v-toolbar-title></v-app-bar
    >
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
