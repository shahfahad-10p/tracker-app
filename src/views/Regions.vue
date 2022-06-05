<template>
  <v-card class="main-container">
    <v-row class="text-center">
      <v-col cols="12">
        <v-btn
          class="primary--text font-weight-bold float-right"
          @click="handleAddRegion"
          >Add Region</v-btn
        >
      </v-col>

      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="regions"
          :items-per-page="10"
          class="elevation-1"
        ></v-data-table>
      </v-col>

      <v-col cols="12">
        <Region v-if="openDialog" @closeRegionsModal="onCloseRegionsModal" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import Region from '../components/Region.vue';
import { API_URL } from '../constants/api';

@Component({
  components: { Region },
})
export default class Regions extends Vue {
  openDialog = false;
  mapgl: any;
  regions = [];
  headers = [
    {
      text: 'Name',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    { text: 'Trackers', value: 'trackers', sortable: false },
    { text: 'Actions', value: 'actions', sortable: false },
  ];

  mounted() {
    this.getRegions();
  }

  async getRegions() {
    const response = await axios.get(`${API_URL}regions`);
    this.regions = response.data.regions;
  }

  async handleAddRegion() {
    this.openDialog = true;
  }

  onCloseRegionsModal() {
    this.openDialog = false;
    this.getRegions();
  }
}
</script>
<style scoped lang="scss">
.main-container {
  padding: 20px;
  height: calc(100vh - 70px);
}
</style>