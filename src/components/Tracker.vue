<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col class="mb-4" lg="6">
        <v-card class="form-card" elevation="2">
          <v-form
            ref="form"
            v-model="valid"
            v-on:submit.prevent
            lazy-validation
          >
            <v-text-field
              v-show="!isTrackerValidated"
              v-model="name"
              :counter="30"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="success"
              class="mr-4"
              v-if="!isTrackerValidated"
              @click="onValidateTracker"
            >
              Validate Tracker
            </v-btn>

            <v-btn
              type="submit"
              color="success"
              class="mr-4"
              v-if="isTrackerValidated && !isTracking"
              @click="onTracking"
            >
              Start tracking
            </v-btn>

            <v-btn
              color="error"
              class="mr-4"
              v-if="isTrackerValidated && !isTracking"
              @click="onStopTracking"
            >
              Cancel
            </v-btn>

            <v-btn
              color="error"
              class="mr-4"
              v-if="isTrackerValidated && isTracking"
              @click="onStopTracking"
            >
              Stop tracking
            </v-btn>

            <pre v-show="isTrackerValidated">{{ coordinates }}</pre>
            <div v-if="isTracking">
              <label>Tracking Status : </label>
              <label>{{ isUpdating ? 'Updating' : 'Waiting' }}</label>
            </div>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="showError" class="py-5">
        <v-snackbar
          :timeout="-1"
          :value="showError"
          absolute
          bottom
          tile
          color="red accent-2"
        >
          {{ errorMsg }}
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="showError = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TrackerService from '../services/tracker';

import axios from 'axios';
import { API_URL } from '../constants/api';

@Component
export default class Tracker extends Vue {
  private coordinates = {
    latitude: '',
    longitude: '',
  };
  private locationWatchId: number = 0;
  private intervalEvent: number = 0;
  private isTracking = false;
  valid = false;
  isTrackerValidated = false;
  name = '';
  trackerId: number;
  nameRules = [
    (v: string) => !!v || 'Name is required',
    (v: string) =>
      (v && v.length <= 30) || 'Name must be less than 10 characters',
  ];
  isUpdating = false;
  showError = false;
  errorMsg?: string = undefined;

  async onValidateTracker() {
    if (!this.name.trim() || !this.valid) {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
      return;
    }
    this.errorMsg = undefined;
    this.showError = false;

    try {
      const validatResponse: any = await TrackerService.validate(this.name);
      this.isTrackerValidated = true;
      this.trackerId = validatResponse.id;
      console.log('TRACKER FORM VALID : ', this.trackerId);
    } catch (error) {
      this.errorMsg = 'Tracker Not Found';
      this.showError = true;
    }
  }

  onTracking() {
    if (!this.name.trim()) {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
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
    this.isTrackerValidated = false;
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
    const timer = 5 * 1000; //5 seconds
    // const timer = 1 * 60 * 1000; //1 minute
    this.intervalEvent = setInterval(this.postTrackerLocation, timer);
  }

  async postTrackerLocation() {
    const dateTime = new Date().toISOString();
    console.log(
      'UPDATING TRACKER LOCATION : ',
      this.name,
      this.coordinates.latitude,
      this.coordinates.longitude,
      dateTime
    );
    this.isUpdating = true;
    if (this.name && this.coordinates.latitude) {
      const payload = {
        id: this.trackerId,
        name: this.name,
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude,
        dateTime,
      };
      const result = await axios.put(`${API_URL}tracker`, payload);
      this.isUpdating = false;
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
