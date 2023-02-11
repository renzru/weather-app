import { IWeatherData, IOpenWeatherData, IGeoData } from './Data';

interface IExtractor {
  extractData(body: any): IWeatherData;
}

class OpenWeatherExtractor implements IExtractor {
  extractData(body: any): IOpenWeatherData {
    // Destructuring
    const { main: weather, icon, description } = body.weather[0];
    const { temp, humidity, feels_like, pressure } = body.main;
    const { speed: wind_speed } = body.wind;

    return {
      icon,
      weather,
      description,
      temp,
      humidity,
      feels_like,
      pressure,
      wind_speed,
    };
  }
}

// For Geodata

interface IGeoExtractor {
  extractData(body: any): IGeoData;
}

class GeocodingExtractor implements IGeoExtractor {
  extractData(body: any): IGeoData {
    if (!body.length) {
      return {};
    }

    const { country, state, name: city } = body[0];

    return {
      country,
      state,
      city,
    };
  }
}

export { type IExtractor, OpenWeatherExtractor, type IGeoExtractor, GeocodingExtractor };
