import { IWeatherData } from './WeatherData';

interface IExtractor {
  extractData(body: any): IWeatherData;
}

class OpenWeatherExtractor implements IExtractor {
  extractData(body: any): IWeatherData {
    // Destructuring
    const { main: weather, description } = body.weather;
    const { humidity, feels_like, pressure } = body.main;
    const { speed: wind_speed } = body.wind;

    return {
      weather,
      description,
      humidity,
      feels_like,
      pressure,
      wind_speed,
    };
  }
}

export { type IExtractor, OpenWeatherExtractor };
