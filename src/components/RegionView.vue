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
          <v-col cols="12">
            <div class="map-container">
              <div class="map-gl w-100 h-100" ref="mapgl"></div>
            </div>
          </v-col>
        </v-row>
        <v-card-actions class="justify-end">
          <v-btn @click="closeMapModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import { REGION } from '@/interfaces/common';

// Define the props by using Vue's canonical way.
const RegionProps = Vue.extend({
  props: {
    region: {},
  },
});

@Component
export default class RegionView extends RegionProps {
  mapgl: any;
  openDialog = true;
  regionProp: REGION;

  mounted() {
    this.regionProp = this.region as REGION;
    let polygonArray: Array<Array<number>> = [];

    if (this.regionProp.polygon) {
      var polyStringArray = this.regionProp.polygon.split(';');
      polyStringArray.forEach((item) => {
        let coordinates = item
          .split(',')
          .map((coord) => coord)
          .map((stringCoord) => parseFloat(stringCoord));
        polygonArray.push(coordinates);

        console.log(coordinates);
      });

      console.log(
        'VIEW REGION : MOUNTED : ',
        this.regionProp.polygon,
        polygonArray
      );
    }

    mapboxgl.accessToken =
      'pk.eyJ1IjoiZmFoYWRtMTEiLCJhIjoiY2tmNWE0bXluMDZmNzJxcTdsanRyZTMzZSJ9.Q6Mwf640Zh4VG2zThjrFKg';
    this.mapgl = new mapboxgl.Map({
      container: this.$refs.mapgl as HTMLElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [67.038982, 24.874701], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    this.mapgl.on('load', () => {
      console.log('MAP LOADED : ');

      this.mapgl.addSource('region-view', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [polygonArray],
          },
        },
      });

      // Add a new layer to visualize the polygon.
      this.mapgl.addLayer({
        id: 'maine',
        type: 'fill',
        source: 'region-view',
        layout: {},
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.1,
        },
      });
      // Add a black outline around the polygon.
      this.mapgl.addLayer({
        id: 'outline',
        type: 'line',
        source: 'region-view',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 3,
        },
      });

      // this.mapgl.flyTo({ center: [67.1524774, 24.9481182] });
      this.fitPolygon(this.mapgl, polygonArray);
    });
  }

  closeMapModal() {
    this.$emit('closeRegionViewDialog');
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
.map-container {
  padding: 5px;
}
</style>
