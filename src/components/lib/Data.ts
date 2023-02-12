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
  temp_min?: number;
  temp_max?: number;
  visibility?: number;
  wind_gust?: number;
  wind_deg?: number;
  sea_level?: number;
  grnd_level?: number;
  clouds?: number;
}

// Optional because sometimes Geo Data is unavailable
interface IGeoData {
  country?: string;
  state?: string;
  city?: string;
}

interface IUserData {
  lat: number;
  long: number;
}

export { type IWeatherData, type IOpenWeatherData, type IGeoData };
