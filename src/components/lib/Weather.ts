import { IWeatherData, IOpenWeatherData } from './Data';

interface IWeather {
  update(data: IWeatherData): void;
  get(property: string): any;
}

class OpenWeather implements IWeather {
  private _data: IOpenWeatherData = {
    icon: '',
    weather: '',
    temp: 0,
    description: '',
    feels_like: 0,
    temp_min: 0,
    temp_max: 0,
    visibility: 0,
    pressure: 0,
    humidity: 0,
    wind_speed: 0,
    wind_gust: 0,
    wind_deg: 0,
    sea_level: 0,
    grnd_level: 0,
    clouds: 0,
  };

  update(data: IOpenWeatherData): void {
    this._data = data;
  }

  get(property: keyof IOpenWeatherData): any {
    return this._data[property];
  }

  getList(): any {
    return this._data;
  }
}

export { type IWeather, OpenWeather };
