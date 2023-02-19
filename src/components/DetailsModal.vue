<script setup lang="ts">
import { IWeatherData } from './lib/Data';
import { OpenWeather } from './lib/Weather';

const weather = new OpenWeather();
const props = defineProps<{
  details: IWeatherData;
}>();

const emit = defineEmits(['hide']);

weather.update(props.details);
console.log(props.details);
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
  <div class="details flow">
    <button @click="emit('hide')">X</button>
    <article>
      <div class="divider flex">
        <h1 class="fs-normal uppercase bold text-light-2">Main</h1>
        <hr />
      </div>
      <p>
        <span class="bold">Weather:</span>
        {{
          weather.get('description').charAt(0).toUpperCase() + weather.get('description').slice(1)
        }}
      </p>
      <p>
        <span class="bold">Temp:</span>
        {{ weather.get('temp') }}°
      </p>
      <p>
        <span class="bold">Humidity:</span>
        {{ weather.get('humidity') }}%
      </p>

      <p>
        <span class="bold">Cloudiness:</span>
        {{ weather.get('clouds') }}%
      </p>
    </article>

    <article>
      <div class="divider flex">
        <h1 class="fs-normal uppercase bold text-light-2">Temperature</h1>
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
    </article>

    <article>
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
        {{ weather.get('wind_gust') || 'N/A' }}m/s
      </p>
    </article>

    <article>
      <div class="divider flex">
        <h1 class="fs-normal uppercase bold text-light-2">Atmospheric Pressure</h1>
        <hr />
      </div>

      <p>
        <span class="bold">Sea Level:</span>
        {{ weather.get('sea_level') || weather.get('pressure') || 'N/A' }} hPa
      </p>

      <p>
        <span class="bold">Ground Level:</span>
        {{ weather.get('grnd_level') || 'N/A' }} hPa
      </p>
    </article>

    <article>
      <div class="divider flex">
        <h1 class="fs-normal uppercase bold text-light-2">Other</h1>
        <hr />
      </div>

      <p>
        <span class="bold">Visibility:</span>
        {{ weather.get('visibility') / 1000 }}km
      </p>
    </article>
  </div>
</template>

<style scoped>
article .divider {
  margin-bottom: 0.75rem;
}
.details {
  --flow-margin: 2.25rem;
  z-index: 2;
  position: absolute;
  padding: 5rem;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 10%;
  width: 40rem;
  border-radius: 0.4rem;
  background-color: white;
  box-shadow: 0px 0px 1px 100vw rgba(0, 0, 0, 0.75);
}

.divider {
  position: relative;
  align-items: center;
}

.divider hr {
  outline: 1px solid #f1f1f1;
  border: none;
  width: 100%;
}
.divider h1 {
  position: absolute;
  line-height: 0;
  left: 0;
  padding-block: 5px;
  padding-right: 8px;
  background-color: white;
}
</style>
