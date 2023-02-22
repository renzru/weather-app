import { IWeatherData, IOpenWeatherData, IGeoData } from './Data';

interface IExtractor {
  extractData(body: any): IWeatherData;
}

class OpenWeatherExtractor implements IExtractor {
  extractData(body: any): IOpenWeatherData {
    // Destructuring

    const { temp, feels_like, temp_min, temp_max, pressure, humidity, sea_level, grnd_level } =
      body.main;
    const { speed, gust, deg } = body.wind;
    const { all: clouds } = body.clouds;
    const { icon, main: weather, description } = body.weather[0];
    const visibility = body.visibility;

    return {
      icon,
      weather,
      temp,
      feels_like,
      temp_min,
      temp_max,
      visibility,
      pressure,
      humidity,
      wind_speed: speed,
      wind_gust: gust,
      wind_deg: deg,
      sea_level,
      grnd_level,
      clouds,
      description,
    };
  }
}

// For Geodata

interface IGeoExtractor {
  extractData(body: any): any;
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

class GeocodingDirectExtractor implements IGeoExtractor {
  extractData = (body: any): any => {
    if (!body.length) {
      return {};
    }

    console.log(body);
    const { lat, lon } = body[0];

    return {
      lat,
      lon,
    };
  };
}
export {
  type IExtractor,
  OpenWeatherExtractor,
  type IGeoExtractor,
  GeocodingDirectExtractor,
  GeocodingExtractor,
};
