<template>
  <v-container>
    <v-row class="text-center">
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
                <v-btn text @click="openDialog = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog></v-col
      >
    </v-row>
  </v-container>
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

@Component
export default class TrackerList extends Vue {
  headers = [
    {
      text: 'Name',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    { text: 'latitude', value: 'latitude', sortable: false },
    { text: 'longitude', value: 'longitude', sortable: false },
  ];

  trackers = [];
  openDialog = false;

  mounted() {
    this.getTrackers();
  }

  async getTrackers() {
    console.log('FETCHING TRACKERS');
    const response = await axios.get(`https://tracker-api-m11.herokuapp.com/trackers`);
    this.trackers = response.data.trackers;
    console.log('TRACKERS: ', response.data.trackers);
  }

  async handleClick(row: Tracker) {
    this.openDialog = true;
    console.log('FETCHING ARCHIVE EVENTS', row.name);
    const response = await axios.get(
      `https://tracker-api-m11.herokuapp.com/tracker/${row.name}/geojson`
    );
    console.log('MAP CONTAINER REFERENCE ', this.$refs.mapgl);

    mapboxgl.accessToken =
      'pk.eyJ1IjoiZmFoYWRtMTEiLCJhIjoiY2tmNWE0bXluMDZmNzJxcTdsanRyZTMzZSJ9.Q6Mwf640Zh4VG2zThjrFKg';
    const mapas = new mapboxgl.Map({
      container: this.$refs.mapgl, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    mapas.on('load', () => {
      console.log('MAP LOADED : ');

      mapas.addSource('earthquakes', {
        type: 'geojson',
        data: `https://tracker-api-m11.herokuapp.com/tracker/${row.name}/geojson`,
      });

      mapas.addLayer({
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
    });
  }
}
</script>
<style scoped lang="scss">
.map-gl {
  height: 550px;
}
</style>
