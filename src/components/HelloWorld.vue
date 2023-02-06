<script setup lang="ts">
import { ref } from 'vue';
import { OpenWeatherAPI } from './lib/WeatherAPI';
import { OpenWeatherExtractor } from './lib/WeatherExtractor';
import { WeatherService } from './lib/WeatherService';

const count = ref(0);

// TODO: configure prettier-eslint

const extractor = new OpenWeatherExtractor();
const api = new OpenWeatherAPI(extractor);
const service = new WeatherService(api);
</script>

<template></template>

<style scoped></style>
