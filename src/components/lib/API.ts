import { IWeatherData, IOpenWeatherData, IGeoData } from './Data';
import { OpenWeatherExtractor, GeocodingExtractor } from './Extractor';

interface IWeatherAPI {
  fetchWeather(lat: number, long: number): Promise<IWeatherData>;
}

class OpenWeatherAPI implements IWeatherAPI {
  async fetchWeather(lat: number, long: number): Promise<IOpenWeatherData> {
    const url: URL = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.search = new URLSearchParams({
      lat: lat.toString(),
      lon: long.toString(),
      appid: 'f4bffb3aa4a3d21bc95242b50d8471df',
      units: 'metric',
    }).toString();

    const data = await (await fetch(url.toString(), { mode: 'cors' })).json();
    return data;
  }
}

interface IGeoAPI {
  fetchLocation(lat: number, long: number): Promise<IGeoData>;
}

class GeocodingAPI implements IGeoAPI {
  async fetchLocation(lat: number, long: number) {
    const url: URL = new URL('http://api.openweathermap.org/geo/1.0/reverse');
    url.search = new URLSearchParams({
      lat: lat.toString(),
      lon: long.toString(),
      appid: 'f4bffb3aa4a3d21bc95242b50d8471df',
      limit: '1',
    }).toString();

    const data = await (await fetch(url.toString(), { mode: 'cors' })).json();

    return data;
  }
}

export { type IWeatherAPI, OpenWeatherAPI, type IGeoAPI, GeocodingAPI };
