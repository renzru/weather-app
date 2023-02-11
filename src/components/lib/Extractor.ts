import { IWeatherData, IOpenWeatherData, IOpenWeatherDataComplete, IGeoData } from './Data';

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

class OpenWeatherCompleteExtractor implements IExtractor {
  extractData(body: any): IOpenWeatherDataComplete {
    const {
      weather,
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      sea_level,
      grnd_level,
    } = body.main;
    const { speed, gust, deg } = body.wind;
    const { all: clouds } = body.clouds;
    const { description } = body.weather[0];
    const { name: location } = body;
    const { country } = body.sys;

    return {
      weather,
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      wind_speed: speed,
      wind_gust: gust,
      wind_deg: deg,
      sea_level,
      grnd_level,
      clouds,
      description,
      location,
      country,
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

export {
  type IExtractor,
  OpenWeatherExtractor,
  OpenWeatherCompleteExtractor,
  type IGeoExtractor,
  GeocodingExtractor,
};
