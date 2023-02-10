<script setup lang="ts">
import { Ref, ref, VueElement, onBeforeMount, watch } from 'vue';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI } from './lib/API';
import { GeoService, IconService, WeatherService, UserGeoService } from './lib/Service';
import { GeocodingExtractor, OpenWeatherExtractor } from './lib/Extractor';

// Weather
const weatherEXT = new OpenWeatherExtractor();
const weatherAPI = new OpenWeatherAPI();
const weatherService = new WeatherService(weatherAPI, weatherEXT);
const weather = new OpenWeather();

// Geo
const geoEXT = new GeocodingExtractor();
const geoAPI = new GeocodingAPI();
const geoService = new GeoService(geoAPI, geoEXT);
const geo = new OpenWeatherGeo();

//  Misc.
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

// TODO: Add state in geo data to display country, state in page if available
</script>

<template>
  <input v-model="latitude" max="90" type="number" />
  <input v-model="longitude" max="180" type="number" />
  <main class="grid" v-if="loaded">
    <div class="weather flow">
      <section class="weather-main grid">
        <div class="grid">
          <img class="weather-icon" v-bind:src="iconService.getIcon(weather.get('icon'))" />
          <h1 class="fs-normal align-start text-light-1">{{ geo.get('country') }}</h1>
          <h1 class="fs-700 text-black">
            {{ geo.get('city') }}
            <span class="bold">{{ weather.get('feels_like') }}°</span>
          </h1>
          <p class="fs-normal body text-light-1">
            Experiencing {{ weather.get('description') }} right now.
          </p>
        </div>
      </section>
      <section class="weather-extra flex">
        <article class="grid">
          <h1 class="fs-normal text-light-2">Feels like</h1>
          <p class="bold fs-700">{{ weather.get('feels_like') }}°</p>
        </article>
        <hr />
        <article class="grid">
          <h1 class="fs-normal text-light-2">Humidity</h1>
          <p class="bold fs-700">{{ weather.get('humidity') }}%</p>
        </article>
        <hr />
        <article class="grid">
          <h1 class="fs-normal text-light-2">Wind</h1>
          <p class="bold fs-700">{{ weather.get('wind_speed') }}m/s</p>
        </article>
        <hr />
        <article class="grid">
          <h1 class="fs-normal text-light-2">Pressure</h1>
          <p class="bold fs-700">{{ weather.get('humidity') }} hPa</p>
        </article>
      </section>
    </div>
  </main>
  <div v-else="!loaded">Loading...</div>
</template>

<style scoped>
main {
  grid-template-areas: '. content .';
  grid-template-columns: minmax(2rem, 1fr) 40rem minmax(2rem, 1fr);
}

.weather {
  --flow-margin: 2.5rem;
  grid-area: content;
}

.weather-main {
  place-items: center;
}

.weather-icon {
  place-self: center;
}

.weather-extra {
  justify-content: center;
  padding: 2rem 3rem;
  border-radius: 1.5rem;
  background-color: #efeef6;
}

.body {
  font-weight: normal;
  font-family: 'Source Sans Pro';
}
</style>
