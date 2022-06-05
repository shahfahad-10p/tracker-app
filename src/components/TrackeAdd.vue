<template>
  <v-card>
    <v-card-title>Add Tracker</v-card-title>
    <v-row class="pa-5" no-gutters>
      <v-form ref="trackerForm" v-model="isFormValid">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :counter="30"
                label="Tracker Name"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
                @click="onAddTracker"
                >Add</v-btn
              >
              <v-btn color="error" class="ml-2" @click="closeModal"
                >Cancel</v-btn
              >
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
              </v-snackbar>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <!-- </v-col> -->
    </v-row>
  </v-card>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import TrackerService from '../services/tracker';

@Component
export default class TrackerAdd extends Vue {
  loading = false;
  isFormValid = false;
  showError = false;
  errorMsg?: string = undefined;
  name = '';
  nameRules = [
    (v: string) => !!v || 'Name is required',
    (v: String) => v.length <= 30 || 'Name must be less than 30 characters',
  ];
  email = '';
  emailRules = [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+/.test(v) || 'E-mail must be valid',
  ];

  async onAddTracker() {
    console.log('ON CREATE TRACKER : ', this.isFormValid);
    (this.$refs.trackerForm as Vue & { validate: () => boolean }).validate();

    if (this.isFormValid) {
      this.showError = false;
      this.errorMsg = undefined;
      this.loading = true;
      const payload = {
        name: this.name,
        email: this.email,
      };

      try {
        await TrackerService.add(payload);
        this.closeModal();
      } catch (error: any) {
        this.errorMsg = error.message;
        this.showError = true;
      } finally {
        this.loading = false;
      }
    }
  }

  closeModal() {
    this.$emit('closeAddTrackerModal');
  }

  async addRegion() {}
}
</script>

<style scoped lang="scss">
</style>
