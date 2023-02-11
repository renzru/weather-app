import { IGeoData } from './Data';

interface Geo {
  update(data: IGeoData): void;
  get(property: string): any;
}

class OpenWeatherGeo implements Geo {
  private _data: IGeoData = {
    country: '',
    state: undefined,
    city: '',
  };

  update(data: IGeoData): void {
    this._data = data;
  }

  get(property: keyof IGeoData): any {
    return this._data[property];
  }
}

export { OpenWeatherGeo };
