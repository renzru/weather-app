<script setup lang="ts">
import { onBeforeMount, ref, Ref } from 'vue';
import { OpenWeatherForecastAPI } from './lib/API';
import { OpenWeatherForecastExtractor } from './lib/Extractor';
import { ForecastService, OpenWeatherIconService, WeatherService } from './lib/Service';
import { OpenWeatherForecast } from './lib/Weather';

const forecast = new OpenWeatherForecast();
const forecastAPI = new OpenWeatherForecastAPI();
const forecastEXT = new OpenWeatherForecastExtractor();
const forecastService = new ForecastService(forecastAPI, forecastEXT);
const iconService = new OpenWeatherIconService();
const props = defineProps<{
  lat: number;
  long: number;
}>();

let loaded: Ref<boolean> = ref(false);

const updateForecast = async () => {
  loaded.value = false;
  forecast.update(await forecastService.getForecast(props.lat, props.long));
  loaded.value = true;
};

updateForecast();
</script>

<template>
  <ul class="forecast-container grid" v-if="loaded">
    <li class="forecast-card grid" v-for="data in forecast.getList()">
      <h1 class="fs-normal clr-light-1">{{ data.date }}</h1>
      <img :src="iconService.getIcon(data.weather, data.description)" />
      <div>
        <p class="fs-300 bold">{{ data.temp }}°</p>
        <p class="fs-300">{{ Math.round(data.precipitation * 100) }}% rain</p>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.forecast-container {
  grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  gap: 0.25rem;
}
.forecast-card {
  grid-auto-rows: min-content;
  place-items: center;
  gap: 1rem;
  padding: 0.45rem 1rem;
  text-align: center;
  border-radius: 0.25rem;
  background-color: var(--clr-white);
  box-shadow: 0 0px 2px rgb(0, 0, 0, 0.25);
  transition: all 0.25s ease;

  &:hover {
    outline: 1px solid #58a9e3;
  }
}

@media (min-width: 30em) {
}
</style>
