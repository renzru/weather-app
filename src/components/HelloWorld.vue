<script setup lang="ts">
import { Ref, ref, VueElement, onBeforeMount, watch } from 'vue';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI } from './lib/API';
import { GeoService, IconService, WeatherService, UserGeoService } from './lib/Service';
import { GeocodingExtractor, OpenWeatherExtractor } from './lib/Extractor';

// EXT stands for Extractor

const weatherEXT = new OpenWeatherExtractor();
const weatherAPI = new OpenWeatherAPI();
const weatherService = new WeatherService(weatherAPI, weatherEXT);
const weather = new OpenWeather();

const geoEXT = new GeocodingExtractor();
const geoAPI = new GeocodingAPI();
const geoService = new GeoService(geoAPI, geoEXT);
const geo = new OpenWeatherGeo();

const iconService = new IconService();
const userGeoService = new UserGeoService();

let latitude: Ref<number> = ref(0);
let longitude: Ref<number> = ref(0);
let loaded: Ref<boolean> = ref(false);

onBeforeMount(() => {
  userGeoService
    .getUserGeo()
    .then(([lat, long]: [number, number]) => updateData(lat, long))
    .catch(() => console.log('Error!'));
});

function updateData(lat: number, long: number): void {
  loaded.value = false;
  Promise.all([weatherService.getWeather(lat, long), geoService.getLocation(lat, long)]).then(
    ([weatherInfo, geoLocation]) => {
      weather.update(weatherInfo);
      geo.update(geoLocation);
      loaded.value = true;
    }
  );
}

watch([latitude, longitude], ([lat, long]) => {
  updateData(lat, long);
});
</script>

<template>
  <main class="grid">
    <input v-model="latitude" max="90" type="number" />
    <input v-model="longitude" max="180" type="number" />
    <div v-if="loaded">
      <img v-bind:src="iconService.getIcon(weather.get('icon'))" />
      <h1>{{ weather.get('temp') }}°</h1>
      <h2 class="fs-900">{{ geo.get('city') }}</h2>
      <p class="fs-default text-light">Experiencing {{ weather.get('description') }} right now.</p>
    </div>
    <div v-else="!loaded">Loading...</div>
  </main>
</template>

<style scoped></style>
