<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="trackers"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
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

  mounted() {
    this.getTrackers();
  }

  async getTrackers() {
    console.log('FETCHING TRACKERS');
    const response = await axios.get(
      'https://tracker-api-m11.herokuapp.com/trackers'
    );
    this.trackers = response.data.trackers;
    console.log('TRACKERS: ', response.data.trackers);
  }
}
</script>
