<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>CURRENT POSITION</h1>
    <h2>LATITUDE {{ coordinates.latitude }}</h2>
    <h2>LONGITUDE {{ coordinates.longitude }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  private coordinates = {
    latitude: '',
    longitude: ''
  };

  mounted() {
    console.log('VUE MOUNTED : ');
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(this.showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  showPosition(position: any) {
    this.coordinates.latitude = position.coords.latitude;
    this.coordinates.longitude = position.coords.longitude;
    console.log('COORDINATES : ', this.coordinates);
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
</style>
