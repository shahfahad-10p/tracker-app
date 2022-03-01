<template>
  <v-container>
      <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
      <h1>TRACKER COMPONENT</h1>
      <pre>`{{ users }}</pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import axios from 'axios';

@Component
export default class Tracker extends Vue {

  private users: Array<any> = [];
  
  mounted() {
    console.log('TRACKER MOUNTED : ');
    this.getUsers();
  }

  async getUsers() {
    console.log('FETCH USERS ');
    const result = await axios.get('https://tracker-api-m11.herokuapp.com/users');
    // const result = await axios.get('http://localhost:3000/users');
    console.log('USERS ', result.data);
    this.users = result.data;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
