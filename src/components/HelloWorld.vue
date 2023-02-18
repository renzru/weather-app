<script setup lang="ts">
import { Ref, ref, onBeforeMount, watch } from 'vue';
import { IWeatherData } from './lib/Data';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI } from './lib/API';
import { GeoService, OpenWeatherIconService, WeatherService, UserGeoService } from './lib/Service';
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

const iconService = new OpenWeatherIconService();
const userGeoService = new UserGeoService();

let latitude: Ref<number> = ref(0);
let longitude: Ref<number> = ref(0);
let loaded: Ref<boolean> = ref(false);
let showDetails: Ref<boolean> = ref(false);
let weatherIcon: Ref<string> = ref('');
let weatherDetails: Ref<IWeatherData> = ref({} as IWeatherData);

// TODO: add proper loading animation
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

function updateData(lat: number, long: number): void {
  loaded.value = false;
  Promise.all([weatherService.getWeather(lat, long), geoService.getLocation(lat, long)]).then(
    ([weatherData, geoData]) => {
      weather.update(weatherData);
      weatherDetails.value = weatherData;

      geo.update(geoData);

      weatherIcon = iconService.getIcon(weather);
      loaded.value = true;
    }
  );
}

function toggleDetails(): void {
  showDetails.value = !showDetails.value;
}

watch([latitude, longitude], ([lat, long]) => {
  updateData(lat, long);
});
</script>

<template>
  <input v-model="latitude" max="90" type="number" />
  <input v-model="longitude" max="180" type="number" />
  <main class="grid" v-if="loaded">
    <div class="weather flow">
      <!-- Main Weather Data -->
      <section class="weather-main grid">
        <div class="grid">
          <img class="weather-icon align-center" v-bind:src="weatherIcon" />
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
      <section class="weather-extra relative grid flow">
        <h1 class="fs-normal bold uppercase text-light-2 relative">
          Conditions
          <button class="details-btn fs-300" @click="toggleDetails()">See More</button>
        </h1>

        <div class="flex">
          <article class="grid relative">
            <div class="flex">
              <h1 class="fs-normal text-light-2">Feels like</h1>
              <img src="/feels-like.svg" class="weather-icon-extra" />
            </div>
            <p class="bold fs-500">{{ weather.get('feels_like') }}°</p>
          </article>
          <hr />
          <article class="grid relative">
            <img src="/humidity-percent.svg" class="weather-icon-extra" />
            <div>
              <h1 class="fs-normal text-light-2">Humidity</h1>
              <p class="bold fs-500">{{ weather.get('humidity') }}%</p>
            </div>
          </article>
          <hr />
          <article class="grid relative">
            <div class="flex">
              <img src="/wind-speed.svg" class="weather-icon-extra" />
              <h1 class="fs-normal text-light-2">Wind</h1>
            </div>
            <p class="bold fs-500">{{ weather.get('wind_speed') }}m/s</p>
          </article>
          <hr />
          <article class="grid relative">
            <div class="flex">
              <img src="/cloudiness.svg" class="weather-icon-extra" />
              <h1 class="fs-normal text-light-2">Cloudiness</h1>
            </div>
            <p class="bold fs-500">{{ weather.get('clouds') }}%</p>
          </article>
        </div>
      </section>
    </div>
  </main>
  <!-- Loading Screen -->
  <div v-else="!loaded">Loading...</div>
  <!-- Details Modal -->
  <DetailsModal v-if="loaded && showDetails" @hide="toggleDetails()" :details="weatherDetails" />
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
  width: 8.5rem;
  margin-bottom: 1rem;
}

.details-btn {
  position: absolute;
  right: 0;
  padding: 0.15rem 0.5rem;
  font-weight: 500;
  color: white;
  border-radius: 5rem;
  background-color: #5590f0;
  transition: all 0.25s ease;
}

.details-btn:hover {
  cursor: pointer;
  transform: scale(1.1);
}
.weather-extra {
  --flow-margin: 0.75rem;
  padding: 1.2rem 3rem;
  border-radius: 0.85rem;
  background-color: #f6f4fa;
  box-shadow: 0 1px 1px rgb(0, 0, 0, 0.25);
}

.weather-extra hr {
  border: 1px solid var(--clr-light-2);
  opacity: 0.2;
}

.weather-icon-extra {
  position: absolute;
  opacity: 0.5;
  left: -1.25rem;
  width: 1.25rem;
}

.body {
  font-weight: normal;
  font-family: 'Source Sans Pro';
}
</style>
