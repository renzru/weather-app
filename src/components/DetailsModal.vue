<script setup lang="ts">
import { IWeatherData } from './lib/Data';
import { OpenWeatherCompleteExtractor } from './lib/Extractor';
import { OpenWeatherComplete } from './lib/Weather';

const weatherEXT = new OpenWeatherCompleteExtractor();
const weather = new OpenWeatherComplete();

const props = defineProps<{
  details: IWeatherData;
}>();

weather.update(weatherEXT.extractData(props.details));
console.log(weather);
</script>

<template>
  <h1>{{ weather.get('temp_max') }}</h1>
</template>
