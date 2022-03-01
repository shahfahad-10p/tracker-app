<template>
  <div class="about">
    <Tracker />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Tracker from "@/components/Tracker.vue";

@Component({
  components: {
    Tracker,
  },
})

export default class About extends Vue {}
</script>
