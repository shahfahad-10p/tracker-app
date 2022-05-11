<template>
  <div class="home">
    <v-row class="text-center">
      <v-col cols="12">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </v-col>
    </v-row>
    <HelloWorld/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
