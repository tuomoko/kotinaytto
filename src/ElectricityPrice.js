// Fetch data from own API that uses ENTSO-E Transparency API
import React from "react";

function ElectricityPrice()
{
  const api_url = "https://vider.kapsi.fi/entsoprice/"
  const [data,setData]=React.useState([]);

  const getData=()=>{
    fetch(api_url)
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setData(myJson)
      });
  }
  React.useEffect(()=>{
    getData()
  },[])
  
  return data;
}
export default ElectricityPrice;
