interface IWeatherData {
  weather: string;
  description: string;
  temp: number;
}

interface IOpenWeatherData extends IWeatherData {
  icon?: string;
  humidity?: number;
  feels_like?: number;
  pressure?: number;
  wind_speed?: number;
}

interface IGeoData {
  country: string;
  city: string;
}

interface IUserData {
  lat: number;
  long: number;
}

export { type IWeatherData, type IOpenWeatherData, type IGeoData };
