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
        >
          <template v-slot:top>
            <v-dialog v-model="openDeleteDialog" persistent max-width="325px">
              <v-card>
                <v-card-title class="text-h5"
                  >Confirm to delete region?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="primary" @click="cancelDeleteRegion"
                    >Cancel</v-btn
                  >
                  <v-btn color="secondary" @click="confirmDeleteRegion"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="onViewRegion(item)">
              mdi-eye
            </v-icon>
            <v-icon small @click="deleteRegion(item)"> mdi-delete </v-icon>
          </template></v-data-table
        >
      </v-col>

      <v-col cols="12">
        <Region v-if="openDialog" @closeRegionsModal="onCloseRegionsModal" />
      </v-col>
      <v-col cols="12">
        <RegionView
          v-if="openRegionViewDialog"
          :region="selectedRegion"
          @closeRegionViewDialog="onCloseRegionViewModal"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import RegionService from '../services/region';
import Region from '../components/Region.vue';
import RegionView from '../components/RegionView.vue';
import { API_URL } from '../constants/api';
import { REGION } from '../interfaces/common';

@Component({
  components: { Region, RegionView },
})
export default class Regions extends Vue {
  openDialog = false;
  openDeleteDialog = false;
  openRegionViewDialog = false;
  mapgl: any;
  regions = [];
  selectedRegion?: REGION;
  headers = [
    {
      text: 'Name',
      align: 'start',
      sortable: true,
      value: 'name',
    },
    { text: 'Trackers', value: 'trackercount', sortable: true },
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

  onViewRegion(region: REGION) {
    this.selectedRegion = region;
    this.openRegionViewDialog = true;
  }

  onCloseRegionViewModal() {
    this.openRegionViewDialog = false;
    this.selectedRegion = {};
  }

  deleteRegion(region: REGION) {
    this.selectedRegion = region;
    this.openDeleteDialog = true;
  }

  async confirmDeleteRegion() {
    try {
      await RegionService.remove(this.selectedRegion?.id);
      this.openDeleteDialog = false;
      this.selectedRegion = undefined;
      this.getRegions();
    } catch (error) {}
  }

  cancelDeleteRegion() {
    this.openDeleteDialog = false;
    this.selectedRegion = {};
  }
}
</script>
<style scoped lang="scss">
.main-container {
  padding: 20px;
  height: calc(100vh - 70px);
}
</style>