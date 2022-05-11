<template>
  <div class="about">
    <v-row class="text-center">
      <v-col cols="12">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
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
