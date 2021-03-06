<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="1400"
    persistent
    v-model="openDialog"
  >
    <template>
      <v-card>
        <v-row no-gutters>
          <v-col cols="2">
            <v-card-title>Add Region</v-card-title>
            <div class="pa-5">
              <v-text-field
                v-model="region.name"
                label="Region Name"
              ></v-text-field>
              <v-btn color="primary" @click="addRegion">Add</v-btn>
              <v-btn color="error" class="ml-2" @click="closeModal"
                >Cancel</v-btn
              >
            </div>
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
    id: undefined,
    name: undefined,
    polygon: undefined,
  };

  mounted() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZmFoYWRtMTEiLCJhIjoiY2tmNWE0bXluMDZmNzJxcTdsanRyZTMzZSJ9.Q6Mwf640Zh4VG2zThjrFKg';
    this.mapgl = new mapboxgl.Map({
      container: this.$refs.mapgl as HTMLElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [67.038982, 24.874701], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    this.mapgl.on('load', () => {
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

      let tool = document.querySelector('[title="Polygon tool (p)"]');
      tool?.classList.add('polygon-tool');
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

<style lang="scss">
.map-gl {
  height: 550px;
}
.map-container {
  padding: 5px;
}
.polygon-tool {
  height: 35px !important;
  width: 105px !important;
  background-color: var(--v-primary-base) !important;
  border-radius: 4px !important;
  background-image: none !important;
  border: none !important;
}
.polygon-tool::after {
  font-size: 0.875rem;
  font-family: 'Arial';
  content: 'Draw region';
  color: rebeccapurple;
}
</style>
