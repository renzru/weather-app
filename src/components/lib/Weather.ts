import { IWeatherData, IOpenWeatherData } from './Data';

interface Weather {
  update(data: IWeatherData): void;
  get(property: string): any;
}

class OpenWeather implements Weather {
  private _data: IOpenWeatherData = {
    weather: '',
    description: '',
    temp: 0,
    humidity: 0,
    feels_like: 0,
    pressure: 0,
    wind_speed: 0,
  };

  update(data: IOpenWeatherData): void {
    this._data = data;
  }

  get(property: keyof IOpenWeatherData): any {
    return this._data[property];
  }
}

export { type Weather, OpenWeather };
