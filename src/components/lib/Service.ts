import { IGeoData, IWeatherData } from './Data';
import { IWeatherAPI, IGeoAPI } from './API';

class WeatherService {
  private _weatherAPI: IWeatherAPI;

  constructor(weatherAPI: IWeatherAPI) {
    this._weatherAPI = weatherAPI;
  }

  async getWeather(lat: number, long: number): Promise<IWeatherData> {
    return this._weatherAPI.fetchWeather(lat, long);
  }
}

class GeoService {
  private _geoAPI: IGeoAPI;

  constructor(geoAPI: IGeoAPI) {
    this._geoAPI = geoAPI;
  }

  async getLocation(lat: number, long: number): Promise<IGeoData> {
    return this._geoAPI.fetchLocation(lat, long);
  }
}

export { WeatherService, GeoService };
