import { IWeatherData } from './WeatherData';
import { IExtractor } from './WeatherExtractor';

interface WeatherAPI {
  fetchWeather(long: number, lat: number): Promise<IWeatherData>;
}

class OpenWeatherAPI implements WeatherAPI {
  private _extractor: IExtractor;

  constructor(extractor: IExtractor) {
    this._extractor = extractor;
  }

  async fetchWeather(long: number, lat: number): Promise<IWeatherData> {
    const url: URL = new URL('https://api.openweathermap.org/data/2.5/weather');
    const params = new URLSearchParams({
      lon: long.toString(),
      lat: lat.toString(),
      appid: 'f4bffb3aa4a3d21bc95242b50d8471df',
      units: 'metric',
    });

    url.search = params.toString();

    const res = await fetch(url.toString(), { mode: 'cors' });
    const data = await res.json();

    return this._extractor.extractData(data);
  }
}

export { type WeatherAPI, OpenWeatherAPI };
