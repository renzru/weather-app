<script setup lang="ts">
import { Ref, ref, VueElement, watch } from 'vue';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI } from './lib/API';
import { GeoService, IconService, WeatherService } from './lib/Service';
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

let latitude: Ref<number> = ref(0);
let longitude: Ref<number> = ref(0);

watch([latitude, longitude], ([lat, long]) => {
  Promise.all([weatherService.getWeather(lat, long), geoService.getLocation(lat, long)]).then(
    ([weatherInfo, geoLocation]) => {
      weather.update(weatherInfo);
      geo.update(geoLocation);
    }
  );
});
</script>

<template>
  <img v-bind:src="iconService.getIcon(weather.get('icon'))" />
  <input v-model="latitude" max="90" type="number" />
  <input v-model="longitude" max="180" type="number" />
  <h1>{{ geo.get('country') || 'Country' }}</h1>
  <p>{{ geo.get('city') || 'City' }}</p>

  <h1>{{ weather.get('weather') || 'Weather' }}</h1>
  <p>{{ weather.get('description') }}</p>
</template>

<style scoped></style>
