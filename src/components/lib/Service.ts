import { IGeoData, IWeatherData } from './Data';
import { IWeatherAPI, IGeoAPI } from './API';
import { IExtractor, IGeoExtractor } from './Extractor';

// TODO: implement caching
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
  private _cache: Map<string, IGeoData>;

  constructor(geoAPI: IGeoAPI, extractor: IGeoExtractor) {
    this._geoAPI = geoAPI;
    this._extractor = extractor;
    this._cache = new Map<string, IGeoData>();
  }

  async getLocation(lat: number, long: number): Promise<IGeoData> {
    const key = `${lat}, ${long}`;
    const cache = this._cache.get(key);

    if (cache) {
      return cache;
    } else {
      const location = this._extractor.extractData(await this._geoAPI.fetchLocation(lat, long));
      this._cache.set(key, location);
      return location;
    }
  }
}

export { WeatherService, GeoService };
