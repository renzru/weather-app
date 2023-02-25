import { IForecastData, IGeoData, IOpenWeatherData, IWeatherData } from './Data';
import { IWeatherAPI, IGeoAPI, IGeoDirectAPI } from './API';
import { IWeather } from './Weather';
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

class ForecastService {
  private _weatherAPI: IWeatherAPI;
  private _extractor: IExtractor;

  constructor(weatherAPI: IWeatherAPI, extractor: IExtractor) {
    this._weatherAPI = weatherAPI;
    this._extractor = extractor;
  }

  async getForecast(lat: number, long: number): Promise<Array<IForecastData>> {
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

class GeoDirectService {
  private _geoAPI: IGeoDirectAPI;
  private _extractor: IGeoExtractor;

  constructor(geoAPI: IGeoDirectAPI, extractor: IGeoExtractor) {
    this._geoAPI = geoAPI;
    this._extractor = extractor;
  }

  async getLocation(location: string): Promise<any> {
    return this._extractor.extractData(await this._geoAPI.fetchLocation(location));
  }
}

class OpenWeatherIconService {
  private _descriptionMap: Map<string, string> = new Map<string, string>([
    ['heavy thunderstorm', 'weather-icons/severe-thunderstorm.svg'],
    [
      'thunderstorm with rain' || 'thunderstorm with light rain' || 'thunderstorm with heavy rain',
      'weather-icons/rain-thunderstorm.svg',
    ],
    ['shower rain', 'weather-icons/scattered-showers.svg'],
    ['heavy intensity rain', 'weather-icons/heavy-rain.svg'],
    ['heavy snow' || 'heavy shower snow', 'weather-icons/blizzard.svg'],
    ['sleet', 'weather-icons/sleet.svg'],
    ['fog', 'weather-icons/fog.svg'],
    ['few clouds', 'weather-icons/partly-cloudy.svg'],
  ]);

  private _mainMap: Map<string, string> = new Map<string, string>([
    ['Thunderstorm', 'weather-icons/severe-thunderstorm.svg'],
    ['Drizzle', 'weather-icons/drizzle-sun.svg'],
    ['Rain', 'weather-icons/rain.svg'],
    ['Snow', 'weather-icons/snow.svg'],
    ['Clear', 'weather-icons/sunny.svg'],
    ['Clouds', 'weather-icons/cloudy.svg'],
  ]);

  getIcon(weather: string, description: string): string | undefined {
    return this._descriptionMap.get(description) || this._mainMap.get(weather);
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

export {
  WeatherService,
  ForecastService,
  GeoService,
  GeoDirectService,
  OpenWeatherIconService,
  UserGeoService,
};
