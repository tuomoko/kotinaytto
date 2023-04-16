import { useSettings } from './SettingsContext';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

function Weather() {
    const {weatherConfig} = useSettings();
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: weatherConfig.API_KEY,
        lat: weatherConfig.LAT,
        lon: weatherConfig.LON,
        lang: 'en',
        unit: 'metric', // values are (metric, standard, imperial)
      });
      
    if (errorMessage) {
        console.log(errorMessage);
        return <p>Error :(</p>;
    }
    return (
        <ReactWeather
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          locationLabel={weatherConfig.LOCATION_LABEL}
          unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
          showForecast
        />
      );
  }

export default Weather;