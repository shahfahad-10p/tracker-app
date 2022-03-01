<template>
  <v-app>
    <v-app-bar app color="secondary" dark> </v-app-bar>
    <v-main>
      <v-row class="text-center">
        <v-col cols="12">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </v-col>
      </v-row>
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
