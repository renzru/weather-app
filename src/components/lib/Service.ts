import { IGeoData, IWeatherData } from './Data';
import { IWeatherAPI, IGeoAPI } from './API';
import { IExtractor, IGeoExtractor } from './Extractor';

// TODO: Remove caching because data here is real-time/volatile and shouldnt be cached
class WeatherService {
  private _weatherAPI: IWeatherAPI;
  private _extractor: IExtractor;

  constructor(weatherAPI: IWeatherAPI, extractor: IExtractor) {
    this._weatherAPI = weatherAPI;
    this._extractor = extractor;
  }

  async getWeather(lat: number, long: number): Promise<IWeatherData> {
    return this._extractor.extractData(await this._weatherAPI.fetchWeather(lat, long));
  }
}

class GeoService {
  private _geoAPI: IGeoAPI;
  private _extractor: IGeoExtractor;

  constructor(geoAPI: IGeoAPI, extractor: IGeoExtractor) {
    this._geoAPI = geoAPI;
    this._extractor = extractor;
  }

  async getLocation(lat: number, long: number): Promise<IGeoData> {
    return this._extractor.extractData(await this._geoAPI.fetchLocation(lat, long));
  }
}

class IconService {
  getIcon(id: string): string {
    return `http://openweathermap.org/img/wn/${id}@2x.png`;
  }
}

class UserGeoService {
  getUserGeo() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

export { WeatherService, GeoService, IconService, UserGeoService };
