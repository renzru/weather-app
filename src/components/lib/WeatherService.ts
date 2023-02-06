import { IWeatherData } from './WeatherData';
import { WeatherAPI } from './WeatherAPI';

class WeatherService {
  private _weatherAPI: WeatherAPI;

  constructor(weatherAPI: WeatherAPI) {
    this._weatherAPI = weatherAPI;
  }

  async getWeather(long: number, lat: number): Promise<IWeatherData> {
    return this._weatherAPI.fetchWeather(long, lat);
  }
}

export { WeatherService };
