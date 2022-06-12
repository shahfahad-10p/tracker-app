<template>
  <v-card class="main-container">
    <div>
      <TrackerList />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TrackerList from '@/components/TrackerList.vue'; // @ is an alias to /src

@Component({
  components: {
    TrackerList,
  },
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.main-container {
  padding: 20px;
  height: calc(100vh - 70px);
  overflow-y: auto;
}
</style>
