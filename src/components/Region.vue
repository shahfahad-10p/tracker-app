<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="1400"
    v-model="openDialog"
  >
    <template>
      <v-card>
        <v-row class="" no-gutters>
          <v-col cols="2">
            <v-text-field
              v-model="region.name"
              label="Region Name"
            ></v-text-field>
            <v-btn color="primary" @click="addRegion">Add</v-btn>
            <v-btn color="error" @click="closeModal">Cancel</v-btn>
          </v-col>

          <v-col cols="10">
            <div class="map-container">
              <div class="map-gl w-100 h-100" ref="mapgl"></div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import RegionService from '../services/region';

import { REGION } from '../interfaces/common';

@Component
export default class Region extends Vue {
  mapgl: any;
  mapBoxDraw: any;
  openDialog = true;
  region: REGION = {
    name: undefined,
    polygon: undefined,
  };

  mounted() {
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

      this.mapgl.addSource('region-add', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: 'tracker-02',
          },
          geometry: {
            type: 'Point',
            coordinates: [67.1524774, 24.9481182],
          },
        },
      });

      this.mapgl.addLayer({
        id: 'region-layer',
        type: 'circle',
        source: 'region-add',
        paint: {
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white',
        },
      });

      this.mapgl.flyTo({ center: [67.1524774, 24.9481182] });

      this.mapBoxDraw = new MapboxDraw({
        displayControlsDefault: false,

        controls: {
          polygon: true,
        },
        defaultMode: 'draw_polygon',
      });

      this.mapgl.addControl(this.mapBoxDraw, 'top-left');

      this.mapgl.on('draw.create', this.onAddRegion);
      this.mapgl.on('draw.update', this.onAddRegion);
    });
  }

  onAddRegion(event: any) {
    if (event.features && event.features.length) {
      this.region.polygon = this.pointsToString(
        event.features[0].geometry.coordinates[0]
      );
      console.log('ON CREATE REGION : ', this.region.polygon);
    }
  }

  closeModal() {
    this.openDialog = false;
    this.$emit('closeRegionsModal');
  }

  async addRegion() {
    if (this.region.name && this.region.polygon) {
      console.log('ADD NEW REGION : ', this.region.name, this.region.polygon);
      await RegionService.add(this.region);
      this.closeModal();
    }
  }

  pointsToString(points: Array<any>) {
    let val = '';
    if (points) {
      for (let index = 0; index < points.length; index++) {
        const point = points[index];
        val += `${point[0]},${point[1]}`;
        index !== points.length - 1 ? (val += ';') : null;
      }
    }
    return val;
  }
}
</script>

<style scoped lang="scss">
.map-gl {
  height: 550px;
}
.map-container {
  padding: 5px;
}
</style>
