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
      <div class="flow">
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
          <section class="info-container grid">
            <div class="info-card flex">
              <svg
                class="info-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                viewBox="0 96 960 960"
                width="48">
                <path
                  fill="currentColor"
                  d="M255.615 856q-73.384 0-124.5-51.115Q80 753.769 80 680.385q0-67.924 47.038-120.577Q174.077 507.154 247 503.923q11.077-91.692 79.038-149.808Q394 296 480.231 296q97.154 0 165.538 69.577 68.385 69.577 68.385 169.192v51.692h24.615q58.077-2.307 99.654 36.193T880 720.846Q880 776 840.385 816q-39.616 40-95.539 40H255.615Zm0-30.769h489.231q43.462 0 73.923-30.462 30.462-30.461 30.462-73.923 0-42.692-30.462-73.154-30.461-30.461-73.923-30.461h-61.461v-82.462q0-84.923-58.731-146.461-58.731-61.539-144.423-61.539-73.077 0-132.846 48.885-59.77 48.884-71.616 129.577 63.077 8.692 108.923 53.615Q430.539 603.769 430.539 676h-30.77q0-60.692-42.461-100.962-42.462-40.269-103.154-40.269-59.923 0-101.654 42.462-41.731 42.461-41.731 103.154 0 59.923 42.462 102.384 42.461 42.462 102.384 42.462Z" />
              </svg>
              <p class="fs-300">{{ weather.get('clouds') }}%</p>
            </div>
            <div class="info-card flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="info-icon"
                height="48"
                viewBox="0 96 960 960"
                width="20">
                <path
                  fill="currentColor"
                  d="M480 916q-115.846 0-197.923-79.417Q200 757.165 200 641q0-58.963 22.692-107.288 22.692-48.325 59-88.405L480 251.384l198.308 193.923q36.308 40.08 59 89.559T760 641q0 115.165-81.577 195.083Q596.846 916 480 916ZM231.769 616.538h496.462Q724 573.846 706 537.115q-18-36.73-48.5-67.258L480 295.385 302.5 469.857Q272 500.385 254 537.115q-18 36.731-22.231 79.423Z" />
              </svg>
              <p class="fs-300">{{ weather.get('humidity') }}%</p>
            </div>
            <div class="info-card flex">
              <svg
                class="info-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                viewBox="0 96 960 960"
                width="48">
                <path
                  fill="currentColor"
                  d="M462.692 866.769q-37.846 0-63.577-19.923t-32.654-56.923h36.462q5.385 22.154 20.731 34.115Q439 836 462.692 836q29.308 0 46.962-17.769 17.654-17.769 17.654-48.308 0-30.538-17.654-49.038-17.654-18.5-46.962-18.5H100v-30.77h362.692q43.231 0 69.308 26.077 26.077 26.077 26.077 72.231 0 44.693-26.077 70.77-26.077 26.076-69.308 26.076ZM100 481.846v-30.769h523.385q39.307 0 62.461-23.269Q709 404.538 709 363.538t-23.154-64.269Q662.692 276 623.385 276q-34.154 0-55.385 18.577-21.231 18.577-26.615 47.269h-32.308q6.923-43.385 37.692-70 30.769-26.615 76.616-26.615 51.769 0 84.077 32.423 32.307 32.423 32.307 85.884 0 53.462-32.307 85.885-32.308 32.423-84.077 32.423H100Zm665.846 313.846v-32.307q29.615-6.154 46.5-28.347 16.885-22.192 16.885-56.115 0-39.538-23.885-62.692-23.884-23.154-61.961-23.154H100v-30.769h643.385q52.769 0 84.692 32.307Q860 626.923 860 678.923q0 47.077-24.538 78.462-24.539 31.384-69.616 38.307Z" />
              </svg>
              <p class="fs-300">{{ weather.get('wind_speed') }}m/s</p>
            </div>
          </section>
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
    --flow-margin: 2.5rem;
    grid-area: content;
  }
}

.info-container {
  position: absolute;
  left: 0;
  gap: 1rem;

  .info-card {
    place-items: center;
    gap: 0.25rem;

    .info-icon {
      width: 2rem;
      height: 2rem;
      color: var(--clr-black);
    }
  }

  hr {
    background-color: var(--clr-black);
    height: 1rem;
    width: 1px;
    margin: unset;
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
  position: relative;
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
