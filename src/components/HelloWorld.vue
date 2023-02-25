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
import DetailsModal from './InfoModal.vue';
import Forecast from './Forecast.vue';

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
let queryMode: Ref<string> = ref('Name');
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

async function queryLocation(): Promise<void> {
  const { lat, lon } = await geoDirectService.getLocation(location.value);
  [latitude.value, longitude.value] = [lat, lon];
  updateData(lat, lon);
}

function queryCoord(): void {
  updateData(latitude.value, longitude.value).catch((err) => console.log(err));
}
</script>

<template>
  <div class="">
    <div class="query-container flex flow">
      <div>
        <h1 class="fs-normal bold">Mode</h1>
        <select v-model="queryMode">
          <option>Name</option>
          <option>Coordinates</option>
        </select>
      </div>
      <div class="flow" v-show="queryMode === 'Name'">
        <div>
          <h1 class="fs-normal bold">Location</h1>
          <input v-model="location" required placeholder="Enter a location." />
        </div>
        <button class="btn-style-1 query-btn" @click="queryLocation()">Search</button>
      </div>
      <form class="flow" v-show="queryMode === 'Coordinates'">
        <div>
          <h1 class="fs-normal bold">Latitude</h1>
          <input v-model="latitude" required step="any" min="-90" max="90" type="number" />
        </div>
        <div>
          <h1 class="fs-normal bold">Longitude</h1>
          <input v-model="longitude" required step="any" min="-180" max="180" type="number" />
        </div>
        <button class="btn-style-1 query-btn" @click="queryCoord()">Search</button>
      </form>
    </div>

    <main v-if="loaded">
      <div>
        <section>
          <h1 class="fs-300">Today</h1>
          <h2 class="fs-600 bold">{{ geo.get('city') }}</h2>
        </section>
        <section class="weather-data-container flex">
          <img
            class="weather-icon"
            :src="iconService.getIcon(weather.get('weather'), weather.get('description'))" />
          <h1 class="fs-900 temp">{{ weather.get('temp') }}°</h1>
          <div class="info-btn-wrapper">
            <h2 class="fs-normal">Experiencing {{ weather.get('description') }}.</h2>
            <button class="info-btn btn-style-1 fs-300">More Info</button>
          </div>
        </section>
        <section>
          <h2 class="fs-600 bold">Forecast</h2>
          <Forecast :lat="latitude" :long="longitude" />
        </section>
      </div>
    </main>

    <!-- Loading Screen -->
    <div v-show="!loaded" class="loading-wrapper flex">
      <img src="/loading.png" class="loading-icon" />
    </div>
    <!-- Details Modal -->
    <!-- <Transition name="slide">
    <DetailsModal v-if="loaded && showDetails" @hide="toggleDetails()" :details="weatherDetails" />
  </Transition> -->
  </div>
</template>

<style scoped lang="scss">
main {
  display: grid;
  grid-template-areas: '. content .';
  grid-template-columns: minmax(2rem, 1fr) clamp(10rem, 80vw, 40rem) minmax(2rem, 1fr);
  height: 100vh;
  padding-block: 2.5rem;
  background-color: var(--clr-white);

  > div {
    grid-area: content;
  }
}

.query-container {
  flex-direction: column;
  place-content: start;
  position: fixed;
  z-index: 2;
  width: 100%;
  bottom: 0;
  padding: 2rem;
  background-color: var(--clr-white);
  box-shadow: 0 0 1px rgb(0, 0, 0, 0.25);

  > * {
    width: 100%;
  }

  select,
  input {
    border: 1px solid var(--clr-light-1);
    border-radius: 0.25rem;
    background-color: var(--clr-white);
    padding: 0.25rem;
    width: 100%;
    font-family: 'Inter', sans-serif !important;
    color: var(--clr-black);

    &[type='number'] {
      -webkit-appearance: none;
      -moz-appearance: textfield;
    }
  }
  .query-btn {
    width: 100%;
    padding-block: 0.25rem;
    border-radius: 0.25rem;
  }
}

.dark-mode .query-container {
  background-color: #121212;
  select,
  input {
    border: 1px solid var(--clr-white);
  }
}

@media (min-width: 45em) {
  .query-container {
    left: 0;
    height: 100%;
    width: clamp(10rem, 20vw, 25rem);
    bottom: unset;
  }
}

.weather-data-container {
  place-items: center;
  flex-direction: column;

  &.dark-mode {
    background-color: red !important;
  }
  .weather-icon {
    width: clamp(10rem, 6vw, 10rem);
    margin: 0 auto;
    margin-bottom: 1rem;
    animation-fill-mode: forwards;
    animation: floating 6s infinite ease-in-out;
  }
  .temp {
    font-weight: 700;
  }
  .info-btn-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    .info-btn {
      display: inline-block;
      position: relative;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
    }
  }
}

@keyframes floating {
  0% {
    transform: translateY(2%);
  }

  60% {
    transform: translateY(-2%);
  }

  80% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(2%);
  }
}

.loading-wrapper {
  width: 100vw;
  height: 100vh;
  place-items: center;

  .loading-icon {
    margin: 0 auto;
    width: 8rem;
    animation: rotate 1.25s infinite linear;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.weather-icon-extra {
  position: absolute;
  opacity: 0.5;
  left: -1.25rem;
  width: 1.25rem;
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
