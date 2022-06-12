<template>
  <div class="about">
    <v-row class="text-center">
      <v-col cols="12">
        <router-link to="/">Info</router-link> |
        <router-link to="/about">Track</router-link>
      </v-col>
      <v-col cols="12">
        <v-img
          :src="require('../assets/arrow-down.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
    </v-row>
    <Tracker />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Tracker from '@/components/Tracker.vue';

@Component({
  components: {
    Tracker,
  },
})
export default class About extends Vue {}
</script>
