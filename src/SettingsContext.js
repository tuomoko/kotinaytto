import React from "react";
import configData from "./config.json";

// This is holding the settings for the display
export const SettingsContext = React.createContext();
export const useSettings = () => React.useContext(SettingsContext);

export const SettingsProvider = ({
    children
  }) => {
    
    return (
      <SettingsContext.Provider
        value={{
          stops: configData.STOPS, bikeRentalStations: configData.BIKE_STATIONS, electricityConfig: configData.ELECTRICITY, weatherConfig: configData.WEATHER
        }}
      >
        {children}
      </SettingsContext.Provider>
    );
  };

export default SettingsContext;