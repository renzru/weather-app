<script setup lang="ts">
import { IWeatherData } from './lib/Data';
import { OpenWeatherExtractor } from './lib/Extractor';
import { OpenWeather } from './lib/Weather';

const weatherEXT = new OpenWeatherExtractor();
const weather = new OpenWeather();

const props = defineProps<{
  details: IWeatherData;
}>();

weather.update(props.details);

function getDirection(deg: number): string {
  if (deg > 337.5 || deg < 22.5) return 'N';
  if (deg > 292.5) return 'NW';
  if (deg > 247.5) return 'W';
  if (deg > 202.5) return 'SW';
  if (deg > 157.5) return 'S';
  if (deg > 122.5) return 'SE';
  if (deg > 67.5) return 'E';
  if (deg > 22.5) return 'NE';
  return '';
}
</script>

<template>
  <div class="details">
    <div class="divider flex">
      <h1 class="fs-normal uppercase bold text-light-2">Main</h1>
      <hr />
    </div>
    <p>
      <span class="bold">Weather:</span>
      {{ weather.get('description').charAt(0).toUpperCase() + weather.get('description').slice(1) }}
    </p>
    <p>
      <span class="bold">Temp:</span>
      {{ weather.get('temp') }}°
    </p>
    <p>
      <span class="bold">Humidity:</span>
      {{ weather.get('humidity') }}%
    </p>

    <div class="divider flex">
      <h1 class="fs-normal uppercase bold text-light-2">Temp</h1>
      <hr />
    </div>

    <p>
      <span class="bold">Max Temp:</span>
      {{ weather.get('temp_max') }}°
    </p>
    <p>
      <span class="bold">Min Temp:</span>
      {{ weather.get('temp_min') }}°
    </p>

    <div class="divider flex">
      <h1 class="fs-normal uppercase bold text-light-2">Wind</h1>
      <hr />
    </div>

    <p>
      <span class="bold">Wind Direction:</span>
      {{ weather.get('wind_deg') }}° {{ getDirection(weather.get('wind_deg')) }}
    </p>
    <p>
      <span class="bold">Wind Speed:</span>
      {{ weather.get('wind_speed') }}m/s
    </p>
    <p>
      <span class="bold">Wind Gust:</span>
      {{ weather.get('wind_gust') || 'N/A' }}
    </p>

    <p>
      <span class="bold">Visibility:</span>
      {{ weather.get('visibility') / 1000 }}km
    </p>
    <p>
      <span class="bold">Cloudiness:</span>
      {{ weather.get('clouds') }}%
    </p>
  </div>
  <div class="background" />
</template>

<style scoped>
.details {
  z-index: 2;
  position: absolute;
  padding: 5rem;
  margin: 0 auto;
  background-color: white;
  left: 0;
  right: 0;
  width: 40rem;
}

.background::before {
  content: '';
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  background-color: rgb(0, 0, 0, 0.5);
}

.divider {
  position: relative;
  align-items: center;
}

.divider hr {
  height: 1.2px;
  background-color: var(--clr-light-1);
  border: none;
  width: 100%;
}
.divider h1 {
  position: absolute;
  line-height: 0;
  left: 1rem;
  padding: 5px;
  background-color: white;
}
</style>
