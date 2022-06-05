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
        @click:row="handleClick"
      ></v-data-table>
    </v-col>
    <v-col>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="1200"
        v-model="openDialog"
      >
        <template>
          <v-card>
            <v-card-text>
              <div class="map-gl w-100 h-100" ref="mapgl"></div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="closeMapModal">Close</v-btn>
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
interface Tracker {
  name: string;
  latitude: number;
  longitude: number;
}

import { Component, Prop, Vue } from 'vue-property-decorator';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import bbox from '@turf/bbox';

import TrackerAdd from './TrackeAdd.vue';
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
      sortable: false,
      value: 'name',
    },
    { text: 'Email', value: 'email', sortable: false },
    { text: 'Region', value: 'regionName', sortable: false },
    { text: 'latitude', value: 'latitude', sortable: false },
    { text: 'longitude', value: 'longitude', sortable: false },
  ];

  trackers = [];
  openDialog = false;
  openAddTrackerDialog = false;
  mapgl: any;

  mounted() {
    this.getTrackers();
  }

  async getTrackers() {
    const response = await axios.get(`${API_URL}trackers`);
    this.trackers = response.data.trackers;
  }

  async handleClick(row: Tracker) {
    this.openDialog = true;
    const response: any = await axios.get(
      `${API_URL}tracker/${row.name}/geojson`
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

      this.mapgl.addSource('earthquakes', {
        type: 'geojson',
        data: `${API_URL}tracker/${row.name}/geojson`,
      });

      this.mapgl.addLayer({
        id: 'earthquakes-layer',
        type: 'circle',
        source: 'earthquakes',
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

  handleAddTracker() {
    this.openAddTrackerDialog = true;
  }

  onCloseAddTrackerModal() {
    this.openAddTrackerDialog = false;
    this.getTrackers();
  }

  closeMapModal() {
    this.openDialog = false;
    this.mapgl.remove();
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
