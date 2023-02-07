<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI } from './lib/API';
import { GeoService, WeatherService } from './lib/Service';
import { GeocodingExtractor, OpenWeatherExtractor } from './lib/Extractor';

// EXT stands for Extractor

const weatherEXT = new OpenWeatherExtractor();
const weatherAPI = new OpenWeatherAPI(weatherEXT);
const weatherService = new WeatherService(weatherAPI);
const weather = new OpenWeather();

const geoEXT = new GeocodingExtractor();
const geoAPI = new GeocodingAPI(geoEXT);
const geoService = new GeoService(geoAPI);
const geo = new OpenWeatherGeo();

/*
Usage for Classes and Interfaces:

- Weather is used for DOM interaction with weather data, such as getting and updating values.
- WeatherAPI is used to fetch data from a Weather API.
- WeatherService takes a Weather API as an argument and fetches data from that API; it serves as a middleman.
- WeatherData holds interfaces for weather data from different types of APIs.
- WeatherExtractor is used to extract data from the JSON responses of different Weather APIs.

Since classes here are dependent on interfaces, they are extendable and decoupled by nature.
*/

// TODO: turn this into a class

let latitude: Ref<number> = ref(0);
let longitude: Ref<number> = ref(0);

watch([latitude, longitude], ([lat, long]) => {
  Promise.all([weatherService.getWeather(lat, long), geoService.getLocation(lat, long)]).then(
    ([weatherInfo, geolocation]) => {
      weather.update(weatherInfo);
      geo.update(geolocation);

      console.log(weather, geo);
    }
  );
});
</script>

<template>
  <input v-model="latitude" max="90" type="number" />
  <input v-model="longitude" max="180" type="number" />
  <h1>{{ geo.get('country') || 'Country' }}</h1>
  <p>{{ geo.get('city') || 'City' }}</p>

  <h1>{{ weather.get('weather') || 'Weather' }}</h1>
  <p>{{ weather.get('description') }}</p>
</template>

<style scoped></style>
