<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-btn
        class="primary--text font-weight-bold float-right"
        @click="handleAddTracker"
        >Add Tracker</v-btn
      >
    </v-col>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="trackers"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.lastSeen="{ item }">
          {{ item.lastSeen ? new Date(item.lastSeen).toLocaleString() : '' }}
        </template>

        <template v-slot:top>
          <v-dialog
            v-model="openDeleteTrackerDialog"
            persistent
            max-width="345px"
          >
            <v-card>
              <v-card-title class="text-h5"
                >Confirm to delete tracker?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" @click="cancelDeleteTracker"
                  >Cancel</v-btn
                >
                <v-btn color="secondary" @click="confirmDeleteTracker"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="onViewTracker(item)">
            mdi-eye
          </v-icon>
          <v-icon small class="mr-2" @click="onViewArchive(item)">
            mdi-vector-polyline
          </v-icon>
          <v-icon small @click="onDeleteTracker(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-col>
    <v-col>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="1400"
        persistent
        v-model="openViewTrackerDialog"
      >
        <template>
          <v-card>
            <!-- <v-card-text> -->
            <div class="pa-1">
              <div class="map-gl w-100 h-100" ref="mapgl"></div>
            </div>
            <!-- </v-card-text> -->
            <v-card-actions class="justify-end">
              <v-btn color="primary" @click="closeMapModal">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog></v-col
    >
    <v-col>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="400"
        persistent
        v-model="openAddTrackerDialog"
      >
        <template>
          <TrackerAdd
            v-if="openAddTrackerDialog"
            @closeAddTrackerModal="onCloseAddTrackerModal"
          />
        </template> </v-dialog
    ></v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import bbox from '@turf/bbox';

import TrackerService from '../services/tracker';
import TrackerAdd from './TrackeAdd.vue';
import { ITracker } from '../interfaces/common';
import { API_URL } from '../constants/api';

@Component({
  components: {
    TrackerAdd,
  },
})
export default class TrackerList extends Vue {
  headers = [
    {
      text: 'Name',
      align: 'start',
      sortable: true,
      value: 'name',
    },
    { text: 'Region', value: 'regionName', sortable: true },
    { text: 'Last Seen', value: 'lastSeen', sortable: true },
    { text: 'Email', value: 'email', sortable: false },
    { text: 'latitude', value: 'latitude', sortable: false },
    { text: 'longitude', value: 'longitude', sortable: false },
    { text: 'Actions', value: 'actions', sortable: false },
  ];

  trackers = [];
  selectedTracker?: ITracker;
  openViewTrackerDialog = false;
  openAddTrackerDialog = false;
  openDeleteTrackerDialog = false;
  mapgl: any;

  mounted() {
    this.getTrackers();
  }

  async getTrackers() {
    const response = await axios.get(`${API_URL}trackers`);
    this.trackers = response.data.trackers;
  }

  handleAddTracker() {
    this.openAddTrackerDialog = true;
  }

  onCloseAddTrackerModal() {
    this.openAddTrackerDialog = false;
    this.getTrackers();
  }

  async onViewTracker(tracker: ITracker) {
    this.openViewTrackerDialog = true;
    const response: any = await axios.get(
      `${API_URL}tracker/${tracker.name}/geojson`
    );
    console.log('GEOJSON ', response);

    mapboxgl.accessToken =
      'pk.eyJ1IjoiZmFoYWRtMTEiLCJhIjoiY2tmNWE0bXluMDZmNzJxcTdsanRyZTMzZSJ9.Q6Mwf640Zh4VG2zThjrFKg';
    this.mapgl = new mapboxgl.Map({
      container: this.$refs.mapgl as HTMLElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    this.mapgl.on('load', () => {
      console.log('MAP LOADED : ');

      this.mapgl.addSource('tracker', {
        type: 'geojson',
        data: `${API_URL}tracker/${tracker.name}/geojson`,
      });

      this.mapgl.addLayer({
        id: 'tracker-layer',
        type: 'circle',
        source: 'tracker',
        paint: {
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white',
        },
      });
      const coordinates = response.data.features.map((tracker: any) => {
        return tracker.geometry.coordinates;
      });

      console.log('BBOX COORDINATES : ', coordinates);

      coordinates.length && this.fitPolygon(this.mapgl, coordinates);
    });
  }

  closeMapModal() {
    this.openViewTrackerDialog = false;
    this.mapgl.remove();
  }

  onViewArchive(tracker: ITracker) {
    this.onViewTracker(tracker);
  }

  onDeleteTracker(tracker: ITracker) {
    this.selectedTracker = tracker;
    this.openDeleteTrackerDialog = true;
  }

  async confirmDeleteTracker() {
    try {
      await TrackerService.remove(this.selectedTracker?.id);
      this.openDeleteTrackerDialog = false;
      this.selectedTracker = undefined;
      this.getTrackers();
    } catch (error) {}
  }

  cancelDeleteTracker() {
    this.openDeleteTrackerDialog = false;
    this.selectedTracker = undefined;
  }

  fitPolygon(map: any, polygon: any) {
    map.fitBounds(
      bbox({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [polygon],
        },
      }),
      { linear: true, padding: { top: 25, bottom: 25, right: 25, left: 25 } }
    );
  }
}
</script>
<style scoped lang="scss">
.map-gl {
  height: 550px;
}
</style>
