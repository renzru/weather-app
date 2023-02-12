<script setup lang="ts">
import { Ref, ref, onBeforeMount, watch } from 'vue';
import { IWeatherData } from './lib/Data';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI } from './lib/API';
import { GeoService, IconService, WeatherService, UserGeoService } from './lib/Service';
import { GeocodingExtractor, OpenWeatherExtractor } from './lib/Extractor';
import DetailsModal from './DetailsModal.vue';

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
let weatherDetails: Ref<IWeatherData> = ref({} as IWeatherData);

onBeforeMount(() => {
  // Caching
  const userGeo = localStorage.getItem('userGeo');

  if (userGeo) {
    [latitude.value, longitude.value] = JSON.parse(userGeo);
  } else {
    userGeoService
      .getUserGeo()
      .then((res) => {
        localStorage.setItem('userGeo', JSON.stringify(res));
        [latitude.value, longitude.value] = res as [number, number];
      })
      .catch(() => console.log('Error!'));
  }

  updateData(latitude.value, longitude.value);
});

//todo make openweatherdata just contain all data instead
function updateData(lat: number, long: number): void {
  loaded.value = false;
  // WeatherAPI is being used directly instead of the service because the entire response is required.
  Promise.all([weatherService.getWeather(lat, long), geoService.getLocation(lat, long)]).then(
    ([weatherData, geoData]) => {
      weather.update(weatherData);
      weatherDetails.value = weatherData;

      geo.update(geoData);
      loaded.value = true;
    }
  );
}

watch([latitude, longitude], ([lat, long]) => {
  updateData(lat, long);
});

// TODO: Add modal that displays complete weather data
</script>

<template>
  <input v-model="latitude" max="90" type="number" />
  <input v-model="longitude" max="180" type="number" />
  <main class="grid" v-if="loaded">
    <div class="weather flow">
      <!-- Main Weather Data -->
      <section class="weather-main grid">
        <div class="grid">
          <img
            class="weather-icon align-center"
            v-bind:src="iconService.getIcon(weather.get('icon'))" />
          <h1 v-if="geo.get('country')" class="fs-normal align-start text-light-1">
            {{ geo.get('country') }}{{ geo.get('state') ? ',' : '' }} {{ geo.get('state') || '' }}
          </h1>
          <h1 v-else class="fs-normal align-start text-light-1">Location unavailable...</h1>
          <h1 class="fs-700 text-black">
            {{ geo.get('city') }}
            <span class="bold">{{ weather.get('temp') }}°</span>
          </h1>
          <p class="fs-normal body text-light-1 align-center">
            Experiencing {{ weather.get('description') }}.
          </p>
        </div>
      </section>
      <!-- Additional Weather Data -->
      <section class="weather-extra flex">
        <button class="details-btn">i</button>

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
  <!-- Loading Screen -->
  <div v-else="!loaded">Loading...</div>
  <!-- Details Modal -->
  <!-- <DetailsModal v-if="loaded" :details="weatherDetails" /> -->
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

.details-btn {
  position: absolute;
  aspect-ratio: 1;
  right: 0.55rem;
  top: 0.55rem;
  padding: 0.55rem;
  line-height: 0;
  border-radius: 100%;
  background-color: #d4d2df;
}
.weather-extra {
  position: relative;
  justify-content: center;
  padding: 2rem 3rem;
  border-radius: 0.85rem;
  background-color: #efeef6;
}

.body {
  font-weight: normal;
  font-family: 'Source Sans Pro';
}
</style>
