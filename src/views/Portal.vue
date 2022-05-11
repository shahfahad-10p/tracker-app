<template>
  <div>
    <TrackerList/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TrackerList from "@/components/TrackerList.vue"; // @ is an alias to /src

@Component({
  components: {
    TrackerList,
  },
})
export default class Home extends Vue {}
</script>
