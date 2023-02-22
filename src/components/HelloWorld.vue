<script setup lang="ts">
import { Ref, ref, onBeforeMount, watch } from 'vue';
import { IWeatherData } from './lib/Data';
import { OpenWeather } from './lib/Weather';
import { OpenWeatherGeo } from './lib/Geo';
import { GeocodingAPI, OpenWeatherAPI, GeocodingDirectAPI } from './lib/API';
import {
  GeoService,
  OpenWeatherIconService,
  WeatherService,
  UserGeoService,
  GeoDirectService,
} from './lib/Service';
import {
  GeocodingDirectExtractor,
  GeocodingExtractor,
  OpenWeatherExtractor,
} from './lib/Extractor';
import DetailsModal from './DetailsModal.vue';

const weatherEXT = new OpenWeatherExtractor();
const weatherAPI = new OpenWeatherAPI();
const weatherService = new WeatherService(weatherAPI, weatherEXT);
const weather = new OpenWeather();

const geoEXT = new GeocodingExtractor();
const geoAPI = new GeocodingAPI();
const geoService = new GeoService(geoAPI, geoEXT);
const geo = new OpenWeatherGeo();

const geoDirectAPI = new GeocodingDirectAPI();
const geoDirectEXT = new GeocodingDirectExtractor();
const geoDirectService = new GeoDirectService(geoDirectAPI, geoDirectEXT);

const iconService = new OpenWeatherIconService();
const userGeoService = new UserGeoService();

let location: Ref<string> = ref('');
let latitude: Ref<number> = ref(0);
let longitude: Ref<number> = ref(0);
let loaded: Ref<boolean> = ref(false);
let showDetails: Ref<boolean> = ref(false);
// let weatherIcon: Ref<string | undefined> = ref('');
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

async function updateData(lat: number, long: number): Promise<void> {
  loaded.value = false;
  const [weatherData, geoData] = await Promise.all([
    weatherService.getWeather(lat, long),
    geoService.getLocation(lat, long),
  ]);

  weather.update(weatherData);
  geo.update(geoData);
  loaded.value = true;
}

function toggleDetails(): void {
  weatherDetails.value = weather.getList();
  showDetails.value = !showDetails.value;
}

async function submitQueryLocation(): Promise<void> {
  loaded.value = false;
  try {
    await geoDirectService.getLocation(location.value).then(({ lat, lon }) => {
      [latitude.value, longitude.value] = [lat, lon];
    });

    await updateData(latitude.value, longitude.value);
  } catch (err) {
    console.log(err);
  }
  loaded.value = true;
}

async function submitQueryCoord(): Promise<void> {
  loaded.value = false;
  await updateData(latitude.value, longitude.value).catch((err) => console.log(err));
  loaded.value = true;
}
</script>

<template>
  <input v-model="location" />
  <input v-model="latitude" max="90" type="number" />
  <input v-model="longitude" max="180" type="number" />
  <button @click="submitQueryLocation()">submit loc</button>
  <button @click="submitQueryCoord()">submit coord</button>
  <!-- Loading Screen -->
  <!-- <div v-show="!loaded" class="loading-wrapper flex">
    <img src="/loading.png" class="loading-icon" />
  </div> -->
  <!-- Details Modal -->
  <!-- <Transition name="slide">
    <DetailsModal v-if="loaded && showDetails" @hide="toggleDetails()" :details="weatherDetails" />
  </Transition> -->
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

.loading-wrapper {
  width: 100vw;
  height: 100vh;
  place-items: center;
}
.loading-icon {
  margin: 0 auto;
  width: 8rem;
  animation: rotate 1.25s infinite linear;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

/* Vue Transitions */
.slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
.slide-leave-from {
  opacity: 1;
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
