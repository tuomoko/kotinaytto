// Fetch data from own API that uses ENTSO-E Transparency API
import React from "react";
import { useSettings } from './SettingsContext';

function ElectricityPrice()
{
  const {electricityConfig} = useSettings();
  const [data,setData]=React.useState([]);
  
  React.useEffect(()=>{
    const getData=()=>{
      fetch(electricityConfig.API_URL)
        .then(function(response){
          console.log(response)
          return response.json();
        })
        .then(function(myJson) {
          console.log(myJson);
          setData(myJson)
        });
    }
    getData()
  },[electricityConfig])
  
  return data;
}
export default ElectricityPrice;
