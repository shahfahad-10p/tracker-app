<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4" cols="6">
        <h1>TRACKER COMPONENT</h1>
        <v-card class="form-card" elevation="2">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="30"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-btn
              color="success"
              class="mr-4"
              v-if="!isTracking"
              @click="onTracking"
            >
              Start tracking
            </v-btn>

            <v-btn
              color="error"
              class="mr-4"
              v-if="isTracking"
              @click="onStopTracking"
            >
              Stop tracking
            </v-btn>

            <pre>{{ coordinates }}</pre>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import axios from 'axios';

@Component
export default class Tracker extends Vue {
  private coordinates = {
    latitude: '',
    longitude: '',
  };
  private locationWatchId: number = 0;
  private intervalEvent:number = 0;
  private isTracking = false;
  valid = false;
  name = '';
  nameRules = [
    (v: string) => !!v || 'Name is required',
    (v: string) =>
      (v && v.length <= 30) || 'Name must be less than 10 characters',
  ];

  onTracking() {
    if (!this.name.trim()) {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()
      return;
    }
    this.isTracking = true;
    this.getLocation();
    this.startLocationTimer();
    console.log('START TRACKING DEVICE');
  }

  onStopTracking() {
    console.log('STOP TRACKING DEVICE');
    this.isTracking = false;
    navigator.geolocation.clearWatch(this.locationWatchId);
    clearInterval(this.intervalEvent);
  }

  getLocation() {
    if (navigator.geolocation) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        this.showPosition
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  async showPosition(position: any) {
    this.coordinates.latitude = position.coords.latitude;
    this.coordinates.longitude = position.coords.longitude;
  }

  startLocationTimer() {
    this.intervalEvent = setInterval(this.postTrackerLocation, 5 * 1000);
  }

  async postTrackerLocation() {
    console.log(
      'UPDATING TRACKER LOCATION : ',
      this.name,
      this.coordinates.latitude,
      this.coordinates.longitude
    );
    if (this.name && this.coordinates.latitude) {
      const payload = {
        name: this.name,
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude,
      };
      const result = await axios.put(
        'https://tracker-api-m11.herokuapp.com/tracker',
        payload
      );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.form-card {
  padding: 20px;
}
</style>
