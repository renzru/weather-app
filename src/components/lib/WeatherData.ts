interface IWeatherData {
  weather: string;
  description: string;
  humidity: number;
  feels_like: number;
  pressure: number;
  wind_speed: number;
}

export { type IWeatherData };
