import { IWeatherData, IOpenWeatherData, IGeoData, IForecastData } from './Data';
import { format } from 'date-fns';
interface IExtractor {
  extractData(body: any): IWeatherData;
}

class OpenWeatherExtractor implements IExtractor {
  extractData(body: any): IOpenWeatherData {
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

class OpenWeatherForecastExtractor implements IExtractor {
  extractData(body: any): IForecastData {
    const dailyForecasts = body.list
      .filter((data) => data.dt_txt.split(' ')[1] === '12:00:00')
      .map((data) => {
        return {
          weather: data.weather[0].main,
          date: format(new Date(Date.parse(data.dt_txt.split(' ')[0])), 'dd eee '),
          description: data.weather[0].description,
          temp: data.main.temp,
          precipitation: data.pop,
        };
      });

    return dailyForecasts;
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
  OpenWeatherForecastExtractor,
  type IGeoExtractor,
  GeocodingDirectExtractor,
  GeocodingExtractor,
};
